import React, { useState, useEffect } from 'react';

import firebase from "firebase/app";
import "firebase/auth";

import axios from 'axios';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from './front/Login';
import Loading from './layout/Loading';
import Modules from './modules/Modules';

import styled from 'styled-components';
import ProcessProtocols from './process_protocols/ProcessProtocols';

const AppStyle = styled.div`
    font-family: Montserrat, sans-serif;
`;

export const AuthContext = React.createContext();

export default props => {

    const [state, setState] = useState({user: null, loading: true, token: ''});

    useEffect(() => {
        firebase.initializeApp({
            apiKey: "AIzaSyB5Zi-TCtek2d1rrxPCUykHc7hUGruY7aU",
            authDomain: "ti-broish.firebaseapp.com",
            databaseURL: "https://ti-broish.firebaseio.com",
            projectId: "ti-broish",
        });

        firebase.app().auth().onAuthStateChanged(async user => {
            if (user) {
                const idToken = await user.getIdToken();

                setState({...state, loading: true});
                const res = await axios.get('https://d1tapi.dabulgaria.bg/me', { 
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });

                setState({user: res.data, loading: false, token: idToken});
            } else {
                setState({user: null, loading: false, token: ''});
            }
        });
    }, []);

    const logIn = ({ email, password }) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    };

    const logOut = () => {
        firebase.app().auth().signOut();
    };
   
    return(
        <AppStyle>
        <BrowserRouter>
            <AuthContext.Provider value={{user: state.user, token: state.token, logIn, logOut}}>
            {
                state.loading
                ? <Loading fullScreen/>
                :    <Switch>
                        <Route path='/login'>
                            {state.user? <Redirect to='/'/> : <Login/>}
                        </Route>
                        <Route exact path='/protocols/process'>
                            {!state.user? <Redirect to='/login'/> : <ProcessProtocols/>}
                        </Route>
                        <Route path='/'>
                            {!state.user? <Redirect to='/login'/> : <Modules/>}
                        </Route>
                    </Switch>
            }
            </AuthContext.Provider>
        </BrowserRouter>
        </AppStyle>
    );
};