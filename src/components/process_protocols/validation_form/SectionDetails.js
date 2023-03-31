import React, { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'
import { ProtocolStatus } from '../../../common/enums/protocol-status'
import { ProtocolType } from '../../../common/enums/protocol-type'
import { AuthContext } from '../../App'
import Towns from '../../modules/filter_components/Towns'

// #region Styled components

const SectionInputDiv = styled.div`
  width: 100%;

  span {
    font-size: 12px;
    text-align: center;
    display: inline-block;
    padding: 3px 0;
    border-left: 1px solid #eee;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    color: #333;
    //font-weight: bold;

    &.last {
      border-right: 1px solid #eee;
    }
  }

  .box {
    width: 36px;
    height: 44px;
    border: 1px solid #eee;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: top;
    border-right: none;

    &.last {
      border-right: 1px solid #eee;
    }

    &.invalid {
      background-color: #ff8f8f;
    }

    &.changed {
      background-color: #fdfd97;
    }
  }

  input {
    letter-spacing: 14.4px;
    box-sizing: border-box;
    border: none;
    font-size: 36px;
    font-family: 'Courier New', monospace;
    padding: 2px 0 0 6px;
    z-index: 30;
    display: inline-block;
    position: relative;
    background: none;
    color: #333;

    &:focus {
      border: none;
      background: none;
      outline: none;
    }
  }
`

const ChooseProtocolTypeDiv = styled.div`
  input {
    margin-right: 5px;
  }

  label {
    margin-right: 25px;
  }
`

const ButtonStyle = styled.button`
  background-color: #32d114;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
  width: 14rem;
  margin-left: 16px;
  height: 36px;
  &:hover {
    background-color: #48c231;
  }

  &:active {
    background-color: #5cbb4b;
    border-bottom: none;
  }

  &:disabled {
    background-color: #d5d5d5;
  }
`

// #endregion

export default function SectionDetails(props) {
  const { authGet, authPost } = useContext(AuthContext)

  const [towns, setTowns] = useState([]) //sets all towns in one municipality
  const [town, setTown] = useState('')
  const [selectedTown, setSelectedTown] = useState('')

  const getBoxClass = (boxNum) => {
    const status = props.fieldStatus[`sectionId${boxNum}`]
    return status.invalid
      ? 'box invalid'
      : status.changed
      ? 'box changed'
      : 'box'
  }

  useEffect(async () => {
    if (props.sectionData.rawData != null && !props.sectionData.sectionExist) {
      const { town, electionRegion } = props.sectionData.rawData

      const country = town?.country?.code
      if (country !== '000') {
        const resForeignTowns = await authGet(`/towns?country=${country}`)
        setTowns(resForeignTowns.data)
      } else {
        const resDomesticTowns = await authGet(
          `/towns?country=000&election_region=${electionRegion?.code}&municipality=${town.municipality.code}`
        )
        setTowns(resDomesticTowns.data)
      }
    }
  }, [props.sectionData, props.sectionData.sectionExist])

  const createNewSection = async () => {
    await authPost(`/sections`, {
      id: props.formState.formData.sectionId,
      town: town,
    })

    props.refetchNewSection()
  }

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>Номер на секция</td>
            <td style={{ paddingBottom: '20px' }}>
              <SectionInputDiv>
                <div>
                  <div className={getBoxClass(1)}>
                    <input
                      type="text"
                      inputMode="numeric"
                      tabIndex={1}
                      autoFocus={true}
                      style={{ width: '333px' }}
                      value={props.formState.formData.sectionId}
                      maxLength={9}
                      name="sectionId"
                      onChange={props.handleProtocolNumberChange}
                    />
                  </div>
                  <div className={getBoxClass(2)} />
                  <div className={getBoxClass(3)} />
                  <div className={getBoxClass(4)} />
                  <div className={getBoxClass(5)} />
                  <div className={getBoxClass(6)} />
                  <div className={getBoxClass(7)} />
                  <div className={getBoxClass(8)} />
                  <div className={getBoxClass(9) + ' last'} />
                  <br />
                  <span style={{ width: '72px' }}>Район</span>
                  <span style={{ width: '72px' }}>Община</span>
                  <span style={{ width: '72px' }}>Адм. ед.</span>
                  <span className="last" style={{ width: '108px' }}>
                    Секция
                  </span>
                </div>
              </SectionInputDiv>
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: '14px', margin: '0' }}>
        {props.sectionData.country &&
          props.sectionData.country !== 'България' && (
            <>
              държава <b>{props.sectionData.country}</b>,{' '}
            </>
          )}
        {props.sectionData.municipality && (
          <>
            община <b>{props.sectionData.municipality}</b>,{' '}
          </>
        )}
        {props.sectionData.town && (
          <>
            населено място <b>{props.sectionData.town}</b>
          </>
        )}
        {props.sectionData.cityRegion && (
          <>
            <br />
            административен район <b>{props.sectionData.cityRegion}</b>
          </>
        )}
        <br />
        {props.sectionData.electionRegion && (
          <>
            изборен район <b>{props.sectionData.electionRegion}</b>
          </>
        )}
        <br />
        {props.sectionData.address && (
          <>
            адрес: <b>{props.sectionData.address}</b>
          </>
        )}
      </p>
      {props.sectionData.country && !props.sectionData.sectionExist && (
        <>
          <p style={{ fontSize: '14px', color: 'red' }}>
            Въведената секция не е намерена. Искате ли да я създадете?
          </p>
          Населено място:<br></br>
          <Towns
            towns={towns}
            isAbroad={props.sectionData.rawData.town.country.isAbroad}
            setRegions={() => {}}
            setTown={setTown}
            selectedTown={selectedTown}
            setSelectedTown={setSelectedTown}
          />
          <ButtonStyle disabled={town === ''} onClick={createNewSection}>
            Създай секция
          </ButtonStyle>
        </>
      )}

      {props.sectionData.sectionExist && (
        <>
          {props.protocol.author?.organization.name && (
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingTop: '20px' }}>
                    Изпратен от (организация):
                  </td>
                  <td style={{ paddingTop: '20px' }}>
                    {props.protocol.author?.organization.name}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          <h5 style={{ margin: '10px 0' }}>Чернова ли е протоколът?</h5>
          <ChooseProtocolTypeDiv>
            <label>
              <input
                type="radio"
                tabIndex={2}
                name="isFinal"
                value={ProtocolStatus.DRAFT}
                onChange={(e) =>
                  e.target.checked && props.setIsFinal(ProtocolStatus.DRAFT)
                }
              />
              Чернова
            </label>
            <label>
              <input
                type="radio"
                name="isFinal"
                value={ProtocolStatus.ORIGINAL}
                onChange={(e) =>
                  e.target.checked && props.setIsFinal(ProtocolStatus.ORIGINAL)
                }
              />
              Оригинал
            </label>
          </ChooseProtocolTypeDiv>
        </>
      )}

      {props.isFinal != 'UNKNOWN' && (
        <>
          <h5 style={{ margin: '10px 0' }}>Изберете вид протокол</h5>
          <ChooseProtocolTypeDiv>
            <input
              type="radio"
              id="paper"
              name="protocolType"
              onChange={(e) =>
                props.setProtocolType(
                  e.target.checked ? ProtocolType.PAPER : null
                )
              }
            />
            <label htmlFor="paper">Хартиен</label>
            <input
              type="radio"
              id="paper-machine"
              name="protocolType"
              onChange={(e) =>
                props.setProtocolType(
                  e.target.checked ? ProtocolType.PAPER_MACHINE : null
                )
              }
            />
            <label htmlFor="paper-machine">Хартиено-машинен</label>
          </ChooseProtocolTypeDiv>
          <hr />
        </>
      )}
    </>
  )
}
