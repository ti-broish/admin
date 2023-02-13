import React, { useState, useEffect, useContext } from 'react';

import { ContentPanel } from '../Modules';

import { useHistory, useParams } from 'react-router-dom';

import { AuthContext } from '../../App';
import ImageGallery from '../../utils/ImageGallery';
import Loading from '../../layout/Loading';
import { TableStyle } from '../Profile';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { BackButton } from '../violations/ViolationDetails';

export default (props) => {
  const { authGet } = useContext(AuthContext);
  const { protocol } = useParams();
  const history = useHistory();
  const [data, setData] = useState(null);

  useEffect(() => {
    authGet(`/protocols/${protocol}`).then((res) => {
      setData(res.data);
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
          Протокол {protocol}
        </span>
      </h1>
      <hr />
      {!data ? (
        <Loading />
      ) : (
        <div>
          <h2>Секция</h2>
          <TableStyle>
            <tbody>
              <tr>
                <td>Номер</td>
                <td>{data.section.id}</td>
              </tr>
              <tr>
                <td>Адрес</td>
                <td>{data.section.place}</td>
              </tr>
            </tbody>
          </TableStyle>
          <hr />
          <h2>Протокол</h2>
          <TableStyle>
            <tbody>
              <tr>
                <td>Изпратен от (организация)</td>
                <td>{data.author?.organization.name}</td>
              </tr>
              {data.assignees?.map((assignee, idx) => (
                <tr key={idx}>
                  <td>Проверява се от</td>
                  <td>
                    {assignee.firstName} {assignee.lastName}
                  </td>
                </tr>
              ))}
              <tr>
                <td>Действителни гласове</td>
                <td>{data.results.validVotesCount}</td>
              </tr>
              <tr>
                <td>Недействителни гласове</td>
                <td>{data.results.invalidVotesCount}</td>
              </tr>
              <tr>
                <td>Машинни гласове</td>
                <td>{data.results.machineVotesCount}</td>
              </tr>
            </tbody>
          </TableStyle>
          <hr />
          <h2>Резултати</h2>
          <TableStyle>
            <tbody>
              {data.results.results?.map((result, idx) => (
                <tr key={idx}>
                  <td>{result.party.name}</td>
                  <td>{result.validVotesCount}</td>
                  <td>{result.invalidVotesCount}</td>
                  <td>{result.machineVotesCount}</td>
                  <td>{result.nonMachineVotesCount}</td>
                </tr>
              ))}
            </tbody>
          </TableStyle>
          <hr />
          <h2>Снимки</h2>
          <ImageGallery
            items={data.pictures.map((picture) => ({
              original: picture.url,
            }))}
          />
        </div>
      )}
    </ContentPanel>
  );
};
