import React from 'react';
import ProtocolPhotos from './ProtocolPhotos';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const ProtocolInfoSection = styled.div`
    width: 50vw;
    height: 100vh;
    overflow-y: auto;
    position: absolute;
    top: 0;
    right: 0;
`;

const SectionHeader = styled.div`
    //padding: 10px;
    background-color: rgb(56,222,203);
    color: white;
`;

const BackButton = styled.button`
    display: inline-block;
    color: white;
    border: none;
    background: none;
    font-size: 36px;
    cursor: pointer;
    padding: 15px;
    border-right: 1px solid white;
    margin-right: 20px;
`;

export default props => {
    return(
        <div>
            <ProtocolPhotos protocol={props.protocol}/>
            <ProtocolInfoSection>
                <SectionHeader>
                    <BackButton onClick={props.returnProtocol}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </BackButton>
                    <h1 style={{display: 'inline-block'}}>Секция 234602054</h1>
                </SectionHeader>
                <h1>Общи данни</h1>
                <button>Приеми</button>
                <button>Отхвърли</button>
                <table>

                </table>
                <hr/>
                <button>Приеми протокол</button>
                <button>Отхвърли протокол</button>
            </ProtocolInfoSection>
        </div>
    );
};