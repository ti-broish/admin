import React from 'react'

import styled from 'styled-components'

const ProtocolDetailsTable = styled.table`
  table-layout: inherit;

  button {
    width: 100%;
    box-sizing: border-box;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ddd;
    padding: 8px;
    border-top: 2px solid #ddd;
    border-radius: 10px;
    text-align: right;

    &.changed {
      background-color: #fdfd97;
    }

    &.invalid {
      background-color: #ff8f8f;
    }
  }

  select {
    width: 100%;
    box-sizing: border-box;
  }

  td:nth-child(1) {
    width: 80%;
  }
  td:nth-child(2) {
    width: 20%;
  }
`

const PartyResultsTable = styled.table`
  table-layout: inherit;
  width: 100%;
  border-collapse: collapse;

  tr:nth-child(odd) td {
    background: #ececec;
  }

  button {
    width: 100%;
    box-sizing: border-box;
    background-color: #aaa;
    padding: 6px;
    border-radius: 10px;
    border: none;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ddd;
    padding: 2px 8px;
    border-top: 2px solid #ddd;
    border-radius: 5px;
    text-align: right;

    &.invalid {
      background-color: #ff8f8f;
    }

    &.changed {
      background-color: #fdfd97;
    }
  }

  select {
    width: 100%;
    box-sizing: border-box;
    appearance: none;
    border: 1px solid #ccc;
    border-bottom: 2px solid #ccc;
    border-radius: 5px;
    padding: 3px;
    background: url('data:image/svg+xml;base64,${window.btoa(svgIcon)}')
      no-repeat;
    background-position: right 5px top 50%;
    cursor: pointer;
  }

  ${(props) =>
    props.colCount === 1
      ? `
        td:nth-child(1), th:nth-child(1) { width: 8%; }
        td:nth-child(2), th:nth-child(2) { width: 72%; }
        td:nth-child(3), th:nth-child(3) { width: 20%; }
    `
      : props.colCount === 2
        ? `
        td:nth-child(1), th:nth-child(1) { width: 7%; }
        td:nth-child(2), th:nth-child(2) { width: 60%; }
        td:nth-child(3), th:nth-child(3) { width: 10%; }
        td:nth-child(4), th:nth-child(4) { width: 10%; }
        td:nth-child(5), th:nth-child(5) { width: 10%; }

    `
        : props.colCount === 3
          ? `
        td:nth-child(1), th:nth-child(1) { width: 8%; }
        td:nth-child(2), th:nth-child(2) { width: 71%; }
        td:nth-child(3), th:nth-child(3) { width: 7%; }
        td:nth-child(4), th:nth-child(4) { width: 7%; }
        td:nth-child(5), th:nth-child(5) { width: 7%; }
    `
          : ``}
`

const PartyNumber = styled.span`
  color: ${(props) => (props.textColor ? props.textColor : 'white')};
  font-weight: bold;
  background-color: #${(props) => props.color};
  width: 21px;
  display: block;
  padding: 3px 5px;
  text-align: right;
  border-radius: 3px;
`

const svgIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#ccc" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>'

