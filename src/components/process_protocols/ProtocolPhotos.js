import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTh } from '@fortawesome/free-solid-svg-icons';
import useKeypress from 'react-use-keypress';
import { SpinnerCircularFixed } from 'spinners-react';
import { Img } from 'react-image';

const PhotoSection = styled.div`
    width: 50vw;
    height: 100vh;
    overflow-y: auto;
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;

    img {
        width: 100%;
        margin-top: 20px;
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
    const [page, setPage] = useState(0);

    const maxPage = props.protocol.pictures.length - 1;
    const nextAvail = page < maxPage;
    const prevAvail = page > 0;

    useKeypress(['ArrowLeft'], event => prevPage());
    useKeypress(['ArrowRight'], event => nextPage());

    const prevPage = () => {
        if(prevAvail) setPage(page - 1);
    };

    const nextPage = () => {
        if(nextAvail) setPage(page + 1);
    };
    
    const pageNav = () => {
        return(
            <PageNav>
                <PageNavButton hidden={!prevAvail} onClick={prevPage}>
                    <FontAwesomeIcon icon={faChevronLeft}/> Предишна
                </PageNavButton>
                <p style={{color: 'white'}}>{page + 1} / {maxPage + 1}</p>
                <PageNavButton hidden={!nextAvail} onClick={nextPage}>
                    Следваща <FontAwesomeIcon icon={faChevronRight}/>
                </PageNavButton>
            </PageNav>
        );
    };

    return(
        page === null?
            <PhotoGallery>
                {props.protocol.pictures.map((picture, i) => 
                    <GalleryPhotoButton>
                        <Img
                            src={picture.url}
                            onClick={()=>setPage(i)}
                            loader={
                                <SpinnerCircularFixed 
                                    speed={400}
                                    color={'#ddd'}
                                    secondaryColor={'#aaa'}
                                    thickness={70}
                                />
                            }
                        />
                    </GalleryPhotoButton>
                )}
            </PhotoGallery> :
            <PhotoSection>
                <GalleryButton onClick={() => setPage(null)}>
                    <FontAwesomeIcon icon={faTh}/>
                </GalleryButton>
                {pageNav()}
                {props.protocol.pictures.map((picture, i) => 
                    <Img 
                        style={page === i? {} : {display: 'none'}}
                        src={picture.url}
                        loader={
                            <SpinnerCircularFixed 
                                speed={400}
                                color={'#ddd'}
                                secondaryColor={'#aaa'}
                                thickness={70}
                            />
                        }
                    />
                )}
                {pageNav()}
            </PhotoSection>
    );

    /*return(
        <PhotoSection>
            {pageNav()}
            {props.protocol.pictures.map((picture, i) => 
                <Img 
                    style={page === i? {} : {display: 'none'}}
                    src={picture.url}
                    loader={
                        <SpinnerCircularFixed 
                            speed={400}
                            color={'#ddd'}
                            secondaryColor={'#aaa'}
                            thickness={70}
                        />
                    }
                />
            )}
            {pageNav()}
        </PhotoSection>
    );*/
};