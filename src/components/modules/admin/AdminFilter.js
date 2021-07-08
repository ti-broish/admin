import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../App';

import SendBy from '../filter_components/SendBy';
import Roles from '../filter_components/Roles';
import TextInput from '../filter_components/TextInput';

import styled from 'styled-components';

const FilterTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 24px;
`;

const ButtonStyle = styled.button`
  background-color: #4892e1;
  color: white;
  border: none;
  padding: 7px 13px;
  font-size: 20px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
  border-bottom: 3px solid #2a68aa;
  margin-top: 0px;
  width: 10rem;

  &:hover {
    background-color: #5da2ec;
  }

  &:active {
    background-color: #1d5a9b;
    border-bottom: none;
    margin-top: 3px;
  }
`;

export default (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');

  let url = '';

  let params = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    organization: organization,
    role: role,
  };

  for (const [key, value] of Object.entries(params)) {
    if (value !== '00' && value !== '' && value) {
      url += `&${key}=${value}`;
    } else {
      url.replace(`&${key}=${value}`, '');
    }
  }

  useEffect(() => {}, [firstName, lastName, email, organization, role]);

  const clearAll = () => {
    setOrganization('');
    setRole('');
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <>
      <FilterTable>
        <div>
          Име: <br></br>
          <TextInput textInput={firstName} setTextInput={setFirstName} />
        </div>
        <div>
          Фамилия:<br></br>
          <TextInput textInput={lastName} setTextInput={setLastName} />
        </div>
        <div>
          Емейл: <br></br>
          <TextInput textInput={email} setTextInput={setEmail} />
        </div>

        <div>
          Организация: <br></br>
          <SendBy
            organization={organization}
            setOrganization={setOrganization}
          />
        </div>
        <div>
          Роля: <br></br>
          <Roles role={role} setRole={setRole} />
        </div>
        <div></div>
        <Link to={`/users`}>
          <ButtonStyle onClick={clearAll}>Изчисти</ButtonStyle>
        </Link>
        <div></div>

        <Link to={`/users?${url}`}>
          <ButtonStyle>Търси</ButtonStyle>
        </Link>
      </FilterTable>
    </>
  );
};
