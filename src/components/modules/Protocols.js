import React, { useRef } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import ProtocolsHome from './protocols/ProtocolsHome';
import ProtocolDetails from './protocols/ProtocolDetails';

export default props => {
    const backPage = useRef('/protocols');

    return(
        <Switch>
            <Route path='/protocols/:protocol'>
                <ProtocolDetails backPage={backPage.current}/>
            </Route>
            <Route path='/protocols'>
                <ProtocolsHome setBackPage={newBackPage => { backPage.current = newBackPage; }}/>
            </Route>
            <Redirect to='/protocols'/>
        </Switch>
    );
};