import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import { SpinnerCircularFixed } from 'spinners-react';

const ProtocolPageContainer = styled.div`
    width: 100%;
    text-align: center;
    min-height: 400px;
    vertical-align: middle;
    ${props => props.currentPage? '' : 'display: none;'}
`;

const ProtocolPageImage = styled.img`
    ${props => {
        const ratio = props.dims.width / props.dims.height;

        //client width si e prosto width
        //trqbva da vidim kolko e razlikata mejdu height i client width

        if(props.rotation === 90 || props.rotation === 270) {
            return `
                width: ${props.dims.width * ratio}px !important; 
                height: ${props.dims.width}px !important;
                padding: 0 ${(props.dims.width * (1 - ratio)) / 2}px;
            `;
        } else {
            return `
                width: ${props.dims.width - 12}px !important; 
                height: ${props.dims.height - 12 / ratio}px !important;
                padding: 0;
            `;
        }
    }}
    ${props => props.rotation? `
        transform: rotate(${props.rotation}deg);` 
    : ''}
    ${props => !props.hide? '' : 'display: none;'}
`;

export default props => {

    const [loading, setLoading] = useState(true);
    const [dims, setDims] = useState({width: 0, height: 0});

    const imageLoaded = ev => {
        setLoading(false);
        const containerWidth = ev.target.parentElement.clientWidth;
        const ratio = ev.target.width / containerWidth;
        setDims({
            width: ev.target.width / ratio,
            height: ev.target.height / ratio,
        });
    };

    return(
        <div>
            {!loading || !props.isCurrentPage? null : 
            <div style={{marginTop: '236px', textAlign: 'center'}}>
                <SpinnerCircularFixed 
                    speed={400}
                    color={'#ddd'}
                    secondaryColor={'#aaa'}
                    thickness={70}
                />
            </div>}
            <ProtocolPageImage 
                rotation={props.rotation}
                dims={dims}
                hide={loading || !props.isCurrentPage}
                src={props.picture.url}
                onLoad={imageLoaded}
            />
        </div>
    );
};