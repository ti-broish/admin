import React, { useState, useEffect } from 'react';

import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuthProvider, FirebaseAuthConsumer } from "@react-firebase/auth";

import axios from 'axios';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Start from './Start';
import Login from './Login';

import styled from 'styled-components';

const AppStyle = styled.div`
    font-family: Montserrat, sans-serif;
`;

const config = {
    apiKey: "AIzaSyB5Zi-TCtek2d1rrxPCUykHc7hUGruY7aU",
    projectId: "ti-broish",
    databaseURL: "https://ti-broish.firebaseio.com",
    authDomain: "ti-broish.firebaseapp.com",
};

export const AuthContext = React.createContext();

export default props => {

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                const idToken = await user.getIdToken();

                const res = await axios.get('https://d1tapi.dabulgaria.bg/me', { 
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });

                setUserData(res.data);
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
            <FirebaseAuthProvider firebase={firebase} {...config}>
                <FirebaseAuthConsumer>
                {({ isSignedIn, user, providerId }) => {
                    return(
                        <AuthContext.Provider value={{isSignedIn, user, providerId, userData, logIn, logOut}}>
                        {
                            isSignedIn
                            ?   <Switch>
                                    <Route path='/' component={Start}/>
                                    <Redirect to='/'/>
                                </Switch>
                            :   <Switch>
                                    <Route path='/login' component={Login}/>
                                    <Redirect to='/login'/>
                                </Switch>
                        }
                        </AuthContext.Provider>
                    );
                }}
                </FirebaseAuthConsumer>
            </FirebaseAuthProvider>
        </BrowserRouter>
        </AppStyle>
    );
};