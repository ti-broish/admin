import React, { useState, useContext } from 'react';

import { AuthContext } from './App';

import styled from 'styled-components';

const Background = styled.div`
    background-color: #eee;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
`;

const LoginPanel = styled.div`
    background-color: white;
    width: 600px;
    margin: 0 auto;
    margin-top: 10%;
    padding: 20px 40px;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const LoginForm = styled.form`
    box-sizing: border-box;
    width: 100%;
`;

const LoginFormLabel = styled.label`
    box-sizing: border-box;
    width: 100%;
    margin: 20px 0;
    display: block;
    display: none;
`;

const LoginFormInput = styled.input`
    box-sizing: border-box;
    width: 100%;
    font-size: 24px;
    background: none;
    border: none;
    border-bottom: 1px solid #aaa;
    padding: 7px;
    margin: 20px 0;
`;

const LoginFormSubmitButton = styled.input`
    border: 1px solid #aaa;
    background: #eee;
    padding: 10px;
    font-size: 24px;
    cursor: pointer;
    margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
    color: red;
`;

export default props => {
    const [formData, setFormData] = useState({email: "", password: ""});
    const [message, setMessage] = useState();
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext);

    const handleSubmit = ev => {
        ev.preventDefault();
        setLoading(true);
        authContext.logIn(formData).then(() => {
            setLoading(false);
        }).catch(error => {
            setMessage(error.message);
            setLoading(false);
        });
    };

    const handleChange = ev => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
    };

    return(
        <div>
            <Background/>
            <LoginPanel>
                <h1>Вход в системата</h1>
                {!message? null : <ErrorMessage>{message}</ErrorMessage>}
                <LoginForm onSubmit={handleSubmit}>
                    <LoginFormLabel>Имейл</LoginFormLabel>
                    <LoginFormInput
                        type="text"
                        name="email"
                        placeholder="Вашият имейл"
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <LoginFormLabel>Парола</LoginFormLabel>
                    <LoginFormInput
                        type="password"
                        name="password"
                        placeholder="Вашата парола"
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <LoginFormSubmitButton
                        type="submit"
                        value={loading? 'Свързване...' : 'Вход'}
                        disabled={loading}
                    />
                </LoginForm>
            </LoginPanel>
        </div>
    )
};