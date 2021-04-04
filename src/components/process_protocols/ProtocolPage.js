import React, { useState, useEffect, useRef } from 'react';

import styled from 'styled-components';

import { SpinnerCircularFixed } from 'spinners-react';

const ProtocolPageImage = styled.img`
    ${props => {
        const scale = props.zoom / 100;
        const w = props.dims.width;
        const h = props.dims.height;
        const ratio = w / h;

        if(props.rotation === 90 || props.rotation === 270) {
            return `
                width: ${w * ratio * scale}px !important; 
                height: ${w * scale}px !important;
                position: absolute;
                //padding: 0 ${((w * (1 - ratio)) / 2) * scale}px;
            `;
        } else {
            return `
                width: ${w * scale}px !important; 
                height: ${h * scale}px !important;
                padding: 0;
            `;
        }
    }}
    ${props => { 
        const w = props.dims.width;
        const h = props.dims.height;

        return props.rotation? `
            transform-origin: 50% 50%;
            transform: rotate(${props.rotation}deg)
                ${props.rotation === 90? `
                    translate(
                        ${0}px, 
                        ${(w * ((w / h) - 1)) / 2}px
                    );` :
                props.rotation === 270? `
                    translate(
                        ${0}px, 
                        ${(w * (1 - (w / h))) / 2}px
                    );` : 
                `;`
    }` : ''}}
    ${props => !props.hide? '' : 'display: none;'}
`;

export default props => {

    const [loading, setLoading] = useState(true);
    const [dims, setDims] = useState({width: 0, height: 0});
    const ref = useRef();
    
    useEffect(() => {
        window.addEventListener('resize', resizeHandler);
        
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    const resizeHandler = () => {
        if(ref.current) {
            const containerWidth = ref.current.parentElement.clientWidth;
            const ratio = ref.current.naturalWidth / containerWidth;
            setDims({
                width: ref.current.naturalWidth / ratio,
                height: ref.current.naturalHeight / ratio,
            });

            const aspectRatio = ref.current.naturalWidth / ref.current.naturalHeight;
            props.imageLoaded(ref.current.naturalWidth / ratio * aspectRatio);
        }
    };

    const imageLoaded = ev => {
        setLoading(false);
        const containerWidth = ev.target.parentElement.clientWidth;
        const ratio = ev.target.naturalWidth / containerWidth;
        setDims({
            width: ev.target.naturalWidth / ratio,
            height: ev.target.naturalHeight / ratio,
        });

        const aspectRatio = ev.target.naturalWidth / ev.target.naturalHeight;
        props.imageLoaded(ev.target.naturalWidth / ratio * aspectRatio);
    };

    return([
        !loading || !props.isCurrentPage? null : 
            <div style={{marginTop: '236px', textAlign: 'center'}}>
                <SpinnerCircularFixed 
                    speed={400}
                    color={'#ddd'}
                    secondaryColor={'#aaa'}
                    thickness={70}
                />
            </div>,
        !props.isCurrentPage && !props.preload? null :
            <ProtocolPageImage 
                rotation={props.rotation}
                dims={dims}
                zoom={props.zoom}
                hide={loading || !props.isCurrentPage}
                src={props.picture.url}
                onLoad={imageLoaded}
                ref={ref}
            />
    ]);
};