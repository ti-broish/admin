import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTh, faUndo } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

import ProtocolPage from './ProtocolPage';

const GalleryButton = styled.button`
    color: white;
    position: absolute;
    top: 10px;
    left: 5px;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 36px;
    border-radius: 10px;

    &:hover {
        background-color: #333;
    }
`;

const PageNav = styled.div`
    text-align: center;
    margin-top: 10px;
    
    & > * { display: inline-block; }
`;

const PageNavButton = styled.button`
    ${props => props.hidden? 'visibility: hidden;' : ''}
    cursor: pointer;
    border: none;
    background: none;
    color: white;
    margin: 0 20px;
    padding: 10px 20px;
    border-radius: 10px;

    &:hover {
        background-color: #333;
    }
`;

const PhotoSection = styled.div`
    width: 50vw;
    height: 100vh;
    overflow-y: auto;
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;

    img {
        //width: 100%;
        margin-top: 20px;
    }
`;


export default props => {
    const [rotation, setRotation] = useState(0);

    const maxPage = props.protocol.pictures.length - 1;

    const pageNav = () => {
        return(
            <PageNav>
                <button onClick={rotate}>
                    <FontAwesomeIcon icon={faUndo}/>
                </button>
                <PageNavButton hidden={!props.prevAvail} onClick={props.prevPage}>
                    <FontAwesomeIcon icon={faChevronLeft}/> Предишна
                </PageNavButton>
                <p style={{color: 'white'}}>{props.page + 1} / {maxPage + 1}</p>
                <PageNavButton hidden={!props.nextAvail} onClick={props.nextPage}>
                    Следваща <FontAwesomeIcon icon={faChevronRight}/>
                </PageNavButton>
            </PageNav>
        );
    };

    const rotate = () => {
        let newRotation = rotation + 90;
        if(newRotation >= 360) newRotation -= 360;
        setRotation(newRotation);
    };

    return(
        <PhotoSection>
            <GalleryButton onClick={() => props.setPage(null)}>
                <FontAwesomeIcon icon={faTh}/>
            </GalleryButton>
            {pageNav()}
            {props.protocol.pictures.map((picture, i) => 
                <ProtocolPage isCurrentPage={props.page === i} picture={picture} rotation={rotation}/>
            )}
        </PhotoSection>
    );
};