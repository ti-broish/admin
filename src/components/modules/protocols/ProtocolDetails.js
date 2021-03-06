import React, { useState, useEffect, useContext } from 'react';

import { ContentPanel } from '../Modules';

import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../../App';

export default props => {
    const { authGet } = useContext(AuthContext);
    const { protocol } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        authGet(`/protocols/${protocol}`).then(res => {
            console.log(res.data);
            setData(res.data);
        });
    }, []);

    return(
        <ContentPanel>
            <Link to={props.backPage}>Назад</Link>
            <h1>Протокол {protocol}</h1>
            <hr/>
            {
                !data? <h1>Зареждане</h1> :
                    <h1>Заредено</h1>
            }
        </ContentPanel>
    );
};