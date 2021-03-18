import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTh, faUndo, faSearchPlus, faSearchMinus, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

import ProtocolPage from './ProtocolPage';

const GalleryButton = styled.button`
    color: white;
    //position: absolute;
    //top: 10px;
    //left: 5px;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 36px;
    border-radius: 10px;

    &:hover {
        background-color: #333;
    }

    &:disabled {
        color: #bbb;
        cursor: auto;

        &:hover {
            background: none;
        }
    }
`;

const PageNav = styled.div`
    text-align: center;
    position: fixed;
    height: 60px;
    z-index: 12;
    background-color: black;
    width: calc(50vw - 12px);
    
    & > * { display: inline-block; }
`;

const PageNavCompensator = styled.div`
    height: 60px;
    display: block;
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
    overflow-y: hidden;
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;

    img {
        //width: 100%;
        margin-top: 20px;
    }
`;

import ScrollContainer from 'react-indiana-drag-scroll';

export default props => {
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(100);

    const maxPage = props.protocol.pictures.length - 1;

    const pageNav = () => {
        return([
            <PageNav>
                <GalleryButton onClick={() => props.setPage(null)}>
                    <FontAwesomeIcon icon={faTh}/>
                </GalleryButton>
                <GalleryButton onClick={rotate}>
                    <FontAwesomeIcon icon={faUndo}/>
                </GalleryButton>
                <GalleryButton disabled={!zoomInPossible} onClick={zoomIn}>
                    <FontAwesomeIcon icon={faSearchPlus}/>
                </GalleryButton>
                <GalleryButton disabled={!zoomOutPossible} onClick={zoomOut}>
                    <FontAwesomeIcon icon={faSearchMinus}/>
                </GalleryButton>
                <GalleryButton disabled={!movePageBackPossible} onClick={movePageBack}>
                    <FontAwesomeIcon icon={faStepBackward}/>
                </GalleryButton>
                <GalleryButton disabled={!movePageForwardPossible} onClick={movePageForward}>
                    <FontAwesomeIcon icon={faStepForward}/>
                </GalleryButton>
                <PageNavButton hidden={!props.prevAvail} onClick={props.prevPage}>
                    <FontAwesomeIcon icon={faChevronLeft}/> Предишна
                </PageNavButton>
                <p style={{color: 'white'}}>{props.page + 1} / {maxPage + 1}</p>
                <PageNavButton hidden={!props.nextAvail} onClick={props.nextPage}>
                    Следваща <FontAwesomeIcon icon={faChevronRight}/>
                </PageNavButton>
            </PageNav>,
            <PageNavCompensator/>
        ]);
    };

    const rotate = () => {
        let newRotation = rotation + 90;
        if(newRotation >= 360) newRotation -= 360;
        setRotation(newRotation);
    };

    const MIN_ZOOM = 50;
    const MAX_ZOOM = 200;

    const zoomInPossible = zoom < MAX_ZOOM;
    const zoomOutPossible = zoom > MIN_ZOOM;

    const zoomIn = () => {
        let newZoom = zoom + 10;
        if(newZoom > MAX_ZOOM) newZoom = MAX_ZOOM;
        setZoom(newZoom);
    };

    const zoomOut = () => {
        let newZoom = zoom - 10;
        if(newZoom < MIN_ZOOM) newZoom = MIN_ZOOM;
        setZoom(newZoom);
    };

    const movePageBackPossible = props.page !== 0;
    const movePageForwardPossible = props.page < props.protocol.pictures.length - 1;

    const movePageBack = () => {
        if(movePageBackPossible) {
            let pictures = props.protocol.pictures;
            let curPage = pictures[props.page];

            pictures.splice(props.page, 1);
            pictures.splice(props.page - 1, 0, curPage);
            
            props.reorderPictures(pictures);
            props.prevPage();
        }
    };

    const movePageForward = () => {
        if(movePageForwardPossible) {
            let pictures = props.protocol.pictures;
            let curPage = pictures[props.page];

            pictures.splice(props.page, 1);
            pictures.splice(props.page + 1, 0, curPage);
            
            props.reorderPictures(pictures);
            props.nextPage();
        }
    };

    return(
        <PhotoSection>
            {pageNav()}
            <ScrollContainer hideScrollbars={false} className="scroll-container">
                <div style={{maxHeight: 'calc(100vh - 72px)'}}>
                {props.protocol.pictures.map((picture, i) => 
                    <ProtocolPage 
                        key={picture.url}
                        isCurrentPage={props.page === i} 
                        picture={picture} 
                        rotation={rotation}
                        zoom={zoom}
                    />
                )}
                </div>
            </ScrollContainer>
        </PhotoSection>
    );
};