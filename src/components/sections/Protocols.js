import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import ProtocolsHome from './protocols/ProtocolsHome';

export default props => {
    return(
        <Switch>
            <Route path='/protocols' component={ProtocolsHome}/>
            <Redirect to='/protocols'/>
        </Switch>
    );
};