import React, { useState, useEffect, useContext } from 'react';

import Loading from '../../layout/Loading';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';

import CommentForm from './CommentForm';

import styled from 'styled-components';

import Comment from './Comment';

export const PaginationLinks = styled.div`
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

    

    const newComment = comment => {
        setData({...data, meta: {...data.meta, totalItems: data.meta.totalItems + 1}, items: [comment, ...data.items]});
    };

    return ([
        <h2>
            Последни коментари
            {
                !data? null : data.items.length <= 5? null :
                <Link to={`/violation/${violation}/comments`} style={{marginLeft: '10px'}}>
                    Виж всички ({data.meta.totalItems})
                </Link>
            }
        </h2>,
        !data? <Loading/> :
            <div>
                {data.items.length === 0? <p>Все още няма коментари</p> : null}
                <CommentForm newComment={newComment} section={props.section}/>
                {data.items.length === 0? null : 
                    data.items.slice(0, 5).map(comment => [
                        <Comment key={comment.id} comment={comment}/>,
                        <hr/>
                    ])
                }
                {
                    data.items.length <= 5? null :
                    <h2 style={{textAlign: 'center'}}>
                    <Link to={`/violation/${violation}/comments`}>
                        Виж всички коментари ({data.meta.totalItems})
                    </Link>
                    </h2>
                }
            </div>
    ]);
};