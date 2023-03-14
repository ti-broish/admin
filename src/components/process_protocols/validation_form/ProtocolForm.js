//@ts-check
import React from 'react'

import styled from 'styled-components'
import { ProtocolType } from '../../../common/enums/protocol-type'
import { tryUpdateValue } from './validation-form-utils'

// #region Styled components

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
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  select {
    width: 100%;
    box-sizing: border-box;
  }

  td:nth-child(1) {
    width: 85%;
  }
  td:nth-child(2) {
    width: 15%;
  }

  ${(props) =>
    props.colCount === 2 || props.colCount === 3
      ? `
        td:nth-child(1), th:nth-child(1) { width: 70%; }
        td:nth-child(2), th:nth-child(2) { width: 10%; }
        td:nth-child(3), th:nth-child(3) { width: 10%; }
        td:nth-child(4), th:nth-child(4) { width: 10%; }
     
    `
      : ``}
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
        td:nth-child(1), th:nth-child(1) { width: 6%; }
        td:nth-child(2), th:nth-child(2) { width: 80%; }
        td:nth-child(3), th:nth-child(3) { width: 14%; }
    `
      : props.colCount === 2 || props.colCount === 3
      ? `
        td:nth-child(1), th:nth-child(1) { width: 6%; }
        td:nth-child(2), th:nth-child(2) { width: 64%; }
        td:nth-child(3), th:nth-child(3) { width: 10%; }
        td:nth-child(4), th:nth-child(4) { width: 10%; }
        td:nth-child(5), th:nth-child(5) { width: 10%; }
    `
      : ``}
`

