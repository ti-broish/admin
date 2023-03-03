import React, { useState, useEffect } from 'react'

import firebase from 'firebase/app'
import 'firebase/auth'

import axios from 'axios'

import TextInput from '../filters/TextInput'

import Countries from '../filters/Countries'
import MIRs from '../filters/MIRs'
import Municipalities from '../filters/Municipalities'
import Towns from '../filters/Towns'
import Regions from '../filters/Regions'

import styled from 'styled-components'

import { apiHost } from '../../../config'

const FilterlTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    padding: 8px 15px;
    border: none;
    font-size: 15px;
    width: auto;
  }
`

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
  width: 40%;

  &:hover {
    background-color: #5da2ec;
  }

  &:active {
    background-color: #1d5a9b;
    border-bottom: none;
    margin-top: 3px;
  }
`

export default (props) => {
  const [disabled, setDisabled] = useState(true) //sets callback function for disabling field

  const [country, setCountry] = useState('00')

  const [mirs, setMirs] = useState([]) //sets all MIRs in Bulgaria
  const [chosenMir, setChosenMir] = useState('00') //gets the chosen MIR

  const [municipalities, setMunicipalities] = useState([]) //sets the municipalities in one MIR
  const [chosenMunicipality, setChosenMunicipality] = useState('00') //gets the chosen municipality

  const [towns, setTowns] = useState([]) //sets all towns in one municipality

  const [regions, setRegions] = useState([]) //sets the election regions in one town

  const [status, setStatus] = useState('')
  const [isAbroad, setIsAbroad] = useState(false) //sets if country is Bulgaria or not

  const submitHandler = () => {
    props.setFilterStatus(status)
  }

  useEffect(() => {
    firebase
      .app()
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          const idToken = await user.getIdToken()

          //gets all the MIRs
          const res = await axios.get(`${apiHost}/election_regions`, {
            headers: { Authorization: `Bearer ${idToken}` },
          })

          //if country is NOT Bulgaria: gets all the cities in the foreign country
          if (country !== '00') {
            const res2 = await axios.get(
              `${apiHost}/towns?country=${country}`,
              {
                headers: { Authorization: `Bearer ${idToken}` },
              }
            )
            //sets the cities in the foreign country and sets MIR to the last one which is "Abroad"
            setTowns(res2.data)
            setMirs(res.data.slice(-1))
          } else {
            //if country is Bulgaria: gets all towns in the given MIR and municipality
            const res3 = await axios.get(
              `${apiHost}/towns?country=00&election_region=${chosenMir}&municipality=${chosenMunicipality}`,
              {
                headers: { Authorization: `Bearer ${idToken}` },
              }
            )
            //sets the cities in the given MIR && Municipality and sets the MIRs list to all MIRs except the last "Abroad" one
            setMirs(res.data.slice(0, -1))
            setTowns(res3.data)
          }
        }
      })
  }, [country, chosenMunicipality, chosenMir])

  return (
    <FilterlTable>
      <tbody>
        <tr>
          <td>
            N на секция:<br></br> <TextInput />
          </td>
          <td>
            Произход:<br></br> <Origins />
          </td>
          <td>
            Подаден от:<br></br> <SendBy />
          </td>
          <td>
            Статус:<br></br>
            <StatusFilter status={status} setStatus={setStatus} />
          </td>
        </tr>
        <tr>
          <td>
            Държава:<br></br>
            <Countries
              setIsAbroad={setIsAbroad}
              setCountry={setCountry}
              setDisabled={setDisabled}
              setMunicipalities={setMunicipalities}
              setRegions={setRegions}
            />
          </td>
          <td>
            МИР:<br></br>
            <MIRs
              isAbroad={isAbroad}
              mirs={mirs}
              setMunicipalities={setMunicipalities}
              setDisabled={setDisabled}
              setChosenMir={setChosenMir}
              setTowns={setTowns}
              setRegions={setRegions}
            />
          </td>
          <td></td>
          <td>
            <br></br>
            <ButtonStyle onClick={submitHandler}>Изчисти</ButtonStyle>
          </td>
        </tr>
        <tr>
          <td>
            Община:<br></br>
            <Municipalities
              isAbroad={isAbroad}
              municipalities={municipalities}
              disabled={disabled}
              setTowns={setTowns}
              setChosenMunicipality={setChosenMunicipality}
            />
          </td>
          <td>
            Населено място:<br></br>
            <Towns
              towns={towns}
              disabled={disabled}
              setDisabled={setDisabled}
              setRegions={setRegions}
              isAbroad={isAbroad}
            />
          </td>
          <td>
            Район:<br></br>
            <Regions
              isAbroad={isAbroad}
              disabled={disabled}
              regions={regions}
            />
          </td>
          <td>
            <br></br>
            <ButtonStyle onClick={submitHandler}>Търси</ButtonStyle>
          </td>
        </tr>
      </tbody>
    </FilterlTable>
  )
}
