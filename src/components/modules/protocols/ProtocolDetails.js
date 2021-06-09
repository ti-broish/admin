import React, { useState, useEffect, useContext } from 'react';

import { ContentPanel } from '../Modules';

import { useHistory, useParams } from 'react-router-dom';

import { AuthContext } from '../../App';
import ImageGallery from '../../ImageGallery';
import Loading from '../../layout/Loading';
import { TableStyle } from '../Profile';

export default props => {
    const { authGet } = useContext(AuthContext);
    const { protocol } = useParams();
    const history = useHistory();
    const [data, setData] = useState(null);

    useEffect(() => {
        authGet(`/protocols/${protocol}`).then(res => {
            setData(res.data);
        });
    }, []);

    const goBack = () => {
        history.goBack()
    }

    return(
        <ContentPanel>
            <button onClick={goBack}>Назад</button>
            <h1>Протокол {protocol}</h1>
            <hr/>
            {
                !data? <Loading/> :
                    <div>
                        <h1>Секция</h1>
                        <TableStyle>
                            <tbody>
                                <tr>
                                    <td>Номер</td>
                                    <td>{data.section.id}</td>
                                </tr>
                                <tr>
                                    <td>Адрес</td>
                                    <td>{data.section.place}</td>
                                </tr>
                            </tbody>
                        </TableStyle>
                        <hr/>
                        <h1>Протокол</h1>
                        <TableStyle>
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
                        </TableStyle>
                        <hr/>
                        <h1>Резултати</h1>
                        <TableStyle>
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
                        </TableStyle>
                        <hr/>
                        <h1>Снимки</h1>
                        <ImageGallery 
                            items={data.pictures.map(picture => ({
                                original: picture.url
                            }))}
                        />
                    </div>
            }
        </ContentPanel>
    );
};