const PartyNumberSpan = styled.span`
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

// #endregion

/** @type {FnComponent<ProtocolFormProps>} */
export default function ProtocolForm(props) {
  const { protocolType } = props
  const partyRow = (party) => {
    return (
      <tr key={party.id}>
        <td>
          {party.id === 0 ? null : party.color ? (
            <PartyNumberSpan color={party.color}>{party.id}</PartyNumberSpan>
          ) : (
            <PartyNumberSpan color={'white'} textColor={'555'}>
              {party.id}
            </PartyNumberSpan>
          )}
        </td>
        <td>{party.displayName}</td>
        {partyRowInputs(props, party)}
      </tr>
    )
  }

  const partyRowInputs = (props, party) => {
    return (
      <>
        {/* PAPER */}
        <td>
          <input
            type="text"
            className={
              props.protocolState.partyInputs.paper[party.id].isValid === false
                ? 'invalid'
                : props.protocolState.partyInputs.paper[party.id].isTouched
                ? 'changed'
                : ''
            }
            name={`party${party.id}paper`}
            value={props.protocolState.partyInputs.paper[party.id].value}
            onChange={(e) =>
              props.validateProtocolForm({
                ...props.protocolState,
                partyInputs: {
                  ...props.protocolState.partyInputs,
                  paper: {
                    ...props.protocolState.partyInputs.paper,
                    [party.id]: {
                      value: tryUpdateValue(
                        e.target.value,
                        props.protocolState.partyInputs.paper[party.id].value
                      ),
                      isValid: true, // reset to true, it will be updated upon validation
                      isTouched: true,
                    },
                  },
                },
              })
            }
          />
        </td>

        {protocolType === ProtocolType.PAPER_MACHINE && (
          <>
            {/* MACHINE */}
            <td>
              <input
                type="text"
                className={
                  props.protocolState.partyInputs?.machine[party.id].isValid ===
                  false
                    ? 'invalid'
                    : props.protocolState.partyInputs?.machine[party.id]
                        .isTouched
                    ? 'changed'
                    : ''
                }
                name={`party${party.id}machine`}
                value={props.protocolState.partyInputs?.machine[party.id].value}
                onChange={(e) =>
                  props.validateProtocolForm({
                    ...props.protocolState,
                    partyInputs: {
                      ...props.protocolState.partyInputs,
                      machine: {
                        ...props.protocolState.partyInputs.machine,
                        [party.id]: {
                          value: tryUpdateValue(
                            e.target.value,
                            props.protocolState.partyInputs.machine[party.id]
                              .value
                          ),
                          isValid: true, // reset to true, it will be updated upon validation
                          isTouched: true,
                        },
                      },
                    },
                  })
                }
              />
            </td>
            {/* TOTAL */}
            <td>
              <input
                type="text"
                className={
                  props.protocolState.partyInputs?.total[party.id].isValid ===
                  false
                    ? 'invalid'
                    : props.protocolState.partyInputs?.total[party.id].isTouched
                    ? 'changed'
                    : ''
                }
                name={`party${party.id}total`}
                value={props.protocolState.partyInputs?.total[party.id].value}
                onChange={(e) =>
                  props.validateProtocolForm({
                    ...props.protocolState,
                    partyInputs: {
                      ...props.protocolState.partyInputs,
                      total: {
                        ...props.protocolState.partyInputs.total,
                        [party.id]: {
                          value: tryUpdateValue(
                            e.target.value,
                            props.protocolState.partyInputs.total[party.id]
                              .value
                          ),
                          isValid: true, // reset to true, it will be updated upon validation
                          isTouched: true,
                        },
                      },
                    },
                  })
                }
              />
            </td>
          </>
        )}
      </>
    )
  }

  /**
   * @param {keyof ProtocolStateInputs} varName
   * @param {boolean} hidden
   */
  const inputField = (varName, hidden = false) => (
    <input
      type="number"
      name={varName}
      hidden={hidden}
      className={
        props.protocolState.inputs[varName].isValid === false
          ? 'invalid'
          : props.protocolState.inputs[varName].isTouched
          ? 'changed'
          : ''
      }
      value={props.protocolState.inputs[varName].value}
      onChange={(e) =>
        props.validateProtocolForm({
          ...props.protocolState,
          inputs: {
            ...props.protocolState.inputs,
            [varName]: {
              value: tryUpdateValue(
                e.target.value,
                props.protocolState.inputs[varName].value
              ),
              isValid: true, // reset to true, it will be updated upon validation
              isTouched: true,
            },
          },
        })
      }
    />
  )

  const CustomTableHeader = () => {
    return (
      <>
        <th>{protocolType === ProtocolType.PAPER_MACHINE && 'Х'}</th>

        {protocolType === ProtocolType.PAPER_MACHINE && (
          <>
            <th>M</th>
            <th>О</th>
          </>
        )}
      </>
    )
  }

  return (
    <div>
      {/* <h1>ДАННИ ОТ ИЗБИРАТЕЛНИЯ СПИСЪК</h1> */}
      <ProtocolDetailsTable>
        <tbody>
          <tr>
            <td>А. Брой на получените бюлетини</td>
            <td>{inputField('totalBallotsCount')}</td>
          </tr>
        </tbody>
      </ProtocolDetailsTable>
      <hr />
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
      <hr />
      <h1>ДАННИ ИЗВЪН ИЗБИРАТЕЛНАТА КУТИЯ</h1>
      <ProtocolDetailsTable>
        <tbody>
          <tr>
            <td>4а. Брой на неизползваните бюлетини</td>
            <td>{inputField('uncastBallots')}</td>
          </tr>
          <tr>
            <td>4б. Общ брой на недействителните бюлетини</td>
            <td>{inputField('invalidAndUncastBallots')}</td>
          </tr>
        </tbody>
      </ProtocolDetailsTable>
      <hr />
      <h1>СЛЕД КАТО ОТВОРИ ИЗБИРАТЕЛНАТА КУТИЯ, СИК УСТАНОВИ:</h1>
      <ProtocolDetailsTable
        colCount={protocolType === ProtocolType.PAPER ? 1 : 3}
      >
        <>
          <thead>
            <tr>
              <th></th>
              <CustomTableHeader />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>5. Брой на намерените в избирателните кутии бюлетини</td>
              <td>{inputField('nonMachineCastBallotsCount')}</td>
              {props.protocolType === ProtocolType.PAPER_MACHINE && (
                <>
                  <td>{inputField('machineCastBallotsCount')}</td>
                  <td>{inputField('castBallotsCount')}</td>
                </>
              )}
            </tr>

            <>
              <tr>
                <td>
                  6. Брой на намерените в избирателната кутия недействителни
                  гласове (бюлетини)
                </td>
                {props.protocolType === ProtocolType.PAPER_MACHINE && (
                  <>
                    <td>{inputField('invalidVotesCount', true)}</td>
                    <td>{inputField('invalidVotesCount', true)}</td>
                  </>
                )}
                <td>{inputField('invalidVotesCount')}</td>
              </tr>

              <tr>
                <td>7. Общ брой на всички действителни гласове (бюлетини)</td>
                <td>{inputField('nonMachineVotesCount')}</td>
                {props.protocolType === ProtocolType.PAPER_MACHINE && (
                  <>
                    <td>{inputField('machineVotesCount')}</td>
                    <td>{inputField('validVotesCount')}</td>
                  </>
                )}
              </tr>
              <tr>
                <td>
                  7.1. Брой на действителните гласове, подадени за кандидатските
                  листи на партии, коалиции и инициативни комитети
                </td>
                <td>{inputField('partyNonMachineVotesCount')}</td>
                {props.protocolType === ProtocolType.PAPER_MACHINE && (
                  <>
                    <td>{inputField('partyMachineVotesCount')}</td>
                    <td>{inputField('partyValidVotesCount')}</td>
                  </>
                )}
              </tr>

              <tr>
                <td>
                  7.2. Брой на действителните гласове с отбелязан вот „Не
                  подкрепям никого“
                </td>
                {partyRowInputs(props, props.parties[0])}
              </tr>
            </>
          </tbody>
        </>
      </ProtocolDetailsTable>
      <hr />
      <h1>РАЗПРЕДЕЛЕНИЕ НА ГЛАСОВЕТЕ ПО КАНДИДАТСКИ ЛИСТИ</h1>
      <PartyResultsTable colCount={protocolType === ProtocolType.PAPER ? 1 : 3}>
        <thead>
          <tr>
            <th>#</th>
            <th>Име</th>
            <CustomTableHeader />
          </tr>
        </thead>
        <tbody>
          {props.parties.filter((party) => party.id !== 0).map(partyRow)}
        </tbody>
      </PartyResultsTable>
    </div>
  )
}
