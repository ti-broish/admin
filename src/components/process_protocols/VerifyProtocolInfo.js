import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ProtocolPhotos from './ProtocolPhotos';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const ProtocolInfoSection = styled.div`
    width: 50vw;
    height: 100vh;
    overflow-y: auto;
    position: absolute;
    top: 0;
    right: 0;
`;

const ProtocolDetails = styled.div`
    padding: 20px;

    h1 {
        margin: 10px 0;
        font-size: 17px;
    }

    h2 {
        font-size: 18px;
    }

    hr {
        margin: 20px 0;
        border: 1px solid #ddd;
        border-top: 0;
    }
`;

const SectionHeader = styled.div`
    //padding: 10px;
    background-color: rgb(56,222,203);
    color: white;
`;

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
        padding: 2px  0 0 6px;
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
`;

const BackButton = styled.button`
    display: inline-block;
    color: white;
    border: none;
    background: none;
    font-size: 36px;
    cursor: pointer;
    padding: 15px;
    border-right: 1px solid white;
    margin-right: 20px;
`;

const VerificationPanelButton = styled.button`
    border: none;
    padding: 5px 10px;
    font-size: 26px;
    cursor: pointer;
    border-radius: 5px;
    box-sizing: border-box;
    display: inline-block;
    font-weight: bold;
    width: calc(50% - 20px);
    margin: 0 10px;
    position: relative;

    &:active {
        top: 5px;
        border-bottom: 0;
        margin-bottom: 10px;
    }

    &:disabled {
        background-color: #aaa;
        cursor: not-allowed;
        color: #888;
        border-bottom-color: #666;

        &:hover {
            background-color: #aaa;
        }
    }
`;

const AcceptButton = styled(VerificationPanelButton)`
    background-color: #44e644;
    border-bottom: 5px solid #2eae1c;
    color: white;

    &:hover {
        background-color: #2ece2e;
    }
`;

const CorrectButton = styled(VerificationPanelButton)`
    background-color: #f9de00;
    border-bottom: 5px solid #a69b00;
    color: white;

    &:hover {
        background-color: #ffe405;
    }
`;

const RejectButton = styled(VerificationPanelButton)`
    background-color: #ff4545;
    border-bottom: 5px solid #ce4c4c;
    color: white;

    &:hover {
        background-color: #ff2626;
    }
`;

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

const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#ccc" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>';

const PartyResultsTable = styled.table`
    table-layout: fixed;
    width: 100%;

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

    td:nth-child(1) { width: 8%; }
    td:nth-child(2) { width: 72%; }
    td:nth-child(3) { width: 20%; }
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

import { AuthContext } from '../App';

