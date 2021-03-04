import React, { useState, useContext, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { ContentPanel } from '../modules/Modules';
import ProtocolPhotos from './ProtocolPhotos';
import VerifyProtocolInfo from './VerifyProtocolInfo';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import Loading from '../layout/Loading';
import axios from 'axios';

const ReadyScreen = styled.div`
    max-width: 900px;
    display: block;
    margin: 0 auto;
    padding: 50px;
    //border: 1px solid #aaa;
    border-radius: 50px;
    //margin-top: 30px;

    hr {
        margin: 20px 0;
        border: 1px solid #ddd;
        border-top: 0;
    }
`;

const NextProtocolButton = styled.button`
    border: none;
    background-color: #22c122;
    color: white;
    padding: 20px 50px;
    font-size: 36px;
    cursor: pointer;
    margin: 0 auto;
    border-radius: 20px;
    border-bottom: 10px solid #118a00;
    display: block;
    margin-top: 60px;
    box-sizing: border-box;
    position: relative;
    top: 0;

    &:hover {
        background-color: #2ece2e;
    }

    &:active {
        top: 10px;
        border-bottom: 0;
        margin-bottom: 10px;
    }
`;

import { AuthContext } from '../App';

export default props => {
    const [protocol, setProtocol] = useState(null);
    const [loading, setLoading] = useState(true);

    const { token, user, authGet, authDelete } = useContext(AuthContext);

    useEffect(() => { init(); }, []);

    const init = async () => {
        const res =  await authGet(`/protocols?assignee=${user.id}`);
        
        if(res.data.items.length > 0) {
            const res2 = await authGet(`/protocols/${res.data.items[0].id}`);
            setProtocol(res2.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const returnProtocol = async () => {
        //const res = await authDelete(`/protocols/${protocol.id}/assignees/${user.id}`);
        //console.log(res);
        alert('Връщане на протокол не е имплементирано');
        setProtocol(null);
    };

    const nextProtocol = async () => {
        
        //const res = await axios.post('https://d1tapi.dabulgaria.bg/protocols/assign', {}, { 
        //    headers: { 'Authorization': `Bearer ${token}` }
        //});

        //const res = await axios.get('https://d1tapi.dabulgaria.bg/me/protocols', { 
        //    headers: { 'Authorization': `Bearer ${token}` }
        //});

        //console.log(res.data);
    };

    return(
        loading? <Loading fullScreen/> :
        !protocol?
            <ReadyScreen>
                <h1 style={{textAlign: 'center', fontSize: '54px'}}>Обработка на протоколи</h1>
                <hr/>
                <p>
                    Когато сте готови, натиснете долу и ще ви бъде назначен протокол.
                </p>
                <NextProtocolButton onClick={nextProtocol}>
                    <FontAwesomeIcon icon={faFile}/> Следващ протокол
                </NextProtocolButton>
                <Link to="/protocols" style={{textAlign: 'center', display: 'block'}}>Върнете се обратно</Link>
            </ReadyScreen> :
            <VerifyProtocolInfo protocol={protocol} returnProtocol={returnProtocol}/>
    );
};