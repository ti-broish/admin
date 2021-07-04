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
import Loading from '../../layout/Loading';

import ProtocolFilter from './ProtocolFilter';

import firebase from 'firebase/app';
import 'firebase/auth';

import axios from 'axios';

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

const ProtocolTable = styled.table`
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

const ProtocolStatus = styled.span`
  font-weight: bold;
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

  useEffect(() => {
    let url = '/protocols';

    const page = query.get('page');
    const limit = query.get('limit');
    const country = query.get('country');
    const electionRegion = query.get('electionRegion');
    const assignee = query.get('assignee');
    const section = query.get('section');
    const municipality = query.get('municipality');
    const town = query.get('town');
    const cityRegion = query.get('cityRegion');
    const status = query.get('status');
    const organization = query.get('organization');
    const origin = query.get('origin');

    if (
      page ||
      limit ||
      country ||
      electionRegion ||
      assignee ||
      section ||
      municipality ||
      town ||
      cityRegion ||
      status ||
      organization ||
      origin
    )
      url += '?';

    if (country) url += `country=${country}`;
    if (electionRegion) url += `&electionRegion=${electionRegion}`;
    if (municipality) url += `&municipality=${municipality}`;
    if (assignee) url += `&assignee=${assignee}`;
    if (section) url += `&section=${section}`;
    if (town) url += `&town=${town}`;
    if (cityRegion) url += `&cityRegion=${cityRegion}`;
    if (status) url += `&status=${status}`;
    if (organization) url += `&organization=${organization}`;
    if (origin) url += `&origin=${origin}`;
    if (page) url += `page=${page}`;
    // if (limit) url += `limit=${limit}`;

    setLoading(true);
    authGet(url).then((res) => {
      setLoading(false);
      setData(res.data);
    });
  }, [
    query.get('page'),
    query.get('country'),
    query.get('electionRegion'),
    query.get('assignee'),
    query.get('section'),
    query.get('municipality'),
    query.get('town'),
    query.get('cityRegion'),
    query.get('status'),
    query.get('organization'),
    query.get('origin'),
  ]);

  const origin = (apiOrigin) => {
    switch (apiOrigin) {
      case 'ti-broish':
        return 'Ти Броиш';
      default:
        return apiOrigin;
    }
  };

  const status = (apiStatus) => {
    switch (apiStatus) {
      case 'received':
        return (
          <ProtocolStatus style={{ color: '#6c6cff' }}>Получен</ProtocolStatus>
        );
      case 'rejected':
        return (
          <ProtocolStatus style={{ color: '#ff3939' }}>
            Отхвърлен
          </ProtocolStatus>
        );
      case 'approved':
        return (
          <ProtocolStatus style={{ color: '#46df00' }}>Одобрен</ProtocolStatus>
        );
      case 'replaced':
        return (
          <ProtocolStatus style={{ color: '#ecd40e' }}>
            Редактиран
          </ProtocolStatus>
        );
      case 'published':
        return (
          <ProtocolStatus style={{ color: '#00bcd4' }}>
            Публикуван
          </ProtocolStatus>
        );
      case 'ready':
        return (
          <ProtocolStatus style={{ color: '#009688' }}>Готов</ProtocolStatus>
        );
      default:
        return apiStatus;
    }
  };

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

  const openProtocol = (id) => {
    history.push(`/protocol/${id}`);
  };

  return (
    <TableViewContainer>
      <h1>Протоколи</h1>
      <ProtocolFilter />
      <hr />
      {!data ? (
        <Loading />
      ) : (
        <>
          {renderLinks()}
          <ProtocolTable>
            <thead>
              <tr>
                <th>№ на секция</th>
                <th>Произход</th>
                <th>Адрес</th>
                <th>Статут</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">
                    <Loading />
                  </td>
                </tr>
              ) : (
                data.items.map((protocol, i) => (
                  <tr key={i} onClick={() => openProtocol(protocol.id)}>
                    <td style={{ textAlign: 'right' }}>
                      {protocol.section.id}
                    </td>
                    <td>{origin(protocol.origin)}</td>
                    <td>{protocol.section.place}</td>
                    <td>{status(protocol.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </ProtocolTable>
          {renderLinks()}
        </>
      )}
    </TableViewContainer>
  );
};
