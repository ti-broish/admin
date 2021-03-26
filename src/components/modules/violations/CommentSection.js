import React, { useState, useEffect, useContext } from 'react';

import Loading from '../../layout/Loading';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faFastForward, faFastBackward } from '@fortawesome/free-solid-svg-icons';

import CommentForm from './CommentForm';

import styled from 'styled-components';

const Comment = styled.div`
    width: 100%;
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

import { AuthContext } from '../../App';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default props => {
    const { violation } = useParams();
    const [data, setData] = useState(null);
    const { authGet } = useContext(AuthContext);
    const query = useQuery();
    const history = useHistory();

    useEffect(() => {
        let url = `/violations/${violation}/comments`;
        const page = query.get("page");
        const limit = query.get("limit");

        if(page || limit) url += '?';

        if(page) url += `page=${page}`;
        if(limit) url += `limit=${limit}`;

        authGet(url).then(res => {
            setData(res.data);
        });
    }, [query.get("page")]);

    const renderLinks = () => {
        const firstAvail = data.meta.currentPage !== 1;
        const lastAvail = data.meta.currentPage !== data.meta.totalPages;
        const nextAvail = data.links.next;
        const prevAvail = data.links.previous;

        const nextPage = data.meta.currentPage + 1;
        const prevPage = data.meta.currentPage - 1;

        return (
            <PaginationLinks>
                <Link className={firstAvail? '' : 'disabled'} to={`/violation/${violation}/comments?page=${1}&limit=20`}>
                    <FontAwesomeIcon icon={faFastBackward}/> Първа
                </Link>
                <Link className={prevAvail? '' : 'disabled'} to={`/violation/${violation}/comments?page=${prevPage}&limit=20`}>
                    <FontAwesomeIcon icon={faChevronLeft}/> Предишна
                </Link>
                <div style={{margin: '0 5px', display: 'inline-block', color: '#444', width: '60px'}}>
                    {data.meta.currentPage} / {data.meta.totalPages}
                </div>
                <Link className={nextAvail? '' : 'disabled'} to={`/violation/${violation}/comments?page=${nextPage}&limit=20`}>
                    Следваща <FontAwesomeIcon icon={faChevronRight}/>
                </Link>
                <Link className={lastAvail? '' : 'disabled'} to={`/violation/${violation}/comments?page=${data.meta.totalPages}&limit=20`}>
                    Последна <FontAwesomeIcon icon={faFastForward}/>
                </Link>
            </PaginationLinks>
        );
    };

    const newComment = comment => {
        if(query.get("page") !== data.meta.totalPages)
            history.push(`/violation/${violation}/comments?page=${data.meta.totalPages}&limit=20`);
        setData({...data, links: [comment, ...data.links]});
    };

    return ([
        <h2>Коментари</h2>,
        !data? <Loading/> :
            <div>
                {data.items.length === 0? <p>Все още няма коментари</p> : null}
                <CommentForm newComment={newComment}/>
                {renderLinks()}
                {data.items.length === 0? null : 
                    data.items.map(comment => [
                        <Comment>
                            <p>{comment.text}</p>
                        </Comment>,
                        <hr/>
                    ])
                }
            </div>
    ]);
};