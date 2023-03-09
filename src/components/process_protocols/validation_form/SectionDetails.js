import React from 'react'

import styled from 'styled-components'

const SectionInput = styled.div`
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

const ChooseProtocolType = styled.div`
  input {
    margin-right: 5px;
  }

  label {
    margin-right: 25px;
  }
`

export default (props) => {
  const getBoxClass = (boxNum) => {
    const status = props.fieldStatus[`sectionId${boxNum}`]
    return status.invalid
      ? 'box invalid'
      : status.changed
        ? 'box changed'
        : 'box'
  }

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>Номер на секция</td>
            <td style={{ paddingBottom: '20px' }}>
              <SectionInput>
                <div>
                  <div className={getBoxClass(1)}>
                    <input
                      type="text"
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
              </SectionInput>
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: '14px', margin: '0' }}>
        {!props.sectionData.country ? null : (
          <>
            Държава: <b>{props.sectionData.country}</b>,{' '}
          </>
        )}
        {!props.sectionData.electionRegion ? null : (
          <>
            Изборен район: <b>{props.sectionData.electionRegion}</b>,{' '}
          </>
        )}
        <br />
        {!props.sectionData.municipality ? null : (
          <>
            Община: <b>{props.sectionData.municipality}</b>,{' '}
          </>
        )}
        {!props.sectionData.town ? null : (
          <>
            Населено място: <b>{props.sectionData.town}</b>,{' '}
          </>
        )}
        <br />
        {!props.sectionData.cityRegion ? null : (
          <>
            Район: <b>{props.sectionData.cityRegion}</b>,{' '}
          </>
        )}
        {!props.sectionData.address ? null : (
          <>
            Локация: <b>{props.sectionData.address}</b>
          </>
        )}
      </p>
      <table>
        <tbody>
          <tr>
            <td style={{ paddingTop: '20px' }}>Изпратен от (организация):</td>
            <td style={{ paddingTop: '20px' }}>
              {props.protocol.author?.organization.name}
            </td>
          </tr>
        </tbody>
      </table>
      <h5 style={{ margin: '10px 0' }}>Чернова ли е протоколът?</h5>
      <ChooseProtocolType>
        <input
          type="radio"
          id="isNotFinal"
          name="isFinal"
          value="false"
          onClick={() => props.setIsFinal(false)}
        />
        <label htmlFor="isNotFinal">Чернова</label>
        <input
          type="radio"
          id="isFinal"
          name="isFinal"
          value="true"
          onClick={() => props.setIsFinal(true)}
        />
        <label htmlFor="isFinal">Оригинал</label>
      </ChooseProtocolType>
      <h5 style={{ margin: '10px 0' }}>Изберете вид протокол</h5>
      <ChooseProtocolType>
        {/* <input
          type="radio"
          id="machine"
          name="protocolType"
          onClick={() => props.setProtocolType('machine')}
        />
        <label htmlFor="machine">Машинен</label> */}
        <input
          type="radio"
          id="paper"
          name="protocolType"
          onClick={() => props.setProtocolType('paper')}
        />
        <label htmlFor="paper">Хартиен</label>
        <input
          type="radio"
          id="paper-machine"
          name="protocolType"
          onClick={() => props.setProtocolType('paper-machine')}
        />
        <label htmlFor="paper-machine">Хартиено-машинен</label>
      </ChooseProtocolType>
      {/* {props.protocolType === 'machine' ||
      props.protocolType === 'paper-machine' ? (
        <>
          <h5 style={{ margin: '10px 0' }}>Брой машини</h5>
          <ChooseProtocolType>
            <input
              readOnly
              type="radio"
              id="1machine"
              name="machineCount"
              value="1machine"
              onClick={() => props.setMachineCount(1)}
              checked={props.machineCount === 1}
            />
            <label htmlFor="1machine">1 машина</label>
            <input
              readOnly
              type="radio"
              id="2machines"
              name="machineCount"
              value="2machines"
              onClick={() => props.setMachineCount(2)}
              checked={props.machineCount === 2}
            />
            <label htmlFor="2machines">2 машини</label>
          </ChooseProtocolType>
        </>
      ) : null} */}
      <hr />
    </>
  )
}
