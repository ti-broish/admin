import React from 'react';

import Navigation from './layout/Navigation';

import { Switch, Route, Redirect } from 'react-router-dom';
import Admin from './Admin';
import Posts from './Posts';
import Profile from './Profile';

import ProtocolsHome from './protocols/ProtocolsHome';
import ProtocolDetails from './protocols/ProtocolDetails';

import ViolationList from './violations/ViolationList';
import ViolationDetails from './violations/ViolationDetails';
import AllComments from './violations/AllComments';

import styled from 'styled-components';
import Sections from './Sections';

const NavigationHalf = styled.div`
    width: 220px;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
`;

const ContentHalf = styled.div`
    width: calc(100% - 220px);
    height: 100vh;
    overflow-y: auto;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #eee;
`;

export const ContentPanel = styled.div`
    background-color: white;
    margin: 30px auto;
    max-width: 800px;
    border-radius: 15px;
    //box-shadow: 0px 0px 5px #aaa;
    border: 1px solid #eee;
    padding: 20px 50px;

    hr {
        margin: 20px 0;
        border: 1px solid #ddd;
        border-top: 0;
    }
`;

export default props => {
    return([
        <NavigationHalf>
            <Navigation/>
        </NavigationHalf>,
        <ContentHalf>
            <Switch>
                <Route path='/profile' component={Profile}/>
                <Route path='/sections' component={Sections}/>
                <Route path='/protocol/:protocol' component={ProtocolDetails}/>
                <Route path='/protocols' component={ProtocolsHome}/>
                <Route path='/violation/:violation/comments' component={AllComments}/>
                <Route path='/violation/:violation' component={ViolationDetails}/>
                <Route path='/violations' component={ViolationList}/>
                {/* <Route path='/users' component={Admin}/> */}
                <Route path='/posts' component={Posts}/>
                <Redirect to='/profile'/>
            </Switch>
        </ContentHalf>
    ]);
};
