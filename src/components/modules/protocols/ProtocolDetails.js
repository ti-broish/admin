import React, { useState, useEffect, useContext } from 'react';

import { ContentPanel } from '../Modules';

import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../../App';

export default props => {
    const { token } = useContext(AuthContext);
    const { protocol } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`https://d1tapi.dabulgaria.bg/protocols/${protocol}`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
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