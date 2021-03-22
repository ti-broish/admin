import React, { useState } from 'react';

import styled from 'styled-components';
import { Img } from 'react-image';
import { SpinnerCircularFixed } from 'spinners-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';

const PhotoGallery = styled.div`
    width: 50vw;
    height: 100vh;
    overflow-y: auto;
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;

    //img {
    //    width: calc(100% / 3);
    //    margin-top: 20px;
    //}
`;

const GalleryPhotoButton = styled.button`
    width: calc(100% / 3);
    cursor: pointer;
    background: none;
    border: none;
    //margin: 5px;
    padding: 5px;

    img {
        width: 100%;
        ${props => props.selected? `box-shadow: 0px 0px 20px yellow;` : ''}
    }

    &:hover {
        img {
            filter: brightness(1.5);
        }
    }
`;

const SelectedPageControls = styled.div`
    position: fixed;
    height: 60px;
    z-index: 12;
    background-color: black;
    width: calc(50vw - 12px);
    padding: 8px 0;
    box-sizing: border-box;
    color: white;
    font-size: 22px;
    
    & > * { display: inline-block; }
`;

const PageNavCompensator = styled.div`
    height: 60px;
    display: block;
`;

const SelectedPageButton = styled.button`
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

const OpenButton = styled.button`
    color: white;
    //position: absolute;
    //top: 10px;
    //left: 5px;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 22px;
    border-radius: 10px;
    border: 1px solid #ddd;
    margin: 8px;
    vertical-align: top;

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

export default props => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const movePageBackPossible = selectedPhoto !== 0;
    const movePageForwardPossible = selectedPhoto < props.protocol.pictures.length - 1;

    const movePageBack = () => {
        if(movePageBackPossible) {
            let pictures = props.protocol.pictures;
            let curPage = pictures[selectedPhoto];

            pictures.splice(selectedPhoto, 1);
            pictures.splice(selectedPhoto - 1, 0, curPage);
            
            props.reorderPictures(pictures);
            setSelectedPhoto(selectedPhoto - 1);
        }
    };

    const movePageForward = () => {
        if(movePageForwardPossible) {
            let pictures = props.protocol.pictures;
            let curPage = pictures[selectedPhoto];

            pictures.splice(selectedPhoto, 1);
            pictures.splice(selectedPhoto + 1, 0, curPage);
            
            props.reorderPictures(pictures);
            setSelectedPhoto(selectedPhoto + 1);
        }
    };

    return(
        <PhotoGallery>
            {
                !selectedPhoto && selectedPhoto !== 0? null : [
                    <SelectedPageControls>
                        <span style={{verticalAlign: 'top', padding: '10px'}}>
                            Снимка №{selectedPhoto+1}
                        </span>
                        <OpenButton onClick={()=>props.setPage(selectedPhoto)}>
                            Отвори
                        </OpenButton>
                        <span style={{verticalAlign: 'top', padding: '10px'}}>
                            Размести:
                        </span>
                        <SelectedPageButton disabled={!movePageBackPossible} onClick={movePageBack}>
                            <FontAwesomeIcon icon={faStepBackward}/>
                        </SelectedPageButton>
                        <SelectedPageButton disabled={!movePageForwardPossible} onClick={movePageForward}>
                            <FontAwesomeIcon icon={faStepForward}/>
                        </SelectedPageButton>
                    </SelectedPageControls>,
                    <PageNavCompensator/>
                ]
            }
            {props.protocol.pictures.map((picture, i) => 
                <GalleryPhotoButton 
                    selected={selectedPhoto === i} 
                    onClick={() => setSelectedPhoto(i)}
                >
                    <Img
                        src={picture.url}
                        loader={
                            <SpinnerCircularFixed 
                                speed={400}
                                color={'#ddd'}
                                secondaryColor={'#aaa'}
                                thickness={70}
                                style={{marginTop: '236px'}}
                            />
                        }
                    />
                </GalleryPhotoButton>
            )}
        </PhotoGallery>
    )
};