import React, { useState, useEffect, useContext } from 'react'

import { Link } from 'react-router-dom'

import { AuthContext } from '../../App'

import Statuses from '../filter_components/Statuses'
import TextInput from '../filter_components/TextInput'
import Published from '../filter_components/Published'

import Countries from '../filter_components/Countries'
import MIRs from '../filter_components/MIRs'
import Municipalities from '../filter_components/Municipalities'
import Towns from '../filter_components/Towns'
import Regions from '../filter_components/Regions'

import styled from 'styled-components'

const FilterTable = styled.table`
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
  width: 10rem;

  &:hover {
    background-color: #5da2ec;
  }

  &:active {
    background-color: #1d5a9b;
    box-shadow: inset 0 5px 5px -5px rgba(0, 0, 0, 0.5);
  }
`

export default function ViolationFilter(props) {
  const { authGet } = useContext(AuthContext)

  const [section, setSection] = useState('')

  const [disabled, setDisabled] = useState(true) //sets callback function for disabling field
  const [published, setPublished] = useState('')

  const [country, setCountry] = useState('000')
  const [selectedCountry, setSelectedCountry] = useState('')

  const [mirs, setMirs] = useState([]) //sets all MIRs in Bulgaria
  const [electionRegion, setElectionRegion] = useState('00') //gets the chosen MIR
  const [selectedElectionRegion, setSelectedElectionRegion] = useState('')

  const [municipalities, setMunicipalities] = useState([]) //sets the municipalities in one MIR
  const [municipality, setMunicipality] = useState('00') //gets the chosen municipality
  const [selectedMunicipality, setSelectedMunicipality] = useState('')

  const [towns, setTowns] = useState([]) //sets all towns in one municipality
  const [town, setTown] = useState('00')
  const [selectedTown, setSelectedTown] = useState('')

  const [regions, setRegions] = useState([]) //sets the election regions in one town
  const [cityRegion, setCityRegion] = useState('00')

  const [isAbroad, setIsAbroad] = useState(false) //sets if country is Bulgaria or not

  const [statuses, setStatuses] = useState([])
  const [status, setStatus] = useState('')

  let url = ''

  let params = {
    country: country,
    electionRegion: electionRegion,
    section: section,
    municipality: municipality,
    town: town,
    cityRegion: cityRegion,
    status: status,
    published: published,
  }

  for (const [key, value] of Object.entries(params)) {
    if (value && !(value + '').match(/0{1,3}/) && value !== '') {
      url += `&${key}=${value}`
    } else {
      url.replace(`&${key}=${value}`, '')
    }
  }

  useEffect(async () => {
    //gets all the MIRs
    const resElectionRegions = await authGet('/election_regions')

    const resStatuses = await authGet('/violations/statuses')
    setStatuses(resStatuses.data)

    //if country is NOT Bulgaria: gets all the cities in the foreign country
    if (country !== '000') {
      setElectionRegion('32')

      const resForeignTowns = await authGet(`/towns?country=${country}`)
      //sets the cities in the foreign country and sets MIR to the last one which is "Abroad"
      setTowns(resForeignTowns.data)
      setMirs(resElectionRegions.data.slice(-1))
    } else {
      //if country is Bulgaria: gets all towns in the given MIR and municipality
      const resDomesticTowns = await authGet(
        `/towns?country=000&election_region=${electionRegion}&municipality=${municipality}`
      )
      //sets the cities in the given MIR && Municipality and sets the MIRs list to all MIRs except the last "Abroad" one
      setMirs(resElectionRegions.data.slice(0, -1))
      setTowns(resDomesticTowns.data)
    }
  }, [country, municipality, electionRegion, town])

  const clearHandler = () => {
    setStatus('')
    setSelectedCountry('')
    setCountry('000')
    setSelectedElectionRegion('')
    setIsAbroad(false)
    setDisabled(true)
    setSelectedMunicipality('Всички')
    setSelectedTown('Всички')
    setCityRegion('')
    setMunicipality('00')
    setElectionRegion('00')
    setTown('')
    setSection('')
    setPublished('')
  }

  return (
    <FilterTable>
      <tbody>
        <tr>
          <td>
            N на секция:<br></br>{' '}
            <TextInput textInput={section} setTextInput={setSection} />
          </td>
          <td>
            Публикуван:<br></br>{' '}
            <Published published={published} setPublished={setPublished} />
          </td>
          <td>
            Статус:<br></br>
            <Statuses
              status={status}
              statuses={statuses}
              setStatus={setStatus}
            />
          </td>
          <td></td>
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
              setElectionRegion={setElectionRegion}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              setMunicipality={setMunicipality}
              setTown={setTown}
              setCityRegion={setCityRegion}
              setSelectedElectionRegion={setSelectedElectionRegion}
            />
          </td>
          <td>
            МИР:<br></br>
            <MIRs
              isAbroad={isAbroad}
              mirs={mirs}
              setMunicipalities={setMunicipalities}
              setDisabled={setDisabled}
              setElectionRegion={setElectionRegion}
              setTowns={setTowns}
              setRegions={setRegions}
              setMunicipality={setMunicipality}
              electionRegion={electionRegion}
              selectedElectionRegion={selectedElectionRegion}
              setSelectedElectionRegion={setSelectedElectionRegion}
            />
          </td>
          <td></td>
          <td>
            <br></br>
            <Link to="/violations">
              <ButtonStyle onClick={clearHandler}>Изчисти</ButtonStyle>
            </Link>
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
              setMunicipality={setMunicipality}
              selectedMunicipality={selectedMunicipality}
              setSelectedMunicipality={setSelectedMunicipality}
            />
          </td>
          <td>
            Населено място:<br></br>
            <Towns
              towns={towns}
              disabled={disabled}
              setDisabled={setDisabled}
              setRegions={setRegions}
              setTown={setTown}
              isAbroad={isAbroad}
              selectedTown={selectedTown}
              setSelectedTown={setSelectedTown}
            />
          </td>
          <td>
            Район:<br></br>
            <Regions
              isAbroad={isAbroad}
              disabled={disabled}
              regions={regions}
              setCityRegion={setCityRegion}
              cityRegion={cityRegion}
            />
          </td>
          <td>
            <br></br>
            <Link to={`/violations?${url}`}>
              <ButtonStyle>Търси</ButtonStyle>
            </Link>
          </td>
        </tr>
      </tbody>
    </FilterTable>
  )
}
