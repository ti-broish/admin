import React from 'react';

import { SpinnerCircularFixed } from 'spinners-react';

import styled from 'styled-components';

const LoadingBackground = styled.div`
    background-color: #eee;
    width: 100vw;
    height: 100vh;
`;

const LoadingContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: inline-block;
    margin: auto;
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
        <LoadingBackground>
            <LoadingContainer>
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