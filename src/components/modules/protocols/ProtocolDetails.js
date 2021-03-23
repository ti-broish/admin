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
                    <div>
                        <h1>Секция</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Номер</td>
                                    <td>{data.section.code}</td>
                                </tr>
                                <tr>
                                    <td>Адрес</td>
                                    <td>{data.section.place}</td>
                                </tr>
                            </tbody>
                        </table>
                        <hr/>
                        <h1>Протокол</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Изпратен от (организация)</td>
                                    <td>{data.author.organization.name}</td>
                                </tr>
                                {
                                    data.assignees.map(assignee => 
                                        <tr>
                                            <td>Проверява се от</td>
                                            <td>{assignee.firstName} {assignee.lastName}</td>
                                        </tr>
                                    )
                                }
                                <tr>
                                    <td>Действителни гласове</td>
                                    <td>{data.results.validVotesCount}</td>
                                </tr>
                                <tr>
                                    <td>Недействителни гласове</td>
                                    <td>{data.results.invalidVotesCount}</td>
                                </tr>
                                <tr>
                                    <td>Машинни гласове</td>
                                    <td>{data.results.machineVotesCount}</td>
                                </tr>
                            </tbody>
                        </table>
                        <hr/>
                        <h1>Резултати</h1>
                        <table>
                            <tbody>
                                {
                                    data.results.results.map(result => 
                                        <tr>
                                            <td>{result.party.name}</td>
                                            <td>{result.validVotesCount}</td>
                                            <td>{result.invalidVotesCount}</td>
                                            <td>{result.machineVotesCount}</td>
                                            <td>{result.nonMachineVotesCount}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <hr/>
                        <h1>Снимки</h1>
                        {
                            data.pictures.map(picture =>
                                <a href={picture.url}>{picture.id}</a>
                            )
                        }
                    </div>
            }
        </ContentPanel>
    );
};