export default (props) => {
  const partyRow = (party, i) => {
    return (
      <tr key={i}>
        <td>
          {party.id.toString() === '0' ? null : party.color ? (
            <PartyNumber color={party.color}>{party.id}</PartyNumber>
          ) : (
            <PartyNumber color={'white'} textColor={'555'}>
              {party.id}
            </PartyNumber>
          )}
        </td>
        <td>{party.displayName}</td>
        {props.protocolType === 'paper' ||
          props.protocolType === 'paper-machine' ? (
          <td>
            <input
              type="text"
              className={
                props.fieldStatus[`party${party.id}paper`].invalid
                  ? 'invalid'
                  : props.fieldStatus[`party${party.id}paper`].changed
                    ? 'changed'
                    : ''
              }
              name={`party${party.id}paper`}
              value={props.formState.resultsData[`party${party.id}paper`] ?? ''}
              onChange={props.handleResultsChange}
            />
          </td>
        ) : null}
        {[...Array(props.machineCount).keys()].map((i, index) => (
          <td key={index}>
            <input
              type="text"
              className={
                props.fieldStatus[`party${party.id}machine${i + 1}`].invalid
                  ? 'invalid'
                  : props.fieldStatus[`party${party.id}machine${i + 1}`].changed
                    ? 'changed'
                    : ''
              }
              name={`party${party.id}machine${i + 1}`}
              value={
                props.formState.resultsData[
                `party${party.id}machine${i + 1}`
                ] ?? ''
              }
              onChange={props.handleResultsChange}
            />
          </td>
        ))}
        {props.protocolType === 'paper-machine' && (
          <td>
            <input
              type="text"
              className={
                props.fieldStatus[`party${party.id}total`].invalid
                  ? 'invalid'
                  : props.fieldStatus[`party${party.id}total`].changed
                    ? 'changed'
                    : ''
              }
              name={`party${party.id}total`}
              value={props.formState.resultsData[`party${party.id}total`] ?? ''}
              onChange={props.handleResultsChange}
            />
          </td>
        )}
      </tr>
    )
  }

  const calculateColCount = () => {
    let count = 0

    if (
      props.protocolType === 'paper' ||
      props.protocolType === 'paper-machine'
    ) {
      count += 1
    }

    count += props.machineCount

    return count
  }

  const inputField = (varName) => (
    <input
      type="text"
      name={varName}
      className={
        props.fieldStatus[varName].invalid
          ? 'invalid'
          : props.fieldStatus[varName].changed
            ? 'changed'
            : ''
      }
      value={props.formState.formData[varName] ?? ''}
      onChange={props.handleNumberChange}
    />
  )

  const handleMachine1StartChange = (e) => {
    let machineHash = props.machineHash
    machineHash[0].startHash = e.target.value
    props.setMachineHash([...machineHash])
  }

  const handleMachine1EndChange = (e) => {
    let machineHash = props.machineHash
    machineHash[0].endHash = e.target.value
    props.setMachineHash([...machineHash])
  }

  const handleMachine2StartChange = (e) => {
    let machineHash = props.machineHash
    machineHash[1].startHash = e.target.value
    props.setMachineHash([...machineHash])
  }

  const handleMachine2EndChange = (e) => {
    let machineHash = props.machineHash
    machineHash[1].endHash = e.target.value
    props.setMachineHash([...machineHash])
  }

  return (
    <div>
      <h1>ДАННИ ОТ ИЗБИРАТЕЛНИЯ СПИСЪК</h1>
      <ProtocolDetailsTable>
        <tbody>
          <tr>
            <td>
              1. Брой на избирателите в избирателния списък при предаването му
              на СИК
            </td>
            <td>{inputField('votersCount')}</td>
          </tr>
          <tr>
            <td>
              2. Брой на избирателите, вписани в допълнителната страница (под
              чертата) на избирателния списък в изборния ден
            </td>
            <td>{inputField('additionalVotersCount')}</td>
          </tr>
          <tr>
            <td>
              3. Брой на гласувалите избиратели според положените подписи в
              избирателния списък (вкл. под чертата)
            </td>
            <td>{inputField('votersVotedCount')}</td>
          </tr>
        </tbody>
      </ProtocolDetailsTable>
      <h1>ДАННИ ИЗВЪН ИЗБИРАТЕЛНИЯ СПИСЪК</h1>
      <ProtocolDetailsTable>
        <tbody>
          <tr>
            <td>4а. Брой на неизползваните бюлетини</td>
            <td>{inputField('uncastBallots')}</td>
          </tr>
          <tr>
            <td>
              {props.protocolType === 'paper' ||
                props.protocolType === 'paper-machine'
                ? '4б. Общ брой на недействителните бюлетини'
                : '4б. Брой на унищожените от СИК бюлетини по други поводи'}
            </td>
            <td>{inputField('invalidAndUncastBallots')}</td>
          </tr>
        </tbody>
      </ProtocolDetailsTable>
      <h1>СЛЕД КАТО ОТВОРИ ИЗБИРАТЕЛНАТА КУТИЯ, СИК УСТАНОВИ:</h1>
      <ProtocolDetailsTable>
        <tbody>
          <tr>
            <td>
              5.{' '}
              {props.protocolType === 'machine'
                ? 'Общ брой на потвърдените гласове'
                : props.protocolType === 'paper'
                  ? 'Брой на намерените в избирателната кутия бюлетини'
                  : props.protocolType === 'paper-machine'
                    ? 'Общ брой на намерените в избирателната кутия бюлетини и потвърдените гласове от машинното гласуване'
                    : null}
            </td>
            <td>{inputField('totalVotesCast')}</td>
          </tr>
          {props.protocolType === 'paper-machine' ? (
            <>
              <tr>
                <td>5.1. Брой на намерените в избирателните кутии бюлетини</td>
                <td>{inputField('nonMachineVotesCount')}</td>
              </tr>
              <tr>
                <td>
                  5.2. Брой на потвърдените гласове от машинното гласуване
                </td>
                <td>{inputField('machineVotesCount')}</td>
              </tr>
            </>
          ) : null}
          {props.protocolType === 'paper-machine' ||
            props.protocolType === 'paper' ? (
            <>
              <tr>
                <td>
                  6. Брой на намерените в избирателната кутия недействителни
                  гласове (бюлетини)
                </td>
                <td>{inputField('invalidVotesCount')}</td>
              </tr>
              <tr>
                <td>
                  7.1. Брой на действителните гласове, подадени за кандидатските
                  листи на партии, коалиции и инициативни комитети
                </td>
                <td>{inputField('validVotesCount')}</td>
              </tr>
            </>
          ) : null}
        </tbody>
      </ProtocolDetailsTable>
      <hr />
      <h1>РАЗПРЕДЕЛЕНИЕ НА ГЛАСОВЕТЕ ПО КАНДИДАТСКИ ЛИСТИ</h1>
      <PartyResultsTable colCount={calculateColCount()}>
        <thead>
          <th>#</th>
          <th>Име</th>
          {props.protocolType === 'paper' ||
            props.protocolType === 'paper-machine' ? (
            <th>Х</th>
          ) : null}
          {[...Array(props.machineCount).keys()].map((i) => (
            <th>M{i + 1}</th>
          ))}
        </thead>
        <tbody>
          {props.parties
            .filter((party) => (props.allParties ? true : party.isFeatured))
            .map(partyRow)}
        </tbody>
      </PartyResultsTable>
      {/* {props.machineCount === 1 &&
      props.machineHash.length === props.machineCount ? (
        <>
          <hr />
          <h1>Хеш от машината за гласуване</h1>
          <ProtocolDetailsTable>
            <tbody>
              <tr>
                <td>Първите четири символа от М1:</td>
                <td>
                  <input
                    type="text"
                    value={props.machineHash[0].startHash}
                    onChange={handleMachine1StartChange}
                    maxLength="4"
                  />
                </td>
              </tr>
              <tr>
                <td>Последните четири символа от М1:</td>
                <td>
                  <input
                    type="text"
                    value={props.machineHash[0].endHash}
                    onChange={handleMachine1EndChange}
                    maxLength="4"
                  />
                </td>
              </tr>
            </tbody>
          </ProtocolDetailsTable>
        </>
      ) : props.machineCount === 2 &&
        props.machineHash.length === props.machineCount ? (
        <>
          <hr />
          <h1>Хеш от машините за гласуване</h1>
          <ProtocolDetailsTable>
            <tbody>
              <tr>
                <td>Първите четири символа от М1:</td>
                <td>
                  <input
                    type="text"
                    value={props.machineHash[0].startHash}
                    onChange={handleMachine1StartChange}
                    maxLength="4"
                  />
                </td>
              </tr>
              <tr>
                <td>Последните четири символа от М1:</td>
                <td>
                  <input
                    type="text"
                    value={props.machineHash[0].endHash}
                    onChange={handleMachine1EndChange}
                    maxLength="4"
                  />
                </td>
              </tr>
              <tr>
                <td>Първите четири символа от М2:</td>
                <td>
                  <input
                    type="text"
                    value={props.machineHash[1].startHash}
                    onChange={handleMachine2StartChange}
                    maxLength="4"
                  />
                </td>
              </tr>
              <tr>
                <td>Последните четири символа от М2:</td>
                <td>
                  <input
                    type="text"
                    value={props.machineHash[1].endHash}
                    onChange={handleMachine2EndChange}
                    maxLength="4"
                  />
                </td>
              </tr>
            </tbody>
          </ProtocolDetailsTable>
        </>
      ) : null} */}
    </div>
  )
}
