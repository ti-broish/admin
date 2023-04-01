import React, { useState, useEffect } from 'react'

import firebase from 'firebase/app'
import 'firebase/auth'

import axios from 'axios'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Login from './front/Login'
import Loading from './layout/Loading'
import Modules from './modules/Modules'

import styled from 'styled-components'
import ProcessProtocols from './process_protocols/ProcessProtocols'

import {
  apiHost,
  apiKey,
  authDomain,
  databaseURL,
  projectId,
} from '../config.js'

const AppStyle = styled.div`
  font-family: Montserrat, sans-serif;
`

export const AuthContext = React.createContext()

export default (props) => {
  const [state, setState] = useState({
    user: null,
    loading: true,
    token: '',
    parties: [],
    countries: [],
    organizations: [],
  })

  useEffect(() => {
    firebase.initializeApp({ apiKey, authDomain, databaseURL, projectId })

    firebase
      .app()
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          const idToken = await user.getIdToken()

          setState({ ...state, loading: true })
          const res = await axios.get(`${apiHost}/me`, {
            headers: { Authorization: `Bearer ${idToken}` },
          })

          const res2 = await axios.get(`${apiHost}/parties`, {
            headers: { Authorization: `Bearer ${idToken}` },
          })

          const res3 = await axios.get(`${apiHost}/countries`, {
            headers: { Authorization: `Bearer ${idToken}` },
          })

          const res4 = await axios.get(`${apiHost}/organizations`, {
            headers: { Authorization: `Bearer ${idToken}` },
          })

          setState({
            user: res.data,
            loading: false,
            token: idToken,
            parties: res2.data,
            countries: res3.data,
            organizations: res4.data,
          })
        } else {
          setState({
            user: null,
            loading: false,
            token: '',
            parties: [],
            countries: [],
            organizations: [],
          })
        }
      })
  }, [])

  const logIn = ({ email, password }) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  const logOut = () => {
    firebase.app().auth().signOut()
  }

  const authGet = async (path) => {
    let token = state.token
    if (token) {
      const user = firebase.auth().currentUser
      const idToken = await user.getIdToken(true) // Force refresh the token
      if (idToken !== token) {
        token = idToken
        setState({
          user: state.user,
          loading: state.loading,
          token: idToken,
          parties: state.parties,
          countries: state.countries,
          organizations: state.organizations,
        })
      }
    }
    const res = await axios.get(`${apiHost}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'bg-BG',
      },
    })
    return res
  }

  const authPost = async (path, body) => {
    let res
    try {
      res = await axios.post(`${apiHost}${path}`, body ? body : {}, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          'Accept-Language': 'bg-BG',
        },
      })
    } catch (err) {
      if (Array.isArray(err.response.data.message)) {
        alert(
          `Error ${err.response.status}: ${
            err.response.statusText
          }\n${err.response.data.message.map((m, i) => `\n${i + 1}. ${m}`)}`
        )
      } else {
        alert(
          `Error ${err.response.status}: ${err.response.statusText}\n${err.response.data.message}`
        )
      }
      throw err
    }
    return res
  }

  const authDelete = async (path) => {
    const res = await axios.delete(`${apiHost}${path}`, {
      headers: { Authorization: `Bearer ${state.token}` },
    })
    return res
  }

  const authPut = async (path, body) => {
    let res
    try {
      res = await axios.put(`${apiHost}${path}`, body ? body : {}, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          'Accept-Language': 'bg-BG',
        },
      })
    } catch (err) {
      alert(
        `Error ${err.response.status}: ${
          err.response.statusText
        }\n${err.response.data.message.map((m, i) => `\n${i + 1}. ${m}`)}`
      )
      throw err
    }
    return res
  }

  const authPatch = async (path, body) => {
    let res
    try {
      res = await axios.patch(`${apiHost}${path}`, body ? body : {}, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          'Accept-Language': 'bg-BG',
        },
      })
    } catch (err) {
      alert(
        `Error ${err.response.status}: ${
          err.response.statusText
        }\n${err.response.data.message.map((m, i) => `\n${i + 1}. ${m}`)}`
      )
      throw err
    }
    return res
  }

  return (
    <AppStyle>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            user: state.user,
            token: state.token,
            parties: state.parties,
            countries: state.countries,
            organizations: state.organizations,
            logIn,
            logOut,
            authGet,
            authPost,
            authDelete,
            authPut,
            authPatch,
          }}
        >
          {state.loading ? (
            <Loading fullScreen />
          ) : (
            <Switch>
              <Route path="/login">
                {state.user ? <Redirect to="/" /> : <Login />}
              </Route>
              <Route exact path="/protocols/process">
                {!state.user ? <Redirect to="/login" /> : <ProcessProtocols />}
              </Route>
              <Route path="/">
                {!state.user ? <Redirect to="/login" /> : <Modules />}
              </Route>
            </Switch>
          )}
        </AuthContext.Provider>
      </BrowserRouter>
    </AppStyle>
  )
}
