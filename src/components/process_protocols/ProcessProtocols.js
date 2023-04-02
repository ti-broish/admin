import React, { useState, useContext, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import VerifyProtocolInfo from './VerifyProtocolInfo'

import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Loading from '../layout/Loading'

const ReadyScreen = styled.div`
  max-width: 900px;
  display: block;
  margin: 0 auto;
  padding: 50px;
  //border: 1px solid #aaa;
  border-radius: 50px;
  //margin-top: 30px;

  hr {
    margin: 20px 0;
    border: 1px solid #ddd;
    border-top: 0;
  }
`

const NextProtocolButton = styled.button`
  border: none;
  background-color: #22c122;
  color: white;
  padding: 20px 50px;
  font-size: 36px;
  cursor: pointer;
  margin: 0 auto;
  border-radius: 20px;
  border-bottom: 10px solid #118a00;
  display: block;
  margin-top: 60px;
  box-sizing: border-box;
  position: relative;
  top: 0;

  &:hover {
    background-color: #2ece2e;
  }

  &:active {
    box-shadow: inset 0px 0px 10px #333;
  }
`

const Message = styled.p`
  font-size: 20px;
  padding: 10px;
  border-radius: 10px;

  ${(props) =>
    props.fail
      ? `
      border: 1px solid red;
      color: white;
      background-color: #de575d;
    `
      : `
    border: 1px solid green;
    color: green;
    background-color: #e0ffe0;

    `}
`

const BackButton = styled.button`
  cursor: pointer;
  background: none;
  border: 1px solid #aaa;
  border-radius: 10px;
  margin-right: 10px;
`

import { AuthContext } from '../App'

export default (props) => {
  const [protocol, setProtocol] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [failedMessage, setFailedMessage] = useState(null)

  const history = useHistory()

  const { token, user, authGet, authDelete, authPost } = useContext(AuthContext)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const res = await authGet(`/protocols?status=received&assignee=${user.id}`)

    if (res.data.items.length > 0) {
      const res2 = await authGet(`/protocols/${res.data.items[0].id}`)
      setProtocol(res2.data)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  const returnProtocol = async () => {
    setLoading(true)
    const res = await authDelete(
      `/protocols/${protocol.id}/assignees/${user.id}`
    )

    setLoading(false)
    setMessage(`Протокол ${protocol.id} ВЪРНАТ без взето решение.`)
    setProtocol(null)
  }

  const nextProtocol = async () => {
    setLoading(true)

    const res = await authPost('/protocols/assign')

    if (res.status === 204) {
      setMessage(`Опашката за протоколи е празна`)
    } else {
      const res2 = await authGet(`/protocols/${res.data.id}`)
      setProtocol(res2.data)
    }

    setLoading(false)
  }

  const processingDone = (message) => {
    setMessage(message)
    setProtocol(null)
  }

  const processingFailed = (message) => {
    setFailedMessage(message)
    setProtocol(null)
  }

  const reorderPictures = (newPictures) => {
    setProtocol({ ...protocol, pictures: newPictures })
  }

  return loading ? (
    <Loading fullScreen />
  ) : !protocol ? (
    <ReadyScreen>
      <h1 style={{ textAlign: 'center', fontSize: '54px' }}>
        <BackButton onClick={history.goBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </BackButton>
        Валидация на протоколи
      </h1>
      <hr />
      {!message && !failedMessage ? (
        <p>
          Когато сте готови, натиснете бутона долу и ще ви бъде назначен
          протокол.
        </p>
      ) : message && !failedMessage ? (
        <Message>{message}</Message>
      ) : (
        <Message fail>{failedMessage}</Message>
      )}

      <NextProtocolButton onClick={nextProtocol}>
        <FontAwesomeIcon icon={faFile} /> Следващ протокол
      </NextProtocolButton>
      <br />
      <br />
      <br />
      <p style={{ textAlign: 'center' }}>
        <a
          style={{ fontSize: '20px' }}
          href="https://tibroish.bg/files/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F-%D0%B7%D0%B0-%D0%B2%D0%B0%D0%BB%D0%B8%D0%B4%D0%B8%D1%80%D0%B0%D0%BD%D0%B5-%D0%A2%D0%B8-%D0%B1%D1%80%D0%BE%D0%B8%D1%88.pdf"
          target="_blank"
        >
          Инструкции за валидиране
        </a>
      </p>
      <iframe
        width="800"
        height="450"
        style={{ margin: '20px auto', display: 'block' }}
        src="https://www.youtube-nocookie.com/embed/j2ChYutSk-c"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </ReadyScreen>
  ) : (
    <VerifyProtocolInfo
      protocol={protocol}
      reorderPictures={reorderPictures}
      returnProtocol={returnProtocol}
      setLoading={setLoading}
      processingDone={processingDone}
      processingFailed={processingFailed}
    />
  )
}
