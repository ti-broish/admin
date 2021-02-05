import React from 'react';

import { SpinnerCircularFixed } from 'spinners-react';

import styled from 'styled-components';

const LoadingBackground = styled.div`
    ${props => props.fullScreen? `
        width: 100vw;
        height: 100vh;
    ` : `
        width: 100%;
        height: 100%;
    `}

    background-color: #eee;
    text-align: center;
    padding: 30px;
    box-sizing: border-box;
`;

const LoadingContainer = styled.div`
    ${props => !props.fullScreen? '' : `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    `}

    display: inline-block;
    width: 110px;
    height: 110px;
    text-align: center;
`;

const LoadingTitle = styled.div`
    color: #aaa;
    font-weight: black;
    margin-bottom: 10px;
`;

export default props => {
    return(
        <LoadingBackground fullScreen={props.fullScreen}>
            <LoadingContainer fullScreen={props.fullScreen}>
                <LoadingTitle>
                    Зареждане...
                </LoadingTitle>
                <SpinnerCircularFixed 
                    speed={400}
                    color={'#ddd'}
                    secondaryColor={'#aaa'}
                    thickness={70}
                />
            </LoadingContainer>
        </LoadingBackground>
    );
};