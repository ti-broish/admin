import React from 'react';

import styled from 'styled-components';
import { Img } from 'react-image';
import { SpinnerCircularFixed } from 'spinners-react';

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
    }

    &:hover {
        img {
            box-shadow: 0px 0px 20px yellow;
        }
    }
`;

export default props => {
    return(
        <PhotoGallery>
            {props.protocol.pictures.map((picture, i) => 
                <GalleryPhotoButton>
                    <Img
                        src={picture.url}
                        onClick={()=>props.setPage(i)}
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