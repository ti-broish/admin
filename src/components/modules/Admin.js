import React, { useEffect, useContext, useState } from 'react';

import axios from 'axios';

import { ContentPanel } from './Modules';
import { AuthContext } from '../App';

export default props => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        axios.get(`https://d1tapi.dabulgaria.bg/users`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            setUsers(res.data.items);
        });
    }, []);

    return(
        <ContentPanel>
            <h1>Административна секция</h1>
            <hr/>
            {
                !users? <h1>Зареждане</h1> :
                    <table>
                    <tbody>
                    {
                        users.map((user, i) => 
                            <tr key={i}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.pin}</td>
                                <td>{user.hasAgreedToKeepData}</td>
                                <td>{user.registeredAt}</td>
                                <td>{JSON.stringify(user.roles)}</td>
                            </tr>
                        )
                    }
                    </tbody>
                    </table>
            }
        </ContentPanel>
    )
};