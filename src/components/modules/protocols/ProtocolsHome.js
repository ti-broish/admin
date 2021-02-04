import React, { useEffect, useContext, useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import { ContentPanel } from '../Modules';

import { AuthContext } from '../../App';

export default props => {
    const { token } = useContext(AuthContext);
    const [protocols, setProtocols] = useState(null);

    useEffect(() => { (async () => {
        const res = await axios.get('https://d1tapi.dabulgaria.bg/protocols?page=1&limit=20', { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setProtocols(res.data.items);
    }) ()}, []);

    const origin = apiOrigin => {
        switch(apiOrigin) {
            case 'ti-broish' : return "Ти Броиш";
            default: return apiOrigin;
        }
    };

    const status = apiStatus => {
        switch(apiStatus) {
            case "received" : return "Получен";
            default: return apiStatus;
        }
    };

    return(
        <ContentPanel>
            <h1>Протоколи</h1>
            <hr/>
            {
                !protocols? <h1>Зареждане</h1> :
                    <table>
                    <tbody>
                    {
                        protocols.map((protocol, i) => 
                            <tr key={i}>
                                <td>
                                    <Link to={`/protocols/${protocol.id}`}>
                                        {protocol.section.id}
                                    </Link>
                                </td>
                                <td>{origin(protocol.origin)}</td>
                                <td>{protocol.section.place}</td>
                                <td>{status(protocol.status)}</td>
                            </tr>
                        )
                    }
                    </tbody>
                    </table>
            }
        </ContentPanel>
    );
};