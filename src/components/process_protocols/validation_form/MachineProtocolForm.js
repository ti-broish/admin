import React from 'react';

import styled from 'styled-components';

const ProtocolDetailsTable = styled.table`
    table-layout: fixed;

    button { 
        width: 100%; 
        box-sizing: border-box;
    }

    input { 
        width: 100%; 
        box-sizing: border-box;
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

    td:nth-child(1) { width: 80%; }
    td:nth-child(2) { width: 20%; }
`;

const PartyResultsTable = styled.table`
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  
    tr:nth-child(odd) td {
        background: #ECECEC;
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
        background: url("data:image/svg+xml;base64,${window.btoa(svgIcon)}") no-repeat;
        background-position: right 5px top 50%;
        cursor: pointer;
    }

    ${props => props.isMachine? `
        td:nth-child(1) { width: 8%; }
        td:nth-child(2) { width: 42%; }
        td:nth-child(3) { width: 30%; }
        td:nth-child(4) { width: 20%; }
    ` : `
        td:nth-child(1) { width: 8%; }
        td:nth-child(2) { width: 72%; }
        td:nth-child(3) { width: 20%; }
    `}
`;

const PartyNumber = styled.span`
    color: ${props => props.textColor? props.textColor : 'white'};
    font-weight: bold;
    background-color: #${props => props.color};
    width: 21px;
    display: block;
    padding: 3px 5px;
    text-align: right;
    border-radius: 3px;
`;

const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#ccc" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>';

