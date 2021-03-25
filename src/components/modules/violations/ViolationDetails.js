import React, { useState, useEffect, useContext } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes, faCheck, faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';

import { ContentPanel } from '../Modules';
import { AuthContext } from '../../App';
import Loading from '../../layout/Loading';

import { TableStyle } from '../Profile';

import styled from 'styled-components';

const BackButton = styled.button`
    cursor: pointer;
    border: none;
    border-radius: 6px;
    background: none;
    margin-right: 5px;
    font-size: 48px;

    &:hover {
        background-color: #eee;
    }
`;

const ViolationStatus = styled.span`
    font-weight: bold;
    color: ${props => props.color};
    border: 4px solid ${props => props.color};
    border-radius: 5px;
    padding: 6px;
    vertical-align: top;
    display: inline-block;
    margin-left: 10px;
    font-size: 20px;
    margin-top: 5px;
`;

const FancyButton = styled.button`
    border: none;
    padding: 5px 10px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 5px;
    box-sizing: border-box;
    display: inline-block;
    font-weight: bold;
    margin: 0 5px;
    min-width: 200px;
    position: relative;
    color: white;

    &:active:enabled {
        top: 5px;
        border-bottom: 0;
    }

    &:disabled {
        cursor: auto;
        color: white;
    }

    &:first-of-type {
        margin-left: 0;
    }
`;

const FancyButtonGreen = styled(FancyButton)`
    background-color: #44e644;
    border-bottom: 5px solid #2eae1c;

    &:hover {
        background-color: #2ece2e;
    }

    &:disabled {
        background-color: #9efd9e;
        border-bottom-color: #9aec8e;
    }
`;

const FancyButtonBlue = styled(FancyButton)`
    background-color: #36a2e3;
    border-bottom: 5px solid #1e70b9;

    &:hover {
        background-color: #48b4f4;
    }

    &:disabled {
        background-color: #b6e4ff;
        border-bottom-color: #b9d4ec;
    }
`;

const FancyButtonYellow = styled(FancyButton)`
    background-color: #ffe300;
    border-bottom: 5px solid #c1b718;

    &:hover {
        background-color: #ffeb47;
    }

    &:disabled {
        background-color: #fff6b0;
        border-bottom-color: #ece793;
    }
`;

const FancyButtonRed = styled(FancyButton)`
    background-color: #ff3e3e;
    border-bottom: 5px solid #b92121;

    &:hover { background-color: #ff5a5a; }

    &:disabled {
        background-color: #f4d2d2;
        border-bottom-color: #dfc1c1;
    }
`;

