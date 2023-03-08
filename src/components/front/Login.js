import React, { useState, useContext } from 'react'

import { AuthContext } from '../App'

import { Fade } from 'react-awesome-reveal'

import styled from 'styled-components'

const Background = styled.div`
  //background-color: #eee;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`

const LoginPanel = styled.div`
  background-color: white;
  width: 400px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px 40px 0 40px;
  //border: 1px solid #ddd;
  //border-radius: 5px;

  hr {
    border: 1px solid #ddd;
    border-top: none;
    margin: 50px 0 20px 0;
  }
`

const Copyright = styled.div`
  text-align: center;
  margin-bottom: 30px;
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
`

const LoginForm = styled.form`
  box-sizing: border-box;
  width: 100%;
`

const LoginFormLabel = styled.label`
  box-sizing: border-box;
  width: 100%;
  margin: 20px 0;
  display: block;
  display: none;
`

const LoginFormInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  font-size: 24px;
  background: none;
  border: none;
  border-bottom: 1px solid #aaa;
  padding: 7px;
  margin: 20px 0;
  margin-bottom: 20px;

  &:focus {
    border-bottom: 2px solid #356ae6;
    margin-bottom: 19px;
  }

  &:disabled {
    color: #aaa;
    border-bottom: 1px solid #aaa;
  }
`

const LoginFormSubmitButton = styled.input`
  background-color: #4892e1;
  color: white;
  border: none;
  padding: 8px 13px;
  font-size: 25px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
  border-bottom: 3px solid #2a68aa;
  margin-top: 0px;
  width: 100%;

  &:hover {
    background-color: #5da2ec;
  }

  &:active {
    background-color: #1d5a9b;
    border-bottom: none;
    margin-top: 3px;
  }

  &:disabled {
    background-color: #aaa;
    color: #666;
    border-bottom-color: #666;
  }
`

const ErrorMessage = styled.p`
  color: red;
  margin: 0;
`

const ErrorSection = styled.div`
  height: 50px;
  margin: 0;
`

export default (props) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)
  const authContext = useContext(AuthContext)

  const handleSubmit = (ev) => {
    ev.preventDefault()
    setLoading(true)
    authContext
      .logIn(formData)
      .then(() => {
        setLoading(false)
      })
      .catch((error) => {
        setMessage(error.message)
        setLoading(false)
      })
  }

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div>
      <Background />
      <LoginPanel>
        <div
          style={{
            width: '100%',
            padding: '20px 40px',
            boxSizing: 'border-box',
          }}
        >
          <img style={{ width: '100%' }} src="/logo_horizontal.png" />
        </div>
        <ErrorSection>
          {!message ? null : (
            <Fade left>
              <ErrorMessage>{message}</ErrorMessage>
            </Fade>
          )}
        </ErrorSection>
        <LoginForm onSubmit={handleSubmit}>
          <LoginFormLabel>Имейл</LoginFormLabel>
          <LoginFormInput
            type="text"
            name="email"
            placeholder="Вашият имейл"
            onChange={handleChange}
            disabled={loading}
          />
          <LoginFormLabel>Парола</LoginFormLabel>
          <LoginFormInput
            type="password"
            name="password"
            placeholder="Вашата парола"
            onChange={handleChange}
            disabled={loading}
          />
          <LoginFormSubmitButton
            type="submit"
            value={loading ? 'Свързване...' : 'Вход'}
            disabled={loading}
          />
        </LoginForm>
        <hr />
        <Copyright>„Демократична България - обединение“ © 2021</Copyright>
      </LoginPanel>
    </div>
  )
}