export default props => {

    const partyRow = (party, i) => {
        const status = props.fieldStatus[`party${party.id}`];
        const statusM = props.fieldStatus[`party${party.id}m`];
        const statusNM = props.fieldStatus[`party${party.id}nm`];

        return(
            !props.sectionData.isMachine
            ?
                <tr key={i}>
                    <td>{party.id.toString() === '0'? null :
                        party.color?
                            <PartyNumber color={party.color}>{party.id}</PartyNumber> :
                            <PartyNumber color={'white'} textColor={'555'}>{party.id}</PartyNumber>
                    }
                    </td>
                    <td>{party.displayName}</td>
                    <td>
                        <input type="text"
                            className={status.invalid? 'invalid' : status.changed? 'changed' : ''}
                            name={party.id}
                            value={props.formState.resultsData[party.id]}
                            onChange={props.handleResultsChange}
                        />
                    </td>
                </tr>
            : <>
                <tr key={i*3}>
                    <td>{party.id.toString() === '0'? null :
                        party.color?
                            <PartyNumber color={party.color}>{party.id}</PartyNumber> :
                            <PartyNumber color={'white'} textColor={'555'}>{party.id}</PartyNumber>
                    }
                    </td>
                    <td rowSpan="3" style={{
                        verticalAlign: 'top',
                        paddingTop: '5px',
                        borderBottom: '1px solid rgb(204, 204, 204)',
                    }}>
                        {party.displayName}
                    </td>
                    <td>от бюлетини</td>
                    <td>
                        <input type="text"
                            className={statusNM.invalid? 'invalid' : statusNM.changed? 'changed' : ''}
                            name={`${party.id}nm`}
                            value={props.formState.resultsData[`${party.id}nm`]}
                            onChange={props.handleResultsChange}
                        />
                    </td>
                </tr>
                <tr key={i*3+1}>
                    <td></td>
                    <td>от маш. гласове</td>
                    <td>
                        <input type="text"
                            className={statusM.invalid? 'invalid' : statusM.changed? 'changed' : ''}
                            name={`${party.id}m`}
                            value={props.formState.resultsData[`${party.id}m`]}
                            onChange={props.handleResultsChange}
                        />
                    </td>
                </tr>
                <tr key={i*3+2}>
                    <td></td>
                    <td style={{borderBottom: '1px solid #ccc'}}>общо Б + МГ</td>
                    <td>
                        <input type="text"
                            className={status.invalid? 'invalid' : status.changed? 'changed' : ''}
                            name={party.id}
                            value={props.formState.resultsData[party.id]}
                            onChange={props.handleResultsChange}
                        />
                    </td>
                </tr>
            </>
        );
    };

    return(
        <div>
            <h1>ДАННИ ОТ ИЗБИРАТЕЛНИЯ СПИСЪК</h1>
            <ProtocolDetailsTable>
            <tbody>
                <tr>
                    <td>2. Брой на гласувалите избиратели според положените подписи в избирателния списък (вкл. под чертата)</td>
                    <td>
                        <input
                            type="text"
                            name="votersCount"
                            className={props.fieldStatus['votersCount'].invalid? 'invalid' : props.fieldStatus['votersCount'].changed? 'changed' : ''}
                            value={props.formState.formData.votersCount}
                            onChange={props.handleNumberChange}
                        />
                    </td>
                </tr>
            </tbody>
            </ProtocolDetailsTable>
            <h1>СЛЕД КАТО ОТВОРИ ИЗБИРАТЕЛНАТА КУТИЯ, СИК УСТАНОВИ</h1>
            <ProtocolDetailsTable>
                <tbody>
                <tr>
                    <td>5. Брой намерени в избирателната кутия недействителни гласове (бюлетини)</td>
                    <td>
                        <input
                            type="text"
                            value={props.formState.formData.invalidVotesCount}
                            name="invalidVotesCount"
                            className={props.fieldStatus['invalidVotesCount'].invalid? 'invalid' : props.fieldStatus['invalidVotesCount'].changed? 'changed' : ''}
                            onChange={props.handleNumberChange}
                        />
                    </td>
                </tr>
                <tr>
                    <td>6.1. Брой на действителните гласове, подадени за кандидатските листи на партии, коалиции и ИК</td>
                    <td>
                        <input
                            type="text"
                            value={props.formState.formData.validVotesCount}
                            name="validVotesCount"
                            className={props.fieldStatus['validVotesCount'].invalid? 'invalid' : props.fieldStatus['validVotesCount'].changed? 'changed' : ''}
                            onChange={props.handleNumberChange}
                        />
                    </td>
                </tr>
                {
                    !props.sectionData.isMachine? null : <>
                        <tr>
                            <td>6.2а. Брой на намерените в избирателна кутия дейстивтелни гласове "Не подрекпям никого"</td>
                            <td>
                                <input type="text"
                                    className={props.fieldStatus[`party0nm`].invalid? 'invalid' : props.fieldStatus[`party0nm`].changed? 'changed' : ''}
                                    data-party-id={'0nm'}
                                    value={props.formState.resultsData['0nm']}
                                    onChange={props.handleResultsChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>6.2б. Брой гласували за "Не подкрепям никого" от машинното гласуване</td>
                            <td>
                                <input type="text"
                                    className={props.fieldStatus[`party0m`].invalid? 'invalid' : props.fieldStatus[`party0m`].changed? 'changed' : ''}
                                    data-party-id={'0m'}
                                    value={props.formState.resultsData['0m']}
                                    onChange={props.handleResultsChange}
                                />
                            </td>
                        </tr>
                    </>
                }
                <tr>
                    <td>6.2. Брой на действителните гласове "Не подкрепям никого"</td>
                    <td>
                        <input type="text"
                            className={props.fieldStatus[`party0`].invalid? 'invalid' : props.fieldStatus[`party0`].changed? 'changed' : ''}
                            data-party-id={'0'}
                            value={props.formState.resultsData['0']}
                            onChange={props.handleResultsChange}
                        />
                    </td>
                </tr>
                </tbody>
            </ProtocolDetailsTable>
            <hr/>
            <h1>7. РАЗПРЕДЕЛЕНИЕ НА ГЛАСОВЕТЕ ПО КАНДИДАТСКИ ЛИСТИ</h1>
            <PartyResultsTable isMachine={props.sectionData.isMachine}>
                <tbody>
                {props.parties.filter(party => (props.allParties? true : party.isFeatured) && party.id.toString() !== '0')
                    .map(partyRow)}
                </tbody>
            </PartyResultsTable>
        </div>
    );
};