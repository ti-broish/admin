import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

import { SpinnerCircularFixed } from 'spinners-react';

const ProtocolPageImage = styled.img`
    ${props => {
        const ratio = props.dims.width / props.dims.height;
        const scale = props.zoom / 100;

        if(props.rotation === 90 || props.rotation === 270) {
            return `
                width: ${(props.dims.width * ratio) * scale}px !important; 
                height: ${(props.dims.width) * scale}px !important;
                padding: 0 ${((props.dims.width * (1 - ratio)) / 2) * scale}px;
            `;
        } else {
            return `
                width: ${(props.dims.width - 12) * scale}px !important; 
                height: ${(props.dims.height - 12 / ratio) * scale}px !important;
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

        props.imageLoaded();
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
            {!props.isCurrentPage && !props.preload? null :
            <ProtocolPageImage 
                rotation={props.rotation}
                dims={dims}
                zoom={props.zoom}
                hide={loading || !props.isCurrentPage}
                src={props.picture.url}
                onLoad={imageLoaded}
            />}
        </div>
    );
};