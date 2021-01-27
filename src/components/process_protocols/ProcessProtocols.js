import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { ContentPanel } from '../sections/Sections';
import ProtocolPhotos from './ProtocolPhotos';
import VerifyProtocolInfo from './VerifyProtocolInfo';

export default props => {
    const [protocol, setProtocol] = useState(null);

    const nextProtocol = () => {
        setProtocol({
            photos: [
                '234602054-01.png',
                '234602054-02.png',
                '234602054-03.png',
                '234602054-04.png',
                '234602054-05.png',
                '234602054-06.png',
                '234602054-07.png',
                '234602054-08.png',
                '234602054-09.png',
                '234602054-10.png',
                '234602054-11.png',
                '234602054-12.png',
                '234602054-13.png',
                '234602054-14.png',
            ]
        });
    };

    return(
        !protocol?
            <div>
                <h1>Обработка на протоколи</h1>
                <Link to="/protocols">Обратно</Link>
                <hr/>
                <p>
                    Когато сте готови, натиснете долу и ще ви бъде назначен протокол.
                </p>
                <button onClick={nextProtocol}>Следващ протокол</button>
            </div> :
            <VerifyProtocolInfo protocol={protocol} returnProtocol={() => setProtocol(null)}/>
    );
};