import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { ContentPanel } from '../modules/Modules';
import ProtocolPhotos from './ProtocolPhotos';
import VerifyProtocolInfo from './VerifyProtocolInfo';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import Loading from '../layout/Loading';

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

export default props => {
    const [protocol, setProtocol] = useState(null);
    const [loading, setLoading] = useState(false);

    const nextProtocol = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setProtocol({
                photos: [
                    '234602054-01.png',
                    '234602054-02.png',
                    '234602054-03.png',
                    '234602054-04.png',
                    '234602054-05.png',
                    '234602054-06.png',
                    '234602054-07.png',
                    '234602054-08.png',
                    '234602054-09.png',
                    '234602054-10.png',
                    '234602054-11.png',
                    '234602054-12.png',
                    '234602054-13.png',
                    '234602054-14.png',
                ]
            });
        }, 2000);
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
            <VerifyProtocolInfo protocol={protocol} returnProtocol={() => setProtocol(null)}/>
    );
};