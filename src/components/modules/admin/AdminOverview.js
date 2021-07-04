import React from 'react';

import  Tabs from '../../layout/Tabs' 

export default props => {
    return (
        <>

        <div className="row text-left">

         <Tabs>
            <Tabs.TabPane key={'Tab1'}  tab={'Test'}>
                  bla bla 
            </Tabs.TabPane>
            <Tabs.TabPane key={'Tab2'} tab={'Tab 2'}>
                test test
            </Tabs.TabPane>
         </Tabs>
         </div>
         </>
    )
}