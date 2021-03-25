import React, { useState, useEffect, useContext } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { ContentPanel } from '../Modules';
import { AuthContext } from '../../App';

export default props => {
    const { authGet } = useContext(AuthContext);
    const { violation } = useParams();
    const history = useHistory();
    const [data, setData] = useState(null);

    useEffect(() => {
        authGet(`/violations/${violation}`).then(res => {
            console.log(res.data);
            setData(res.data);
        });
    }, []);

    const goBack = () => {
        history.goBack()
    }

    return (
        <ContentPanel>
            <h1>Обработка на сигнал</h1>
            <button onClick={goBack}>Назад</button>
            <hr/>
        </ContentPanel>
    );
};