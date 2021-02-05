import React, { useEffect, useContext, useState } from 'react';

import axios from 'axios';
import { Link, useLocation, useHistory } from 'react-router-dom';

import { AuthContext } from '../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faFastForward, faFastBackward } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

import Loading from '../layout/Loading';

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

const UserTable = styled.table`
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
        let url = 'https://d1tapi.dabulgaria.bg/users';
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

    return(
        <TableViewContainer>
            <h1>Административна секция</h1>
            <hr/>
            {
                !data? <Loading/> : [
                    renderLinks(),
                    <UserTable>
                    <thead>
                        <th>Име</th>
                        <th>Фамилия</th>
                        <th>Ел. поща</th>
                        <th>Телефон</th>
                        <th>ПИН</th>
                        <th>Съгласие за данни</th>
                        <th>Регистриран на</th>
                        <th>Роли</th>
                    </thead>
                    <tbody>
                    {
                        loading
                        ?   <tr><td colspan="8"><Loading/></td></tr>
                        :   data.items.map((user, i) => 
                                <tr key={i}>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.pin}</td>
                                    <td>{user.hasAgreedToKeepData? 'Да' : 'Не'}</td>
                                    <td>{user.registeredAt}</td>
                                    <td>{JSON.stringify(user.roles)}</td>
                                </tr>
                            )
                    }
                    </tbody>
                    </UserTable>,
                    renderLinks(),
                    <div>
                        Потребители на страница: {query.get("limit")}
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