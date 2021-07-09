import React, { useEffect, useContext, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';

import { AuthContext } from '../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faFastForward,
  faFastBackward,
} from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

import AdminFilter from './AdminFilter';

import Loading from '../../layout/Loading';

import Tooltip from '../../utils/Tooltip';

import { mapRoleLocalization } from '../../utils/Util';

const TableViewContainer = styled.div`
  padding: 40px;

  hr {
    border: 1px solid #ccc;
    border-bottom: none;
  }
`;

const PaginationLinks = styled.div`
  padding: 20px;
  text-align: center;

  a {
    color: #444;
    margin: 0 10px;
    text-decoration: none;

    &:hover {
      color: #777;
    }

    &.disabled {
      color: #999;
      pointer-events: none;
    }
  }
`;

const UserTable = styled.table`
  background-color: white;
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 10px #aaa;

  thead {
    background-color: #f5f5f5;
    text-align: left;
    border-bottom: 2px solid #eee;

    th {
      padding: 10px;
    }
  }

  td {
    padding: 8px 15px;
    border: none;
  }

  tr {
    cursor: pointer;
    border-bottom: 1px solid #eaeaea;

    &:hover {
      background-color: rgb(202, 255, 249);
    }
  }
`;

const RoleIcon = styled.span`
  background-color: #4aa2ff;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  height: 34px;
  display: block;
  width: 34px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #5da2ec;
  }
`;

const RolesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 5px;
`;
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default (props) => {
  const { authGet } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const history = useHistory();
  const rolesState = useContext(AuthContext).roles;

  useEffect(() => {
    let url = '/users';
    const page = query.get('page');
    const firstName = query.get('firstName');
    const lastName = query.get('lastName');
    const email = query.get('email');
    const role = query.get('role');
    const organization = query.get('organization');
    // const limit = query.get('limit');

    if (page || firstName || lastName || email || role || organization)
      url += '?';

    if (page) url += `page=${page}`;
    if (firstName) url += `firstName=${firstName}`;
    if (lastName) url += `lastName=${lastName}`;
    if (email) url += `email=${email}`;
    if (role) url += `role=${role}`;
    if (organization) url += `organization=${organization}`;

    // if (limit) url += `limit=${limit}`;

    setLoading(true);
    authGet(url).then((res) => {
      setLoading(false);
      setData(res.data);
    });
  }, [
    query.get('firstName'),
    query.get('lastName'),
    query.get('email'),
    query.get('page'),
    query.get('role'),
    query.get('organization'),
  ]);

  const renderLinks = () => {
    const firstAvail = data.meta.currentPage !== 1;
    const lastAvail = data.meta.currentPage !== data.meta.totalPages;
    const nextAvail = data.links.next;
    const prevAvail = data.links.previous;

    return (
      <PaginationLinks>
        <Link className={firstAvail ? '' : 'disabled'} to={data.links.first}>
          <FontAwesomeIcon icon={faFastBackward} /> Първа
        </Link>
        <Link className={prevAvail ? '' : 'disabled'} to={data.links.previous}>
          <FontAwesomeIcon icon={faChevronLeft} /> Предишна
        </Link>
        <div
          style={{
            margin: '0 5px',
            display: 'inline-block',
            color: '#444',
            width: '60px',
          }}
        >
          {data.meta.currentPage} / {data.meta.totalPages}
        </div>
        <Link className={nextAvail ? '' : 'disabled'} to={data.links.next}>
          Следваща <FontAwesomeIcon icon={faChevronRight} />
        </Link>
        <Link className={lastAvail ? '' : 'disabled'} to={data.links.last}>
          Последна <FontAwesomeIcon icon={faFastForward} />
        </Link>
      </PaginationLinks>
    );
  };

  const openUser = (id) => {
    history.push(`/user/${id}`);
  };

  const roles = (roles) => {
    return roles.length === 0 ? (
      <i>Без Роля</i>
    ) : (
      roles.map((role, idx) => {
        return createRoleItem(role, idx);
      })
    );
  };

  const createRoleItem = (role, idx) => {
    let roleName = mapRoleLocalization(rolesState, role) ?? role[0];
    let color = '#9e9e9e';
    switch (role) {
      case 'user':
        color = '#4caf50';
        break;
      case 'validator':
        color = '#6c6cff';
        break;
      case 'lawyer':
        color = '#00bcd4';
        break;
      case 'streamer':
        color = '#ff9800';
        break;
      case 'admin':
        color = '#ff3a39';
        break;
      default:
        break;
    }
    return roleCircle(roleName, idx, color);
  };

  const roleCircle = (roleName, idx, color) => {
    return (
      <Tooltip key={idx} text={roleName}>
        <RoleIcon style={{ backgroundColor: color }}>{roleName[0]}</RoleIcon>
      </Tooltip>
    );
  };

  return (
    <>
      <TableViewContainer>
        <h1>Административна секция</h1>
        <AdminFilter />
        <hr />
        {!data ? (
          <Loading />
        ) : (
          <>
            {renderLinks()}
            <UserTable>
              <thead>
                <tr>
                  <th>Име</th>
                  <th>Фамилия</th>
                  <th>Ел. поща</th>
                  <th>Телефон</th>
                  <th>ПИН</th>
                  <th>Съгласие за данни</th>
                  {/* <th>Регистриран на</th> */}
                  <th>Роли</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8">
                      <Loading />
                    </td>
                  </tr>
                ) : (
                  data.items.map((user, i) => (
                    <tr key={user.id} onClick={() => openUser(user.id)}>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.pin}</td>
                      <td>{user.hasAgreedToKeepData ? 'Да' : 'Не'}</td>
                      {/* <td>{user.registeredAt}</td> */}
                      <td>
                        <RolesContainer>{roles(user.roles)}</RolesContainer>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </UserTable>
            {renderLinks()}
          </>
        )}
      </TableViewContainer>
    </>
  );
};
