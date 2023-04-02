import React, { useContext } from 'react'

import { AuthContext } from '../App'

import { ContentPanel } from './Modules'

import styled from 'styled-components'

export const TableStyle = styled.table`
  width: 100%;
  font-size: 18px;
  color: #333;

  td {
    padding: 5px;

    &:first-child {
      color: #aaa;
      font-weight: bold;
    }
  }
`

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

  &:hover {
    background-color: #5da2ec;
  }

  &:active {
    background-color: #1d5a9b;
    box-shadow: inset 0 5px 5px -5px rgba(0, 0, 0, 0.5);
  }
`

export default (props) => {
  const authContext = useContext(AuthContext)

  return (
    <ContentPanel>
      <h1>Моите данни</h1>
      <hr />
      <TableStyle>
        <tbody>
          <tr>
            <td>Имена</td>
            <td>
              {authContext.user.firstName} {authContext.user.lastName}
            </td>
          </tr>
          <tr>
            <td>Имейл</td>
            <td>{authContext.user.email}</td>
          </tr>
          <tr>
            <td>Телефон</td>
            <td>{authContext.user.phone}</td>
          </tr>
          <tr>
            <td>ПИН</td>
            <td>{authContext.user.pin}</td>
          </tr>
          <tr>
            <td>Организация</td>
            <td>{authContext.user.organization.name}</td>
          </tr>
          <tr>
            <td>Съгласие за съхранение на данни</td>
            <td>{authContext.user.hasAgreedToKeepData ? 'Да' : 'Не'}</td>
          </tr>
        </tbody>
      </TableStyle>
      <hr />
      <ButtonStyle onClick={authContext.logOut}>Изход</ButtonStyle>
      <br />
    </ContentPanel>
  )
}
