import React, { useState, useContext } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../App';

const CommentFormStyle = styled.form`
    width: 100%;
`;

export default props => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { violation } = useParams();

    const { authPost } = useContext(AuthContext);

    const handleSubmit = e => {
        e.preventDefault();

        setLoading(true);
        authPost(`/violations/${violation}/comments`, {text: comment}).then(res => {
            setLoading(false);
            props.newComment(res.data);
        });
    };

    const handleChange = e => {
        setComment(e.target.value);
    };

    return (
        <CommentFormStyle onSubmit={handleSubmit}>
            <input type="text" value={comment} onChange={handleChange}/>
            <input type='submit' value={loading? 'Изпращане...' : 'Изпрати коментар'}/>
        </CommentFormStyle>
    );
};