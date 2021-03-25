import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileInvoice, faIdBadge, faUsersCog, 
    faNewspaper, faSatelliteDish, faSignOutAlt,
    faCheckSquare,
    faPersonBooth
} from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';
import { AuthContext } from '../../App';

const NavigationStyle = styled.nav`
    height: 100%;
    width: 100%;
    background-color: rgb(56, 222, 203);
    overflow: hidden;
    color: white;
`;

const NavTitle = styled.div`
    padding: 10px;
    width: 100%;
    box-sizing: border-box;

    img { width: 100%; }
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
    const { logOut, user } = useContext(AuthContext);

    console.log(user);

    const requireRoles = roles => {
        for(const role of roles) {
            if(user.roles.includes(role))
                return true;
        }
        return false;
    };

    return(
        <NavigationStyle>
            <NavTitle>
                <img src='/logo_horizontal_white.png'/>
            </NavTitle>
            <NavLinks>
                <NavLink to='/profile'>
                    <FontAwesomeIcon icon={faIdBadge}/> Профил
                </NavLink>
                { !requireRoles(['validator', 'external-validator', 'admin'])? null :
                    <NavLink to='/protocols/process'>    
                        <FontAwesomeIcon icon={faCheckSquare}/> Проверявай
                    </NavLink>
                }
                { !requireRoles(['admin'])? null :
                    <NavLink to='/protocols'>    
                        <FontAwesomeIcon icon={faFileInvoice}/> Протоколи
                    </NavLink>
                }
                { !requireRoles(['lawyer', 'admin'])? null :
                    <NavLink to='/violations'>
                        <FontAwesomeIcon icon={faSatelliteDish}/> Сигнали
                    </NavLink>
                }
                { !requireRoles(['admin'])? null :
                    <NavLink to='/users'>
                        <FontAwesomeIcon icon={faUsersCog}/> Администрация
                    </NavLink>
                }
                {/*
                <NavLink to='/posts'>
                    <FontAwesomeIcon icon={faNewspaper}/> Статии
                </NavLink>*/}
                <NavLink onClick={logOut}>
                    <FontAwesomeIcon icon={faSignOutAlt}/> Изход
                </NavLink>
            </NavLinks>
            <NavFooter>
                „Демократична България - обединение“ © 2021
            </NavFooter>
        </NavigationStyle>
    )
};