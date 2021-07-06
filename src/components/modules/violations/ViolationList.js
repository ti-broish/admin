import React, { useState, useEffect, useContext } from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faFastForward,
  faFastBackward,
} from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from '../../App';
import Loading from '../../layout/Loading';

import styled from 'styled-components';
import ViolationFilter from './ViolationFilter';

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

const ViolationTable = styled.table`
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

const ViolationStatus = styled.span`
  font-weight: bold;
`;

const AssigneeIcon = styled.span`
  background-color: #4aa2ff;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  height: 34px;
  display: block;
  width: 34px;
  padding: 8px 3px;
  box-sizing: border-box;
  margin-left: 20px;
`;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default (props) => {
  const { authGet } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const query = useQuery();
  const history = useHistory();

  useEffect(() => {
    let url = '/violations';
    const page = query.get('page');
    // const limit = query.get('limit');
    const country = query.get('country');
    const electionRegion = query.get('electionRegion');
    const assignee = query.get('assignee');
    const section = query.get('section');
    const municipality = query.get('municipality');
    const town = query.get('town');
    const cityRegion = query.get('cityRegion');
    const status = query.get('status');
    const published = query.get('published');

    if (
      page ||
      country ||
      electionRegion ||
      assignee ||
      section ||
      municipality ||
      town ||
      cityRegion ||
      status ||
      published
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
    if (published) url += `&published=${published}`;
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
    query.get('published'),
  ]);

  const status = (apiStatus) => {
    switch (apiStatus) {
      case 'received':
        return (
          <ViolationStatus style={{ color: '#6c6cff' }}>
            Получен
          </ViolationStatus>
        );
      case 'rejected':
        return (
          <ViolationStatus style={{ color: '#ff3939' }}>
            Отхвърлен
          </ViolationStatus>
        );
      case 'processed':
        return (
          <ViolationStatus style={{ color: '#46df00' }}>
            Обработен
          </ViolationStatus>
        );
      case 'processing':
        return (
          <ViolationStatus style={{ color: '#ecd40e' }}>
            Обработва се
          </ViolationStatus>
        );
      default:
        return apiStatus;
    }
  };

  const assignees = (assignees) => {
    return assignees.length === 0 ? (
      <i>Свободен</i>
    ) : (
      <AssigneeIcon>
        {assignees[0].firstName[0]}
        {assignees[0].lastName[0]}
      </AssigneeIcon>
    );
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

  const openViolation = (id) => {
    history.push(`/violation/${id}`);
  };

  return (
    <TableViewContainer>
      <h1>Обработване на сигнали</h1>
      <ViolationFilter />

      <hr />
      {!data ? (
        <Loading />
      ) : (
        <>
          {renderLinks()}
          <ViolationTable>
            <thead>
              <tr>
                {/* <th>Назначен</th> */}
                <th>№ на секция</th>
                <th>Град</th>
                <th>Автор</th>
                <th>Описание</th>
                <th>Публикуван</th>
                <th>Статут</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr key="loading">
                  <td colSpan="6">
                    <Loading />
                  </td>
                </tr>
              ) : (
                data.items.map((violation, i) => (
                  <tr
                    key={violation.id}
                    onClick={() => openViolation(violation.id)}
                  >
                    {/* <td
                      style={
                        violation.assignees.length === 0 ? {} : { padding: 0 }
                      }
                    >
                      {assignees(violation.assignees)}
                    </td> */}
                    <td>
                      {!violation.section ? (
                        <i>Не е посочена секция</i>
                      ) : (
                        violation.section.id
                      )}
                    </td>
                    <td>{violation.town.name}</td>
                    <td>
                      {violation.author.firstName} {violation.author.lastName}
                    </td>
                    <td>{violation.description.slice(0, 40) + '...'}</td>
                    <td>
                      {violation.isPublished ? (
                        <span style={{ color: 'green' }}>Да</span>
                      ) : (
                        <span style={{ color: 'red' }}>Не</span>
                      )}
                    </td>
                    <td>{status(violation.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </ViolationTable>
          {renderLinks()}
        </>
      )}
    </TableViewContainer>
  );
};
