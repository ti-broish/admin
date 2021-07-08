import React, { useState, useEffect, useContext } from 'react';
import { ContentPanel } from '../Modules';
import { useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { TableStyle } from '../Profile';
import { BackButton } from '../violations/ViolationDetails';

import Loading from '../../layout/Loading';

import styled from 'styled-components';

const CheckboxList = styled.div`
  list-style: none;
  padding: 0;

  li {
    margin-bottom: 0.5rem;
  }

  .checkbox-list-item {
    display: flex;
    justify-content: space-between;

    label {
      vertical-align: text-bottom;
      margin-left: 0.5rem;
    }
  }
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
  const { authGet, authPatch } = useContext(AuthContext);
  const { userId } = useParams();
  const history = useHistory();
  const [userData, setUserData] = useState(null);
  const [roles, setRoles] = useState(null);
  const [rolesUpdateSuccessful, setRolesUpdateSuccessful] = useState(undefined);
  const rolesState = useContext(AuthContext).roles;
  useEffect(async () => {
    const resUser = await authGet(`/users/${userId}`);
    setUserData(resUser.data);

    let allRoles = rolesState;
    if (resUser.data && allRoles) {
      allRoles = allRoles.map((role) => ({
        ...role,
        isChecked: resUser.data.roles.includes(role.role),
      }));
    }
    setRoles(allRoles);
  }, []);

  const goBack = () => {
    history.goBack();
  };

  const saveRoles = () => {
    setRolesUpdateSuccessful(undefined);

    if (roles) {
      const rolesToSave = roles
        .filter((role) => role.isChecked)
        .map((role) => role.role);

      authPatch(`/users/${userData.id}`, {
        roles: rolesToSave,
      }).then((res) => {
        setRolesUpdateSuccessful(res.status === 200);
      });
    }
  };

  const handleOnChange = (role) => {
    const updatedCheckedState = roles.map((item) =>
      item.role === role.role ? { ...item, isChecked: !item.isChecked } : item
    );
    setRoles(updatedCheckedState);
  };

  return (
    <ContentPanel>
      <h1>
        <BackButton onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </BackButton>
        <span
          style={{
            verticalAlign: 'top',
            paddingTop: '9px',
            display: 'inline-block',
          }}
        >
          Лична информация
        </span>
      </h1>
      <hr />

      {!userData ? (
        <Loading />
      ) : (
        <>
          <h2>Профил</h2>
          <TableStyle>
            <tbody>
              <tr>
                <td>Имена</td>
                <td>
                  {userData.firstName} {userData.lastName}
                </td>
              </tr>
              <tr>
                <td>Организация</td>
                <td>
                  {userData.organization ? userData.organization.name : null}
                </td>
              </tr>
              <tr>
                <td>Ел. поща</td>
                <td>{userData.email}</td>
              </tr>
              <tr>
                <td>Телефон</td>
                <td>{userData.phone}</td>
              </tr>
              <tr>
                <td>Съгласие за съхранение на данни</td>
                <td>{userData.hasAgreedToKeepData ? 'Да' : 'Не'}</td>
              </tr>
            </tbody>
          </TableStyle>
        </>
      )}
      <hr />
      <h2>Роли</h2>
      {!roles ? (
        <Loading />
      ) : (
        <>
          <ul style={{ padding: 0 }}>
            <CheckboxList>
              {roles.map((role, index) => {
                return (
                  <li key={index}>
                    <div className="checkbox-list-item">
                      <div>
                        <input
                          type="checkbox"
                          id={`custom-checkbox-${index}`}
                          name={role.roleLocalized}
                          value={role.roleLocalized}
                          checked={role.isChecked}
                          onChange={() => handleOnChange(role)}
                        />
                        <label htmlFor={`custom-checkbox-${index}`}>
                          {role.roleLocalized}
                        </label>
                      </div>
                    </div>
                  </li>
                );
              })}
            </CheckboxList>
          </ul>

          <ButtonStyle onClick={saveRoles}>Запис</ButtonStyle>
          {rolesUpdateSuccessful ===
          undefined ? null : rolesUpdateSuccessful ? (
            <p style={{ fontSize: '12px', color: 'green' }}>
              Ролите бяха актуализирани успешно
            </p>
          ) : (
            <p style={{ fontSize: '12px', color: 'red' }}>
              Грешка при актуализацията на ролите (Опитайте отново)
            </p>
          )}
        </>
      )}
    </ContentPanel>
  );
};
