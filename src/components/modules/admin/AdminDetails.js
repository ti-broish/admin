import React, { useState, useEffect, useContext } from 'react';
import { ContentPanel } from '../Modules';
import { useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';


export default props => {
    const { authGet } = useContext(AuthContext);
    const { userId } = useParams();
    const history = useHistory();
    const [data, setData] = useState(null);

    useEffect(() => {
        authGet(`/users/${userId}`).then(res => {
            setData(res.data);
        });
    }, []);

    const goBack = () => {
        history.goBack()
    }

    return(
        <ContentPanel>
            <button onClick={goBack}>Назад</button>
        </ContentPanel>
    );
}