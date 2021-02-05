import React, { useEffect, useContext, useState } from 'react';

import axios from 'axios';
import { Link, useLocation, useHistory } from 'react-router-dom';

import { AuthContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faFastForward, faFastBackward } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';
import Loading from '../../layout/Loading';

const TableViewContainer = styled.div`
    padding: 40px;

    hr {
        border: 1px solid #ccc;
        border-bottom: none;
    }
`;

const PaginationLinks = styled.div`
    padding: 10px;
    text-align: center;

    a {
        color: #444;
        margin: 0 10px;
        text-decoration: none;
    }
`;

const ProtocolTable = styled.table`
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

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default props => {
    const { token } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const query = useQuery();
    const history = useHistory();

    useEffect(() => {
        let url = 'https://d1tapi.dabulgaria.bg/protocols';
        const page = query.get("page");
        const limit = query.get("limit");

        if(page || limit) url += '?';

        if(page) url += `page=${page}`;
        if(limit) url += `limit=${limit}`;

        setLoading(true);
        axios.get(url, { headers: { 'Authorization': `Bearer ${token}` }}).then(res => {
            setLoading(false);
            setData(res.data);
        });
    }, [query.get("page")]);

    const origin = apiOrigin => {
        switch(apiOrigin) {
            case 'ti-broish' : return "Ти Броиш";
            default: return apiOrigin;
        }
    };

    const status = apiStatus => {
        switch(apiStatus) {
            case "received" : return <span style={{color: 'green'}}>Получен</span>;
            default: return apiStatus;
        }
    };

    const renderLinks = () => {
        const firstAvail = true;
        const lastAvail = true;
        const nextAvail = data.links.next;
        const prevAvail = data.links.previous;

        return (
            <PaginationLinks>
                <Link to={data.links.first}>
                    <FontAwesomeIcon icon={faFastBackward}/> Първа
                </Link>
                <Link disabled={!prevAvail} to={data.links.previous}>
                    <FontAwesomeIcon icon={faChevronLeft}/> Предишна
                </Link>
                {data.meta.currentPage} / {data.meta.totalPages}
                <Link to={data.links.next}>
                    Следваща <FontAwesomeIcon icon={faChevronRight}/>
                </Link>
                <Link to={data.links.last}>
                    Последна <FontAwesomeIcon icon={faFastForward}/>
                </Link>
            </PaginationLinks>
        );
    };

    const openProtocol = id => {
        props.setBackPage(`/protocols?page=${query.get("page")}&limit=${query.get("limit")}`);
        history.push(`/protocols/${id}`);
    };

    return(
        <TableViewContainer>
            <h1>Протоколи</h1>
            <hr/>
            {
                !data? <Loading/> : [
                    renderLinks(),
                    <ProtocolTable>
                    <thead>
                        <th>№ на секция</th>
                        <th>Произход</th>
                        <th>Адрес</th>
                        <th>Статут</th>
                    </thead>
                    <tbody>
                    {
                        loading
                        ?   <tr><td colspan="4"><Loading/></td></tr>
                        :   data.items.map((protocol, i) => 
                                <tr key={i} onClick={()=>openProtocol(protocol.id)}>
                                    <td style={{textAlign: 'right'}}>{protocol.section.id}</td>
                                    <td>{origin(protocol.origin)}</td>
                                    <td>{protocol.section.place}</td>
                                    <td>{status(protocol.status)}</td>
                                </tr>
                            )
                    }
                    </tbody>
                    </ProtocolTable>,
                    renderLinks(),
                    <div>
                        Протоколи на страница: {query.get("limit")}
                        <Link to="/">10</Link>
                        <Link to="/">20</Link>
                        <Link to="/">50</Link>
                        <Link to="/">100</Link>
                    </div>
                ]
            }
        </TableViewContainer>
    );
};