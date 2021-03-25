import React, { useState, useEffect, useContext } from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faFastForward, faFastBackward } from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from '../../App';
import Loading from '../../layout/Loading';

import styled from 'styled-components';

const TableViewContainer = styled.div`
    padding: 40px;

    hr {
        border: 1px solid #ccc;
        border-bottom: none;
    }
`;

const PaginationLinks = styled.div`
    padding: 20px;
    text-align: center;

    a {
        color: #444;
        margin: 0 10px;
        text-decoration: none;

        &:hover {
            color: #777;
        }

        &.disabled {
            color: #999;
            pointer-events: none;
        }
    }
`;

const ViolationTable = styled.table`
    background-color: white;
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 0 10px #aaa;

    thead {
        background-color: #f5f5f5;
        text-align: left;
        border-bottom: 2px solid #eee;

        th { padding: 10px; }
    }

    td {
        padding: 8px 15px;
        border: none;
    }

    tr {
        cursor: pointer;
        border-bottom: 1px solid #eaeaea;

        &:hover {
            background-color: rgb(202, 255, 249);
        }
    }
`;

const ViolationStatus = styled.span`
    font-weight: bold;
`;

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default props => {
    const { authGet } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const query = useQuery();
    const history = useHistory();

    useEffect(() => {
        let url = '/violations';
        const page = query.get("page");
        const limit = query.get("limit");

        if(page || limit) url += '?';

        if(page) url += `page=${page}`;
        if(limit) url += `limit=${limit}`;

        setLoading(true);
        authGet(url).then(res => {
            setLoading(false);
            setData(res.data);
        });
    }, [query.get("page")]);

    const status = apiStatus => {
        switch(apiStatus) {
            case "received" : return <ViolationStatus style={{color: '#6c6cff'}}>Получен</ViolationStatus>;
            case "rejected" : return <ViolationStatus style={{color: '#ff3939'}}>Отхвърлен</ViolationStatus>;
            case "approved" : return <ViolationStatus style={{color: '#46df00'}}>Одобрен</ViolationStatus>;
            case "replaced" : return <ViolationStatus style={{color: '#ecd40e'}}>Редактиран</ViolationStatus>;
            default: return apiStatus;
        }
    };

    const renderLinks = () => {
        const firstAvail = data.meta.currentPage !== 1;
        const lastAvail = data.meta.currentPage !== data.meta.totalPages;
        const nextAvail = data.links.next;
        const prevAvail = data.links.previous;

        return (
            <PaginationLinks>
                <Link className={firstAvail? '' : 'disabled'} to={data.links.first}>
                    <FontAwesomeIcon icon={faFastBackward}/> Първа
                </Link>
                <Link className={prevAvail? '' : 'disabled'} to={data.links.previous}>
                    <FontAwesomeIcon icon={faChevronLeft}/> Предишна
                </Link>
                <div style={{margin: '0 5px', display: 'inline-block', color: '#444', width: '60px'}}>
                    {data.meta.currentPage} / {data.meta.totalPages}
                </div>
                <Link className={nextAvail? '' : 'disabled'} to={data.links.next}>
                    Следваща <FontAwesomeIcon icon={faChevronRight}/>
                </Link>
                <Link className={lastAvail? '' : 'disabled'} to={data.links.last}>
                    Последна <FontAwesomeIcon icon={faFastForward}/>
                </Link>
            </PaginationLinks>
        );
    };

    const openViolation = id => {
        history.push(`/violation/${id}`);
    };

    return(
        <TableViewContainer>
            <h1>Обработване на сигнали</h1>
            <hr/>
            {
                !data? <Loading/> : [
                    renderLinks(),
                    <ViolationTable>
                    <thead>
                        <th>Назначен</th>
                        <th>№ на секция</th>
                        <th>Град</th>
                        <th>Автор</th>
                        <th>Описание</th>
                        <th>Статут</th>
                    </thead>
                    <tbody>
                    {
                        loading
                        ?   <tr><td colspan="6"><Loading/></td></tr>
                        :   data.items.map((violation, i) => 
                                <tr key={i} onClick={()=>openViolation(violation.id)}>
                                    <td>{violation.assignees.length === 0? <i>Свободен</i> : 'Зает'}</td>
                                    <td>{!violation.section? <i>Не е посочена секция</i> : violation.section.id}</td>
                                    <td>{violation.town.name}</td>
                                    <td>{violation.author.firstName} {violation.author.lastName}</td>
                                    <td>{violation.description.slice(0, 40) + '...'}</td>
                                    <td>{status(violation.status)}</td>
                                </tr>
                            )
                    }
                    </tbody>
                    </ViolationTable>,
                    renderLinks(),
                ]
            }
        </TableViewContainer>
    )
};