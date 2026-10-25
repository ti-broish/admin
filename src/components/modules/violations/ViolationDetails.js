import React, { useState, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'

import { useHistory, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faTimes,
  faCheck,
  faEdit,
  faUpload,
  faEyeSlash,
  faDove,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'

import { ContentPanel } from '../Modules'
import { AuthContext } from '../../App'
import ImageGallery from '../../utils/ImageGallery'
import Loading from '../../layout/Loading'

import { TableStyle } from '../Profile'

import styled from 'styled-components'
import CommentSection from './CommentSection'

import {
  formatDateShort,
  formatTime,
  formatTextWithLinks,
} from '../../utils/Util'
import PublishModal from './PublishModal'
import { apiHost } from '../../../config'
import {
  parsePlaceLine,
  findCityRegion,
  sectionsAtAddress,
  commonElectionRegionCode,
  expectedSectionPrefixes,
} from './violationPlace'

const UpdatesTable = styled(TableStyle)`
  td,
  td:first-child {
    color: #333;
    font-weight: normal;
    text-align: center;
    font-size: 12px;
  }
`

export const BackButton = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 6px;
  background: none;
  margin-right: 5px;
  font-size: 48px;

  &:hover {
    background-color: #eee;
  }
`

const ViolationStatus = styled.span`
  font-weight: bold;
  color: ${(props) => props.color};
  border: 4px solid ${(props) => props.color};
  border-radius: 5px;
  padding: 6px;
  vertical-align: top;
  display: inline-block;
  margin-left: 10px;
  font-size: 20px;
  margin-top: 5px;
`

const FancyButton = styled.button`
  border: none;
  padding: 5px 0px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 5px;
  box-sizing: border-box;
  display: inline-block;
  font-weight: bold;
  margin: 0 2px;
  min-width: 130px;
  position: relative;
  color: white;

  &:active:enabled {
    box-shadow: inset 0 5px 5px -5px rgba(0, 0, 0, 0.5);
  }

  &:disabled {
    cursor: auto;
    color: white;
  }

  &:first-of-type {
    margin-left: 0;
  }
`

const FancyButtonGreen = styled(FancyButton)`
  background-color: #44e644;
  border-bottom: 5px solid #2eae1c;

  &:hover {
    background-color: #2ece2e;
  }

  &:disabled {
    background-color: #9efd9e;
    border-bottom-color: #9aec8e;
  }
`

export const FancyButtonBlue = styled(FancyButton)`
  background-color: #36a2e3;
  border-bottom: 5px solid #1e70b9;

  &:hover {
    background-color: #48b4f4;
  }

  &:disabled {
    background-color: #b6e4ff;
    border-bottom-color: #b9d4ec;
  }
`

const FancyButtonYellow = styled(FancyButton)`
  background-color: #f9d71c;
  border-bottom: 5px solid #c1b718;

  &:hover {
    background-color: #ffeb47;
  }

  &:disabled {
    background-color: #fff6b0;
    border-bottom-color: #ece793;
  }
`

const FancyButtonRed = styled(FancyButton)`
  background-color: #ff3e3e;
  border-bottom: 5px solid #b92121;

  &:hover {
    background-color: #ff5a5a;
  }

  &:disabled {
    background-color: #f4d2d2;
    border-bottom-color: #dfc1c1;
  }
`

const TextAreaFormStyle = styled.form`
  width: 100%;

  textarea {
    width: 100%;
    font-size: 18px;
    padding: 20px;
    border: 1px solid #eee;
    margin: 20px 0;
    box-sizing: border-box;
  }
`

// Without a section, a town in several election regions (София: МИР 23, 24, 25) has no single region.
// Showing the first one made every such signal look like МИР 23.
const electionRegionLabel = (data) => {
  if (data.section?.electionRegion?.name)
    return data.section.electionRegion.name
  const regions = data.town?.municipality?.electionRegions || []
  if (regions.length > 1) {
    const codes = regions
      .map((region) => region.code || region.name)
      .filter(Boolean)
      .sort()
    return `${data.town.name}, без секция (МИР ${codes.join('/')})`
  }
  return regions[0]?.name || ''
}

const townLine = (data) =>
  `${data.town.name}, ${
    data.town.municipality
      ? `община ${data.town.municipality.name}`
      : `${data.town.country.name}`
  }`

// "гр.София, р-н Средец, <address>, без секция (МИР 24)" when the address from
// the description maps to sections in one election region.
const noSectionLabel = (data, place, lookup) => {
  if (!lookup?.electionRegionCode) return electionRegionLabel(data)
  return [
    data.town.name,
    place?.district ? `р-н ${place.district}` : null,
    place?.address,
    `без секция (МИР ${lookup.electionRegionCode})`,
  ]
    .filter(Boolean)
    .join(', ')
}

const updateLabel = (update) => {
  if (update.type === 'section' && update.payload) {
    return `секция: ${update.payload.from || 'няма'} → ${update.payload.to}`
  }
  return update.type
}

const apiErrorMessage = (err) => {
  const message = err?.response?.data?.message
  if (Array.isArray(message)) return message.join('; ')
  if (message) return message
  return err?.message || 'Грешка при запис'
}

const SectionEditor = ({ data, lookup, token, onSaved }) => {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const prefixes = expectedSectionPrefixes(data, lookup)
  const candidates = (lookup?.candidates || []).filter(
    (section) => section.id !== data.section?.id
  )

  const save = (sectionId) => {
    const section = (sectionId || value).trim()
    if (!/^\d{9}$/.test(section)) {
      setError('Номерът на секцията трябва да е 9 цифри')
      return
    }
    setSaving(true)
    setError(null)
    const currentUser = firebase.auth().currentUser
    Promise.resolve(currentUser ? currentUser.getIdToken() : token)
      .then((idToken) =>
        axios.put(
          `${apiHost}/violations/${data.id}/section`,
          { section },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Accept-Language': 'bg-BG',
            },
          }
        )
      )
      .then(() => {
        setValue('')
        return onSaved()
      })
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setSaving(false))
  }

  return (
    <tr>
      <td>{data.section ? 'Смени секция' : 'Задай секция'}</td>
      <td>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            save()
          }}
        >
          <input
            type="text"
            inputMode="numeric"
            maxLength={9}
            value={value}
            placeholder={prefixes.length ? `${prefixes[0]}…` : '9 цифри'}
            onChange={(event) =>
              setValue(event.target.value.replace(/\D/g, ''))
            }
            style={{ fontSize: '16px', padding: '4px', width: '120px' }}
          />{' '}
          <FancyButtonBlue type="submit" disabled={saving || !value}>
            {saving ? 'Момент...' : 'Запази'}
          </FancyButtonBlue>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            9 цифри
            {prefixes.length
              ? `, започва с ${prefixes.join(' / ')} (МИР ${[
                  ...new Set(prefixes.map((prefix) => prefix.slice(0, 2))),
                ].join('/')})`
              : ''}
          </div>
          {candidates.length > 0 && (
            <div style={{ marginTop: '6px', fontSize: '14px' }}>
              Секции на адреса:{' '}
              {candidates.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  disabled={saving}
                  onClick={() => save(section.id)}
                  style={{ margin: '2px', cursor: 'pointer' }}
                  title={`Задай секция ${section.id}`}
                >
                  {section.id}
                </button>
              ))}
            </div>
          )}
          {error && (
            <div style={{ color: '#e44', marginTop: '4px' }}>{error}</div>
          )}
        </form>
      </td>
    </tr>
  )
}

export default (props) => {
  const { authGet, authPost, user, authPatch, authDelete, token } =
    useContext(AuthContext)
  const { violation } = useParams()
  const history = useHistory()
  const [data, setData] = useState(null)
  const [buttonLoading, setButtonLoading] = useState({
    assign: false,
    process: false,
    reject: false,
  })

  const [modalState, setModalState] = useState({ isOpen: false })

  const [lookup, setLookup] = useState(null)

  const loadViolation = () =>
    authGet(`/violations/${violation}`).then((res) => {
      setData(res.data)
    })

  useEffect(() => {
    loadViolation()
  }, [])

  const place = useMemo(
    () => parsePlaceLine(data?.description),
    [data?.description]
  )

  // Sections at the address from the description (same API as the web form)
  useEffect(() => {
    setLookup(null)
    if (!data?.town || !place) return
    const cityRegion = findCityRegion(data.town, place.district)
    if (!place.address && !cityRegion) return
    let cancelled = false
    const query = cityRegion
      ? `town=${data.town.id}&city_region=${encodeURIComponent(
          cityRegion.code
        )}`
      : `town=${data.town.id}`
    axios
      .get(`${apiHost}/sections?${query}`, {
        headers: { 'Accept-Language': 'bg-BG' },
      })
      .then((res) => {
        if (cancelled) return
        const sections = Array.isArray(res.data) ? res.data : []
        const candidates = place.address
          ? sectionsAtAddress(sections, place.address)
          : []
        const scope = candidates.length
          ? candidates
          : cityRegion
          ? sections
          : []
        setLookup({
          cityRegion,
          candidates,
          electionRegionCode: scope.length
            ? commonElectionRegionCode(scope)
            : null,
        })
      })
      .catch(() => {
        if (!cancelled) setLookup(null)
      })
    return () => {
      cancelled = true
    }
  }, [data?.id, data?.town?.id, place?.address, place?.district])

  const assignYourself = () => {
    if (iAmAssignee) {
      setButtonLoading({ ...buttonLoading, assign: true })
      authDelete(`/violations/${violation}/assignees/${user.id}`).then(
        (res) => {
          setButtonLoading({ ...buttonLoading, assign: false })
          if (res.data.status === 'Accepted') {
            setData({ ...data, assignees: [] })
          }
        }
      )
    } else {
      setButtonLoading({ ...buttonLoading, assign: true })
      authPost(`/violations/${violation}/assignees`, { id: user.id }).then(
        (res) => {
          setButtonLoading({ ...buttonLoading, assign: false })
          if (res.data.status === 'Accepted') {
            setData({ ...data, assignees: [user], status: 'processing' })
          }
        }
      )
    }
  }

  const goBack = () => {
    history.goBack()
  }

  const processViolation = () => {
    setButtonLoading({ ...buttonLoading, process: true })
    authPost(`/violations/${violation}/process`).then((res) => {
      setButtonLoading({ ...buttonLoading, process: false })
      setData(res.data)
    })
  }

  const rejectViolation = () => {
    setButtonLoading({ ...buttonLoading, reject: true })
    authPost(`/violations/${violation}/reject`).then((res) => {
      setButtonLoading({ ...buttonLoading, reject: false })
      setData(res.data)
    })
  }

  const openPublishModal = () => {
    setModalState({
      isOpen: true,
      violationText: data.publishedText ? data.publishedText : data.description,
      confirmHandler: publishViolation,
      cancelHandler: () => setModalState({ isOpen: false }),
    })
  }

  const publishViolation = (publishedText) => {
    setButtonLoading({ ...buttonLoading, publish: true })
    setModalState({ isOpen: false })

    const reqBody = {
      isPublished: !data.isPublished,
    }

    if (!data.isPublished) {
      reqBody['publishedText'] = publishedText
    }

    authPatch(`/violations/${violation}`, reqBody).then((res) => {
      setButtonLoading({ ...buttonLoading, publish: false })
      setData(res.data)
    })
  }

  const status = (apiStatus) => {
    switch (apiStatus) {
      case 'received':
        return <ViolationStatus color={'#6c6cff'}>Получен</ViolationStatus>
      case 'rejected':
        return <ViolationStatus color={'#ff3939'}>Отхвърлен</ViolationStatus>
      case 'processed':
        return <ViolationStatus color={'#46df00'}>Обработен</ViolationStatus>
      case 'processing':
        return <ViolationStatus color={'#ecd40e'}>Обработва се</ViolationStatus>
      default:
        return apiStatus
    }
  }

  const iAmAssignee =
    data && data.assignees.length !== 0 && data.assignees[0].id === user.id

  const assignPossible = () =>
    (data.assignees.length === 0 || iAmAssignee) && !buttonLoading.assign
  // Processed and rejected can be swapped to correct a status set by mistake
  const processPossible = () =>
    iAmAssignee &&
    ['processing', 'rejected'].includes(data.status) &&
    !buttonLoading.process
  const rejectPossible = () =>
    iAmAssignee &&
    ['processing', 'processed'].includes(data.status) &&
    !buttonLoading.reject
  const publishPossible = () => !buttonLoading.publish

  return (
    <ContentPanel>
      <PublishModal
        isOpen={modalState.isOpen}
        violationText={modalState.violationText}
        confirmHandler={modalState.confirmHandler}
        cancelHandler={modalState.cancelHandler}
      />
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
          Обработка на сигнал
        </span>
        {!data ? null : status(data.status)}
      </h1>
      {!data ? (
        <Loading />
      ) : (
        <div>
          <h2 style={{ color: '#666' }}>
            {data.assignees.length === 0 ? (
              'Свободен за обработка'
            ) : (
              <>
                Обработва се от
                {' ' +
                  data.assignees[0].firstName +
                  ' ' +
                  data.assignees[0].lastName}{' '}
                {!iAmAssignee ? null : (
                  <span style={{ color: 'red' }}> (Вие)</span>
                )}
              </>
            )}
          </h2>
          <FancyButtonYellow
            onClick={assignYourself}
            disabled={!assignPossible()}
          >
            {buttonLoading.assign ? (
              'Момент...'
            ) : iAmAssignee ? (
              <>
                <FontAwesomeIcon icon={faDove} /> Освободи{' '}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEdit} /> Обработвай{' '}
              </>
            )}
          </FancyButtonYellow>
          <FancyButtonGreen
            onClick={processViolation}
            disabled={!processPossible()}
          >
            {buttonLoading.process ? (
              'Момент...'
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} /> Приключи{' '}
              </>
            )}
          </FancyButtonGreen>

          <FancyButtonBlue
            onClick={data.isPublished ? publishViolation : openPublishModal}
            disabled={!publishPossible()}
          >
            {buttonLoading.publish ? (
              'Момент...'
            ) : data.isPublished ? (
              <>
                <FontAwesomeIcon icon={faEyeSlash} /> Скрий
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUpload} /> Публикувай
              </>
            )}
          </FancyButtonBlue>
          <FancyButtonRed
            onClick={rejectViolation}
            disabled={!rejectPossible()}
          >
            {buttonLoading.reject ? (
              'Момент...'
            ) : (
              <>
                <FontAwesomeIcon icon={faTimes} /> Отхвърли{' '}
              </>
            )}
          </FancyButtonRed>
          {data.type === 'video' && (
            <p style={{ color: '#e44', fontWeight: 'bold', fontSize: '16px' }}>
              <FontAwesomeIcon icon={faVideo} /> Видео сигнал
            </p>
          )}
          <hr />
          <h2>Описание</h2>
          <p
            style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{
              __html: formatTextWithLinks(data.description),
            }}
          />
          <hr />
          {!data.publishedText ? null : (
            <>
              <h2 style={{ marginBottom: '5px' }}>Текст за публикуване</h2>
              {data.isPublished ? null : (
                <h5 style={{ margin: '5px 0', color: 'red' }}>
                  Сигналът не е публикуван
                </h5>
              )}
              <p>{data.publishedText}</p>
              <hr />
            </>
          )}
          <h2>Изпратен от</h2>
          <TableStyle>
            <tbody>
              <tr>
                <td>Имена</td>
                <td>
                  {data?.author?.firstName
                    ? `${data?.author?.firstName} ${data?.author?.lastName}`
                    : data?.author?.name}
                </td>
              </tr>
              {data.author?.organization && (
                <tr>
                  <td>Организация</td>
                  <td>
                    {data.author?.organization
                      ? data.author.organization.name
                      : null}
                  </td>
                </tr>
              )}
              <tr>
                <td>Ел. поща</td>
                <td>{data.author?.email}</td>
              </tr>
              <tr>
                <td>Телефон</td>
                <td>{data.author?.phone}</td>
              </tr>
            </tbody>
          </TableStyle>
          <hr />
          {data.section ? (
            <div>
              <h2>Секция</h2>
              <TableStyle>
                <tbody>
                  <tr>
                    <td>Номер</td>
                    <td>{data.section.id}</td>
                  </tr>
                  <tr>
                    <td>Град</td>
                    <td>{townLine(data)}</td>
                  </tr>
                  <tr>
                    <td>MИР</td>
                    <td>{electionRegionLabel(data)}</td>
                  </tr>
                  <tr>
                    <td>Локация</td>
                    <td>{data.section.place}</td>
                  </tr>
                  <SectionEditor
                    data={data}
                    lookup={lookup}
                    token={token}
                    onSaved={loadViolation}
                  />
                </tbody>
              </TableStyle>
              <hr />
            </div>
          ) : (
            <div>
              <h2>Град</h2>
              <TableStyle>
                <tbody>
                  <tr>
                    <td>Град</td>
                    <td>{townLine(data)}</td>
                  </tr>
                  {place?.district && (
                    <tr>
                      <td>Район</td>
                      <td>{place.district}</td>
                    </tr>
                  )}
                  {place?.address && (
                    <tr>
                      <td>Адрес</td>
                      <td>{place.address}</td>
                    </tr>
                  )}
                  <tr>
                    <td>MИР</td>
                    <td>{noSectionLabel(data, place, lookup)}</td>
                  </tr>
                  <SectionEditor
                    data={data}
                    lookup={lookup}
                    token={token}
                    onSaved={loadViolation}
                  />
                </tbody>
              </TableStyle>
              <hr />
            </div>
          )}
          <h2>История</h2>
          <div
            style={{
              height: '150px',
              overflowY: 'auto',
              border: '1px solid #bbb',
            }}
          >
            <UpdatesTable>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Час</th>
                  <th>Потребител</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {data.updates
                  .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
                  .map((update) => (
                    <tr key={update.id}>
                      <td>{formatDateShort(update.timestamp)}</td>
                      <td>{formatTime(update.timestamp)}</td>
                      <td>
                        {update.actor?.firstName} {update.actor?.lastName}
                      </td>
                      <td>{updateLabel(update)}</td>
                    </tr>
                  ))}
              </tbody>
            </UpdatesTable>
          </div>
        </div>
      )}
      <hr />
      <CommentSection section={data && data.section} />
      {data && data.pictures && data.pictures.length > 0 && (
        <>
          <h2>Снимки</h2>
          <ImageGallery
            items={data.pictures.map((picture) => ({
              original: picture.url,
            }))}
          />
        </>
      )}
    </ContentPanel>
  )
}
