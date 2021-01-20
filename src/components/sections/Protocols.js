import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import ProtocolsHome from './protocols/ProtocolsHome';
import ProcessProtocols from './protocols/ProcessProtocols';

export default props => {
    return(
        <Switch>
            <Route path='/protocols/process' component={ProcessProtocols}/>
            <Route path='/protocols' component={ProtocolsHome}/>
            <Redirect to='/protocols'/>
        </Switch>
    );
};