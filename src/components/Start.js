import React, { useContext } from 'react';

import { AuthContext } from './App';

export default props => {
    const authContext = useContext(AuthContext);

    return(
        <div>
            <h1>Моите данни</h1>
            {
                !authContext.userData? <h1>Зареждане на потребителски данни...</h1> :
                    <table>
                    <tbody>
                        <tr>
                            <td>Имена</td>
                            <td>{authContext.userData.firstName} {authContext.userData.lastName}</td>
                        </tr>
                        <tr>
                            <td>Имейл</td>
                            <td>{authContext.userData.email}</td>
                        </tr>
                        <tr>
                            <td>Телефон</td>
                            <td>{authContext.userData.phone}</td>
                        </tr>
                        <tr>
                            <td>ПИН</td>
                            <td>{authContext.userData.pin}</td>
                        </tr>
                        <tr>
                            <td>Организация</td>
                            <td>{authContext.userData.organization.name}</td>
                        </tr>
                        <tr>
                            <td>Съгласие за съхранение на данни</td>
                            <td>{authContext.userData.hasAgreedToKeepData? 'Да' : 'Не'}</td>
                        </tr>
                    </tbody>
                    </table>
            }
            <button onClick={authContext.logOut}>
                Изход
            </button>
        </div>
    )
};