export default props => {
    const { parties, authPost, authGet } = useContext(AuthContext);
    const [allParties, setAllParties] = useState(Math.random() < 0.5);
    const [divisionNames, setDivisionNames] = useState({
        country: null,
        electionRegion: null,
        municipality: null,
        town: null,
        cityRegion: null,
        address: null,
    });

    const zeroIfEmpty = value => value? value : '';//0;

    const [formData, setFormData] = useState({
        sectionId: props.protocol.section.id,
        votersCount: zeroIfEmpty(props.protocol.results.votersCount),
        validVotesCount: zeroIfEmpty(props.protocol.results.validVotesCount),
        invalidVotesCount: zeroIfEmpty(props.protocol.results.invalidVotesCount),
    });

    useEffect(() => {
        if(formData.sectionId.length === 9) {
            updateDivisionNames();
        }
    }, [formData.sectionId])

    const updateDivisionNames = async () => {
        setDivisionNames({
            country: null,
            electionRegion: null,
            municipality: null,
            town: null,
            cityRegion: null,
            address: null,
        });

        const res = await authGet(`/sections/${formData.sectionId}`);

        console.log(res.data);

        setDivisionNames({
            country: res.data.town.country.name,
            electionRegion: res.data.electionRegion.name,
            municipality: res.data.town.municipality.name,
            town: res.data.town.name,
            cityRegion: res.data.cityRegion.name,
            address: res.data.place,
        });
    };

    const initResults = () => {
        const resultsObj = { '0': '' };

        for(const party of parties) {
            if((allParties? true : party.isFeatured) || party.id.toString() === '0')
                resultsObj[party.id] = '';
        }

        for(const result of props.protocol.results.results) {
            if(result.validVotesCount)
                resultsObj[result.party.id] = result.validVotesCount;
        }

        return resultsObj;
    };

    const [resultsData, setResultsData] = useState(initResults());

    const fieldStatus = {};

    for(let i = 0; i < 9; i ++) {
        const char1 = props.protocol.section.id[i];
        const char2 = formData.sectionId[i];
    
        if(typeof char1 == 'undefined' || typeof char2 == 'undefined')
            fieldStatus[`sectionId${i+1}`] = { invalid: true };   
        else if(char1.toString() !== char2.toString())
            fieldStatus[`sectionId${i+1}`] = { changed: true };
        else 
            fieldStatus[`sectionId${i+1}`] = { unchanged: true };
    }

    for(const party of parties) {
        if((allParties? true : party.isFeatured) || party.id.toString() === '0') {
            let originalResult = 0;
            for(const result of props.protocol.results.results) {
                if(result.party.id === party.id) {
                    originalResult = result.validVotesCount;
                }
            }

            if(resultsData[party.id] === '')
                fieldStatus[`party${party.id}`] = { invalid: true };
            else if(originalResult.toString() !== resultsData[party.id].toString())
                fieldStatus[`party${party.id}`] = { changed: true };
            else 
                fieldStatus[`party${party.id}`] = { unchanged: true };
        }
    }

    const addStatusForResultField = fieldName => {
        if(formData[fieldName] === '')
            fieldStatus[fieldName] = { invalid: true };
        else if(formData[fieldName] !== zeroIfEmpty(props.protocol.results[fieldName]))
            fieldStatus[fieldName] = { changed: true };
        else 
            fieldStatus[fieldName] = { unchanged: true };
    };

    addStatusForResultField('votersCount');
    addStatusForResultField('validVotesCount');
    addStatusForResultField('invalidVotesCount');

    const partyRow = party => {
        const status = fieldStatus[`party${party.id}`];
        return(
            <tr>
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
                        data-party-id={party.id}
                        value={resultsData[party.id]}
                        onChange={handleResultsChange}
                    />
                </td>
            </tr>
        );
    };

    const handleProtocolNumberChange = e => {
        setFormData({...formData, sectionId: e.target.value});
    };

    const handleResultsChange = e => {
        const newValue = filterNumberFieldInput(e.target.value, resultsData[e.target.dataset.partyId]);
        setResultsData({...resultsData, [e.target.dataset.partyId]: newValue});
    };

    const handleNumberChange = e => {
        const newValue = filterNumberFieldInput(e.target.value, formData[e.target.name]);
        setFormData({...formData, [e.target.name]: newValue});
    };

    const filterNumberFieldInput = (newValue, oldValue) => {
        const parsed = parseInt(newValue, 10);
        if(parsed) {
            return parsed;
        } else if(newValue === '') {
            return '';
        } else {
            return oldValue;
        }
    };

    const getBoxClass = boxNum => {
        const status = fieldStatus[`sectionId${boxNum}`];
        return status.invalid? 'box invalid' : status.changed? 'box changed' : 'box';
    };

    let invalidFields = false;
    let changedFields = false;

    for(const key of Object.keys(fieldStatus)) {
        if(fieldStatus[key].invalid)
            invalidFields = true;
        if(fieldStatus[key].changed)
            changedFields = true;
    }

    const approveProtocol = async () => {
        props.setLoading(true);
        await authPost(`/protocols/${props.protocol.id}/approve`);
        props.setLoading(false);
        props.processingDone(`Протокол ${props.protocol.id} ОДОБРЕН`);
    };

    const rejectProtocol = async () => {
        props.setLoading(true);
        await authPost(`/protocols/${props.protocol.id}/reject`);
        props.setLoading(false);
        props.processingDone(`Протокол ${props.protocol.id} ОТХВЪРЛЕН`);
    };

    const replaceProtocol = async () => {
        const postBody = { 
            section: { id: formData.sectionId },
            results: { 
                invalidVotesCount: parseInt(formData.invalidVotesCount, 10),
                validVotesCount: parseInt(formData.validVotesCount, 10),
                votersCount: parseInt(formData.votersCount, 10),
                results: Object.keys(resultsData).map(key => {
                    return { party: parseInt(key, 10), validVotesCount: parseInt(resultsData[key], 10) };
                })
            }
        };

        console.log(postBody);

        props.setLoading(true);
        try {
            const res = await authPost(`/protocols/${props.protocol.id}/replace`, postBody);
        } catch(err) {
            props.setLoading(false);
            return;
        }
        props.setLoading(false);
        props.processingDone(`Протокол ${props.protocol.id} ОДОБРЕН с КОРЕКЦИЯ`);
    };

    return(
        <div>
            <FontAwesomeIcon icon={faChevronDown}/>
            <ProtocolPhotos protocol={props.protocol}/>
            <ProtocolInfoSection>
                <SectionHeader>
                    <BackButton onClick={props.returnProtocol}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </BackButton>
                    <h1 style={{display: 'inline-block'}}>Секция {props.protocol.section.id}</h1>
                </SectionHeader>
                <ProtocolDetails>
                    <table>
                    <tbody>
                        <tr>
                            <td>Номер на секция</td>
                            <td style={{paddingBottom: '20px'}}>
                                <SectionInput>
                                    <div>
                                        <div className={getBoxClass(1)}>
                                            <input 
                                                type="text"
                                                style={{width: '333px'}} 
                                                value={formData.sectionId} 
                                                maxLength={9}
                                                name="sectionId"
                                                onChange={handleProtocolNumberChange}
                                            />
                                        </div>
                                        <div className={getBoxClass(2)}/>
                                        <div className={getBoxClass(3)}/>
                                        <div className={getBoxClass(4)}/>
                                        <div className={getBoxClass(5)}/>
                                        <div className={getBoxClass(6)}/>
                                        <div className={getBoxClass(7)}/>
                                        <div className={getBoxClass(8)}/>
                                        <div className={getBoxClass(9) + ' last'}/>
                                        <br/>
                                        <span style={{width: '72px'}}>Район</span>
                                        <span style={{width: '72px'}}>Община</span>
                                        <span style={{width: '72px'}}>Адм. ед.</span>
                                        <span className='last' style={{width: '108px'}}>Секция</span>
                                    </div>
                                </SectionInput>
                            </td>
                        </tr>
                        <tr>
                            <td>Държава</td>
                            <td>{divisionNames.country}</td>
                        </tr>
                        <tr>
                            <td>МИР</td>
                            <td>{divisionNames.electionRegion}</td>
                        </tr>
                        <tr>
                            <td>Община</td>
                            <td>{divisionNames.municipality}</td>
                        </tr>
                        <tr>
                            <td>Град</td>
                            <td>{divisionNames.town}</td>
                        </tr>
                        <tr>
                            <td>Район</td>
                            <td>{divisionNames.cityRegion}</td>
                        </tr>
                        <tr>
                            <td>Локация</td>
                            <td>{divisionNames.address}</td>
                        </tr>
                        <tr>
                            <td style={{paddingTop: '20px'}}>Изпратен от (организация)</td>
                            <td style={{paddingTop: '20px'}}>{props.protocol.author.organization.name}</td>
                        </tr>
                    </tbody>
                    </table>
                    <hr/>
                    <h1>ДАННИ ОТ ИЗБИРАТЕЛНИЯ СПИСЪК</h1>
                    <ProtocolDetailsTable>
                    <tbody>
                        <tr>
                            <td>2. Брой на гласувалите избиратели според положените подписи в избирателния списък (вкл. под чертата)</td>
                            <td>
                                <input
                                    type="text"
                                    name="votersCount"
                                    className={fieldStatus['votersCount'].invalid? 'invalid' : fieldStatus['votersCount'].changed? 'changed' : ''}
                                    value={formData.votersCount}
                                    onChange={handleNumberChange}
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
                                    value={formData.invalidVotesCount}
                                    name="invalidVotesCount"
                                    className={fieldStatus['invalidVotesCount'].invalid? 'invalid' : fieldStatus['invalidVotesCount'].changed? 'changed' : ''}
                                    onChange={handleNumberChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>6.1. Брой на действителните гласове, подадени за кандидатските листи на партии, коалиции и ИК</td>
                            <td>
                                <input
                                    type="text"
                                    value={formData.validVotesCount}
                                    name="validVotesCount"
                                    className={fieldStatus['validVotesCount'].invalid? 'invalid' : fieldStatus['validVotesCount'].changed? 'changed' : ''}  
                                    onChange={handleNumberChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>6.2. Брой на действителните гласове "Не подкрепям никого"</td>
                            <td>
                                <input type="text"
                                    className={fieldStatus[`party0`].invalid? 'invalid' : fieldStatus[`party0`].changed? 'changed' : ''}
                                    data-party-id={'0'}
                                    value={resultsData['0']}
                                    onChange={handleResultsChange}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </ProtocolDetailsTable>
                    <hr/>
                    <h1>7. РАЗПРЕДЕЛЕНИЕ НА ГЛАСОВЕТЕ ПО КАНДИДАТСКИ ЛИСТИ</h1>
                    <PartyResultsTable>
                        <tbody>
                        {parties.map(party => 
                            !((allParties? true : party.isFeatured) && party.id.toString() !== '0')
                            ? null 
                            : partyRow(party))}
                        </tbody>
                    </PartyResultsTable>
                    <hr/>
                    {
                        invalidFields || changedFields?
                            <CorrectButton onClick={replaceProtocol} disabled={invalidFields}>
                                Коригирай
                            </CorrectButton> :
                            <AcceptButton onClick={approveProtocol}>
                                Потвърди
                            </AcceptButton>
                    }
                    <RejectButton onClick={rejectProtocol}>
                        Отхвърли
                    </RejectButton>
                </ProtocolDetails>
            </ProtocolInfoSection>
        </div>
    );
};