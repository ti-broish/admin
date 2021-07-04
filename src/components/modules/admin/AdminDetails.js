import React, { useState, useEffect, useContext } from 'react';
import { ContentPanel } from '../Modules';
import { useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { TableStyle } from '../Profile';
import { BackButton } from '../violations/ViolationDetails';

import Loading from '../../layout/Loading';

export default (props) => {
  const { authGet } = useContext(AuthContext);
  const { userId } = useParams();
  const history = useHistory();
  const [userData, setUserData] = useState(null);
  const [roles, setRoles] = useState(null);

  useEffect(() => {
    authGet(`/users/${userId}`).then((res) => {
      setUserData(res.data);
    });

    authGet(`/users/roles`).then((res) => {
      setRoles(res.roles);
    });
  }, []);

  const goBack = () => {
    history.goBack();
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
    </ContentPanel>
  );
};