export default props => {
    const { authGet, authPost, user } = useContext(AuthContext);
    const { violation } = useParams();
    const history = useHistory();
    const [data, setData] = useState(null);
    const [comments, setComments] = useState(null);
    const [buttonLoading, setButtonLoading] = useState({
        assign: false, process: false, reject: false
    });

    useEffect(() => {
        authGet(`/violations/${violation}`).then(res => {
            setData(res.data);
        });

        authGet(`/violations/${violation}/comments`).then(res => {
            setComments(res.data);
        });
    }, []);

    const assignYourself = () => {
        setButtonLoading({...buttonLoading, assign: true});
        authPost(`/violations/${violation}/assignees`, {id: user.id}).then(res => {
            setButtonLoading({...buttonLoading, assign: false});
            if(res.data.status === 'Accepted') {
                setData({...data, assignees: [user], status: 'processing'});
            }
        });
    };

    const goBack = () => {
        history.goBack()
    };

    const processViolation = () => {
        setButtonLoading({...buttonLoading, process: true});
        authPost(`/violations/${violation}/process`).then(res => {
            setButtonLoading({...buttonLoading, process: false});
            setData(res.data);
        });
    };

    const rejectViolation = () => {
        setButtonLoading({...buttonLoading, reject: true});
        authPost(`/violations/${violation}/reject`).then(res => {
            setButtonLoading({...buttonLoading, reject: false});
            setData(res.data);
        });
    };

    const publishViolation = () => {
        alert('Почакай малко! Още не работи.');
    };

    const status = apiStatus => {
        switch(apiStatus) {
            case "received" : return <ViolationStatus color={'#6c6cff'}>Получен</ViolationStatus>;
            case "rejected" : return <ViolationStatus color={'#ff3939'}>Отхвърлен</ViolationStatus>;
            case "processed" : return <ViolationStatus color={'#46df00'}>Обработен</ViolationStatus>;
            case "processing" : return <ViolationStatus color={'#ecd40e'}>Обработва се</ViolationStatus>;
            default: return apiStatus;
        }
    };
    
    const iAmAssignee = data && data.assignees.length !== 0 && data.assignees[0].id === user.id;

    const assignPossible = () => data.assignees.length === 0 && data.status === 'received' && !buttonLoading.assign;
    const processPossible = () => iAmAssignee && data.status === 'processing' && !buttonLoading.process;
    const rejectPossible =  () => iAmAssignee && data.status === 'processing' && !buttonLoading.reject;
    const publishPossible =  () => true;

    return (
        <ContentPanel>
            <h1>
                <BackButton onClick={goBack}><FontAwesomeIcon icon={faChevronLeft}/></BackButton>
                <span style={{verticalAlign: 'top', paddingTop: '9px', display: 'inline-block'}}>Обработка на сигнал</span>
                {!data? null : status(data.status)}
            </h1>
            {
                !data? <Loading/> :
                <div>
                    <h2 style={{color: '#666'}}>
                    {data.assignees.length === 0? 'Свободен за обработка' : [
                        `Обработва се от ${data.assignees[0].firstName} ${data.assignees[0].lastName}`,
                        !iAmAssignee? null : <span style={{color: 'red'}}> (Вие)</span>
                    ]}
                    </h2>
                    <FancyButtonYellow onClick={assignYourself} disabled={!assignPossible()}>
                        {buttonLoading.assign? 'Момент...' : [
                            <FontAwesomeIcon icon={faEdit}/>,
                            ' Обработвай'
                        ]}
                    </FancyButtonYellow>
                    <FancyButtonGreen onClick={processViolation} disabled={!processPossible()}>
                        {buttonLoading.process? 'Момент...' : [
                            <FontAwesomeIcon icon={faCheck}/>,
                            ' Закрий сигнал'
                        ]}
                    </FancyButtonGreen>
                    <FancyButtonRed onClick={rejectViolation} disabled={!rejectPossible()}>
                        {buttonLoading.reject? 'Момент...' : [
                            <FontAwesomeIcon icon={faTimes}/>,
                            ' Отхвърли сигнал'
                        ]}
                    </FancyButtonRed>
                    <FancyButtonBlue onClick={publishViolation} disabled={!publishPossible()}>
                        {buttonLoading.publish? 'Момент...' : [
                            <FontAwesomeIcon icon={faUpload}/>,
                            ' Публикувай'
                        ]}
                    </FancyButtonBlue>
                    <hr/>
                    <h2>Изпратен от</h2>
                    <TableStyle>
                        <tbody>
                            <tr>
                                <td>Имена</td>
                                <td>{data.author.firstName} {data.author.lastName}</td>
                            </tr>
                            <tr>
                                <td>Организация</td>
                                <td>{data.author.organization? data.author.organization.name : null}</td>
                            </tr>
                            <tr>
                                <td>Ел. поща</td>
                                <td>{data.author.email}</td>
                            </tr>
                            <tr>
                                <td>Телефон</td>
                                <td>{data.author.phone}</td>
                            </tr>
                        </tbody>
                    </TableStyle>
                    <hr/>
                    {
                        !data.section? null :
                            <div>
                                <h2>Информация за секция</h2>
                                <TableStyle>
                                <tbody>
                                    <tr>
                                        <td>Номер</td>
                                        <td>{data.section.id}</td>
                                    </tr>
                                    <tr>
                                        <td>Град</td>
                                        <td>{data.town.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Локация</td>
                                        <td>{data.section.place}</td>
                                    </tr>
                                </tbody>
                                </TableStyle>
                                <hr/>
                            </div>
                    }
                    <h2>Описание</h2>
                    <p>{data.description}</p>
                    
                </div>
            }
            <hr/>
            <h2>Коментари</h2>
            {
                !comments? <Loading/> :
                    <div>
                        {
                            comments.items.length === 0? <p>Все още няма коментари</p> : null
                        }
                    </div>
            }
        </ContentPanel>
    );
};