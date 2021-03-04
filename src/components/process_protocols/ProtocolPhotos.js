import React, { useState } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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

export default props => {
    const [page, setPage] = useState(0);

    const maxPage = props.protocol.pictures.length - 1;
    const nextAvail = page < maxPage;
    const prevAvail = page > 0;
    
    const pageNav = () => {
        return(
            <PageNav>
                <PageNavButton hidden={!prevAvail} onClick={() => setPage(page - 1)}>
                    <FontAwesomeIcon icon={faChevronLeft}/> Предишна
                </PageNavButton>
                <p style={{color: 'white'}}>{page + 1} / {maxPage + 1}</p>
                <PageNavButton hidden={!nextAvail} onClick={() => setPage(page + 1)}>
                    Следваща <FontAwesomeIcon icon={faChevronRight}/>
                </PageNavButton>
            </PageNav>
        );
    };

    return(
        <PhotoSection>
            {pageNav()}
            <img src={props.protocol.pictures[page].url}/>
            {pageNav()}
        </PhotoSection>
    );
};