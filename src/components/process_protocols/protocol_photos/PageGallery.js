import React, { useState } from 'react';

import styled from 'styled-components';
import { Img } from 'react-image';
import { SpinnerCircularFixed } from 'spinners-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faStepForward, faUndo } from '@fortawesome/free-solid-svg-icons';

import ProtocolPage from './ProtocolPage';

const PhotoGallery = styled.div`
    width: 50vw;
    height: 100vh;
    overflow-x: hidden;
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
    width: calc(100% / 3 - 3px);
    cursor: pointer;
    background: none;
    border: none;
    //margin: 5px;
    padding: 3px;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;

    &:focus {
        outline: none;
    }

    img {
        box-sizing: border-box;
        top: 0;
        left: 0;
        //width: 100%;
        ${props => props.selected?
            `border: 2px solid yellow;` :
            'border: 2px solid transparent;'
        }
    }

    &:hover {
        img {
            ${props => props.selected?
                `border: 2px solid yellow;` :
                'border: 2px solid white;'
            }
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
    const [heights, setHeights] = useState(props.protocol.pictures.map(p => 0));

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

    const rotate = () => {
        let pictures = props.protocol.pictures;
        if(!pictures[selectedPhoto].rotation) pictures[selectedPhoto].rotation = 0;
        pictures[selectedPhoto].rotation += 90;
        if(pictures[selectedPhoto].rotation >= 360) pictures[selectedPhoto].rotation -= 360;
        props.reorderPictures([...pictures]);
    };

    return(
        <PhotoGallery>
            {
                !selectedPhoto && selectedPhoto !== 0? null : <>
                    <SelectedPageControls>
                        <span style={{verticalAlign: 'top', padding: '10px'}}>
                            Снимка №{selectedPhoto+1}
                        </span>
                        <OpenButton onClick={()=>props.setPage(selectedPhoto)}>
                            Отвори
                        </OpenButton>
                        <SelectedPageButton onClick={rotate}>
                            <FontAwesomeIcon icon={faUndo}/>
                        </SelectedPageButton>
                        {/*<span style={{verticalAlign: 'top', padding: '10px'}}>
                            Размести:
                        </span>*/}
                        <SelectedPageButton disabled={!movePageBackPossible} onClick={movePageBack}>
                            <FontAwesomeIcon icon={faStepBackward}/>
                        </SelectedPageButton>
                        <SelectedPageButton disabled={!movePageForwardPossible} onClick={movePageForward}>
                            <FontAwesomeIcon icon={faStepForward}/>
                        </SelectedPageButton>
                    </SelectedPageControls>
                    <PageNavCompensator/>
                </>
            }
            {props.protocol.pictures.map((picture, i) =>
                <GalleryPhotoButton
                    key={i}
                    selected={selectedPhoto === i}
                    onClick={() => setSelectedPhoto(i)}
                    onDoubleClick={() => props.setPage(i)}
                    style={{ minHeight:
                        (picture.rotation === 90 || picture.rotation === 270)?
                            heights[i] : 0
                    }}
                    rotation={picture.rotation? picture.rotation : 0}
                >
                    <ProtocolPage
                        key={picture.url}
                        isCurrentPage={true}
                        picture={picture}
                        rotation={picture.rotation? picture.rotation : 0}
                        preload={true}
                        zoom={100}
                        imageLoaded={enforcedHeight => {
                            const newHeights = heights;
                            newHeights[i] = enforcedHeight;
                            setHeights([...newHeights]);
                        }}
                    />
                </GalleryPhotoButton>
            )}
        </PhotoGallery>
    )
};
