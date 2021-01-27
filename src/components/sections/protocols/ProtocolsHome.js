import React, { useEffect, useContext } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import { ContentPanel } from '../Sections';

import { AuthContext } from '../../App';

export default props => {
    const { token } = useContext(AuthContext);

    useEffect(() => { (async () => {
        const res = await axios.get('https://d1tapi.dabulgaria.bg/sections', { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(res.data);
    }) ()}, []);

    return(
        <ContentPanel>
            <h1>Протоколи</h1>
            <hr/>
            <p>
                <Link to="/protocols/process">Натиснете тук</Link> за да започнете да обработвате протоколи.
            </p>
        </ContentPanel>
    );
};