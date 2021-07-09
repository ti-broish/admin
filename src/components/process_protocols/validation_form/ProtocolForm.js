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

    ${props => props.colCount === 1? `
        td:nth-child(1), th:nth-child(1) { width: 8%; }
        td:nth-child(2), th:nth-child(2) { width: 72%; }
        td:nth-child(3), th:nth-child(3) { width: 20%; }
    ` : props.colCount === 2? `
        td:nth-child(1), th:nth-child(1) { width: 8%; }
        td:nth-child(2), th:nth-child(2) { width: 72%; }
        td:nth-child(3), th:nth-child(3) { width: 10%; }
        td:nth-child(4), th:nth-child(4) { width: 10%; }
    ` : props.colCount === 3? `
        td:nth-child(1), th:nth-child(1) { width: 8%; }
        td:nth-child(2), th:nth-child(2) { width: 71%; }
        td:nth-child(3), th:nth-child(3) { width: 7%; }
        td:nth-child(4), th:nth-child(4) { width: 7%; }
        td:nth-child(5), th:nth-child(5) { width: 7%; }
    ` : ``}
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
        return(
            <tr key={i}>
                <td>{party.id.toString() === '0'? null :
                    party.color?
                        <PartyNumber color={party.color}>{party.id}</PartyNumber> :
                        <PartyNumber color={'white'} textColor={'555'}>{party.id}</PartyNumber>
                }
                </td>
                <td>{party.displayName}</td>
                {
                    props.protocolType === 'paper' || props.protocolType === 'paper-machine'?
                        <td>
                            <input type="text"
                                className={props.fieldStatus[`party${party.id}paper`].invalid? 'invalid' : props.fieldStatus[`party${party.id}paper`].changed? 'changed' : ''}
                                name={`party${party.id}paper`}
                                value={props.formState.resultsData[`party${party.id}paper`]}
                                onChange={props.handleResultsChange}
                            />
                        </td>: null

                }
                {
                    [...Array(props.machineCount).keys()].map(i => 
                        <td>
                            <input type="text"
                                className={props.fieldStatus[`party${party.id}machine${i+1}`].invalid? 'invalid' : props.fieldStatus[`party${party.id}machine${i+1}`].changed? 'changed' : ''}
                                name={`party${party.id}machine${i+1}`}
                                value={props.formState.resultsData[`party${party.id}machine${i+1}`]}
                                onChange={props.handleResultsChange}
                            />
                        </td>
                    )
                }
                
            </tr>
        );
    };

    const calculateColCount = () => {
        let count = 0;

        if(props.protocolType === 'paper' || props.protocolType === 'paper-machine') {
            count += 1;
        }

        count += props.machineCount;

        console.log(count);

        return count;
    };

    return(
        <div>
            <h1>ДАННИ ОТ ИЗБИРАТЕЛНИЯ СПИСЪК</h1>
            <ProtocolDetailsTable>
            <tbody>
                <tr>
                    <td>
                        1. Брой на избирателите в избирателния списък при предаването му на СИК
                    </td>
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
                <tr>
                    <td>
                        2. Брой на избирателите, вписани в допълнителната страница (под чертата) на
                        избирателния списък в изборния ден
                    </td>
                    <td>
                        <input
                            type="text"
                            name="additionalVotersCount"
                            className={props.fieldStatus['additionalVotersCount'].invalid? 'invalid' : props.fieldStatus['additionalVotersCount'].changed? 'changed' : ''}
                            value={props.formState.formData.additionalVotersCount}
                            onChange={props.handleNumberChange}
                        />
                    </td>
                </tr>
                {/*
                <tr>
                    <td>
                        3. Брой на гласувалите избиратели според положените подписи в
                        избирателния списък (вкл. под чертата)
                    </td>
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
                */}
            </tbody>
            </ProtocolDetailsTable>
            {
                props.protocolType === 'paper' || props.protocolType === 'paper-machine'?
                    <>
                        <h1>ДАННИ ИЗВЪН ИЗБИРАТЕЛНИЯ СПИСЪК</h1>
                        <ProtocolDetailsTable>
                        <tbody>
                            <tr>
                                <td>4. Бюлетини извън избирателната кутия (4а + 4б)</td>
                                <td>
                                    <input
                                        type="text"
                                        name="paperBallotsOutsideOfBox"
                                        className={props.fieldStatus['paperBallotsOutsideOfBox'].invalid? 'invalid' : props.fieldStatus['paperBallotsOutsideOfBox'].changed? 'changed' : ''}
                                        value={props.formState.formData.paperBallotsOutsideOfBox}
                                        onChange={props.handleNumberChange}
                                    />
                                </td>
                            </tr>
                        </tbody>
                        </ProtocolDetailsTable>
                    </> : null
            }
            <h1>СЛЕД КАТО ОТВОРИ ИЗБИРАТЕЛНАТА КУТИЯ, СИК УСТАНОВИ:</h1>
            <ProtocolDetailsTable>
                <tbody>
                <tr>
                    <td>5. {
                        props.protocolType === 'machine'?
                            'Общ брой на потвърдените гласове' :
                        props.protocolType === 'paper'?
                            'Брой на намерените в избирателната кутия бюлетини' :
                        props.protocolType === 'paper-machine'?
                            'Общ брой на намерените в избирателната кутия бюлетини и потвърдените гласове от машинното гласуване' : null  
                        
                    }</td>
                    <td>
                        <input
                            type="text"
                            value={props.formState.formData.votesCount}
                            name="votesCount"
                            className={props.fieldStatus['votesCount'].invalid? 'invalid' : props.fieldStatus['votesCount'].changed? 'changed' : ''}
                            onChange={props.handleNumberChange}
                        />
                    </td>
                </tr>
                {
                    props.protocolType === 'paper-machine'?
                        <>
                            <tr>
                                <td>5.1. Брой на намерените в избирателните кутии бюлетини</td>
                                <td>
                                    <input
                                        type="text"
                                        value={props.formState.formData.paperVotesCount}
                                        name="paperVotesCount"
                                        className={props.fieldStatus['paperVotesCount'].invalid? 'invalid' : props.fieldStatus['paperVotesCount'].changed? 'changed' : ''}
                                        onChange={props.handleNumberChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>5.2. Брой на потвърдените гласове от машинното гласуване</td>
                                <td>
                                    <input
                                        type="text"
                                        value={props.formState.formData.machineVotesCount}
                                        name="machineVotesCount"
                                        className={props.fieldStatus['machineVotesCount'].invalid? 'invalid' : props.fieldStatus['machineVotesCount'].changed? 'changed' : ''}
                                        onChange={props.handleNumberChange}
                                    />
                                </td>
                            </tr>
                        </> : null
                }
                {
                    props.protocolType === 'paper-machine' || props.protocolType === 'paper'?
                        <>
                            <tr>
                                <td>6. Брой на намерените в избирателната кутия недействителни гласове (бюлетини)</td>
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
                                <td>7. Общ брой на намерените в избирателната кутия действителни гласове (бюлетини)</td>
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
                        </> : null
                }
                </tbody>
            </ProtocolDetailsTable>
            <hr/>
            <h1>7. РАЗПРЕДЕЛЕНИЕ НА ГЛАСОВЕТЕ ПО КАНДИДАТСКИ ЛИСТИ</h1>
            <PartyResultsTable colCount={calculateColCount()}>
                <thead>
                    <th>#</th>
                    <th>Име</th>
                    {
                        props.protocolType === 'paper' || props.protocolType === 'paper-machine'?
                            <th>Х</th> : null
                    }
                    {[...Array(props.machineCount).keys()].map(i => <th>M{i+1}</th>)}
                </thead>
                <tbody>
                {props.parties.filter(party => (props.allParties? true : party.isFeatured))
                    .map(partyRow)}
                </tbody>
            </PartyResultsTable>
        </div>
    );
};