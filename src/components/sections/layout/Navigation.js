import React from 'react';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faIdBadge, faUsersCog, faNewspaper, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

const NavigationStyle = styled.nav`
    height: 100%;
    width: 100%;
    background-color: rgb(56, 222, 203);
    overflow: hidden;
    color: white;
`;

const NavTitle = styled.div`
    padding: 10px;

    h1 { margin: 0; }
`;

const NavLinks = styled.div`
    background-color: rgb(40, 174, 159);
    padding: 50px 0;
`;

const NavLink = styled(Link)`
    color: white;
    text-decoration: none;
    font-size: 18px;
    width: 100%;
    display: block;
    padding: 5px 10px;
    box-sizing: border-box;

    &:hover {
        background-color: rgb(61, 191, 176);
    }
`;

const NavFooter = styled.div`
    width: 100%;
    position: absolute;
    bottom: 0;
    font-weight: bold;
    text-align: center;
    padding: 15px 5px;
    box-sizing: border-box;
`;

export default props => {
    return(
        <NavigationStyle>
            <NavTitle>
                <h1>ти броиш</h1>
            </NavTitle>
            <NavLinks>
                <NavLink to='/profile'>
                    <FontAwesomeIcon icon={faIdBadge}/> Профил
                </NavLink>
                <NavLink to='/protocols'>    
                    <FontAwesomeIcon icon={faFileInvoice}/> Протоколи
                </NavLink>
                <NavLink to='/violations'>
                    <FontAwesomeIcon icon={faSatelliteDish}/> Сигнали
                </NavLink>
                <NavLink to='/admin'>
                    <FontAwesomeIcon icon={faUsersCog}/> Администрация
                </NavLink>
                <NavLink to='/posts'>
                    <FontAwesomeIcon icon={faNewspaper}/> Статии
                </NavLink>
            </NavLinks>
            <NavFooter>
                „Демократична България - обединение“ © 2021
            </NavFooter>
        </NavigationStyle>
    )
};