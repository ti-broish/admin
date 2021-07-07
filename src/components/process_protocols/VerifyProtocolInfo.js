import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ProtocolPhotos from './protocol_photos/ProtocolPhotos';
import MachineProtocolForm from './validation_form/MachineProtocolForm';

import useKeypress from 'react-use-keypress';

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

const ApproveAndSendViolationButton = styled(VerificationPanelButton)`
    background-color: #f19c48;
    border-bottom: 5px solid #eeaa67;
    color: white;

    &:hover {
        background-color: #ef8a25;
    }
`;

import { AuthContext } from '../App';
import ConfirmationModal from './ConfirmationModal';

export default props => {
    const { parties, authPost, authGet } = useContext(AuthContext);
    const [allParties, setAllParties] = useState(true);//Math.random() < 0.5);
    const [modalState, setModalState] = useState({isOpen: false});
    const [sectionData, setSectionData] = useState({
        country: null,
        electionRegion: null,
        municipality: null,
        town: null,
        townId: null,
        cityRegion: null,
        address: null,
        isMachine: false,
    });

    const ref = useRef();

    useKeypress(['ArrowUp'], event => {
        let lastInput = null;

        const traverseNodeTree = node => {
            if(node === document.activeElement && lastInput != null)
                lastInput.focus();
            else {
                if(node.tagName === 'INPUT') lastInput = node;
                [...node.children].forEach(traverseNodeTree);
            }
        };

        traverseNodeTree(ref.current);
    });

    useKeypress(['ArrowDown', 'Enter'], event => {
        let shouldFocus = false;

        const traverseNodeTree = node => {
            if(node.tagName === 'INPUT' && shouldFocus) {
                node.focus();
                shouldFocus = false;
            } else {
                if(node === document.activeElement) shouldFocus = true;
                [...node.children].forEach(traverseNodeTree);
            }
        };

        traverseNodeTree(ref.current);
    });

    const zeroIfEmpty = value => value? value : '';//0;
    const emptyStrIfNull = value => (value || value === 0)? value : '';

    const [formData, setFormData] = useState({
        sectionId: props.protocol.section.id,
        votersCount: zeroIfEmpty(props.protocol.results.votersCount),
        validVotesCount: zeroIfEmpty(props.protocol.results.validVotesCount),
        invalidVotesCount: zeroIfEmpty(props.protocol.results.invalidVotesCount),
    });

    const violationMessage = useRef('')

    useEffect(() => {
        if(formData.sectionId.length === 9) {
            updateSectionData();
        }
    }, [formData.sectionId])

    const updateSectionData = async () => {
        setSectionData({
            country: null,
            electionRegion: null,
            municipality: null,
            town: null,
            townId: null,
            cityRegion: null,
            address: null,
            isMachine: false,
        });

        const res = await authGet(`/sections/${formData.sectionId}`);

        const { town, electionRegion, cityRegion, place} = res.data;

        setSectionData({
            country: town.country.name,
            electionRegion: electionRegion.name,
            municipality: town.municipality? town.municipality.name : null,
            town: town.name,
            townId: town.id,
            cityRegion: !cityRegion? null : cityRegion.name,
            address: place,
            isMachine: res.data.isMachine,
        });
    };

    const initResults = () => {
        const resultsObj = { '0': '' };

        for(const party of parties) {
            if((allParties? true : party.isFeatured) || party.id.toString() === '0')
                resultsObj[party.id] = '';
                resultsObj[`${party.id}m`] = '';
                resultsObj[`${party.id}nm`] = '';
        }

        for(const result of props.protocol.results.results) {
            resultsObj[result.party.id] = emptyStrIfNull(result.validVotesCount);
            resultsObj[`${result.party.id}m`] = emptyStrIfNull(result.machineVotesCount);
            resultsObj[`${result.party.id}nm`] = emptyStrIfNull(result.nonMachineVotesCount);
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

            const updateFieldStatus = (apiKey, resultSuffix) => {
                let originalResult = '';
                for(const result of props.protocol.results.results) {
                    if(result.party.id === party.id) {
                        originalResult = emptyStrIfNull(result[apiKey]);
                    }
                }

                if(resultsData[`${party.id}${resultSuffix}`] === '')
                    fieldStatus[`party${party.id}${resultSuffix}`] = { invalid: true };
                else if(originalResult.toString() !== resultsData[`${party.id}${resultSuffix}`].toString())
                    fieldStatus[`party${party.id}${resultSuffix}`] = { changed: true };
                else
                    fieldStatus[`party${party.id}${resultSuffix}`] = { unchanged: true };
            };

            updateFieldStatus('validVotesCount', '');

            if(sectionData.isMachine) {
                updateFieldStatus('machineVotesCount', 'm');
                updateFieldStatus('nonMachineVotesCount', 'nm');
            }
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

    const handleProtocolNumberChange = e => {
        setFormData({...formData, sectionId: e.target.value});
    };

    const handleResultsChange = e => {
        const key = `${e.target.dataset.partyId}`;
        const newValue = filterNumberFieldInput(e.target.value, resultsData[key]);
        setResultsData({...resultsData, [key]: newValue});
    };

    const handleNumberChange = e => {
        const newValue = filterNumberFieldInput(e.target.value, formData[e.target.name]);
        setFormData({...formData, [e.target.name]: newValue});
    };

    const filterNumberFieldInput = (newValue, oldValue) => {
        let isNum = /^\d+$/.test(newValue);
        if(isNum) {
            return newValue;
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

    const approveProtocolAndSendViolation = async () => {
        props.setLoading(true);
        const data = {
            description: violationMessage.current,
            town: {
                id: sectionData.townId,
                name: sectionData.town
            }
        };
        await authPost(`/protocols/${props.protocol.id}/approve-with-violation`, data);
        props.setLoading(false);
        props.processingDone(`Протокол ${props.protocol.id} ОДОБРЕН и СИГНАЛ ИЗПРАТЕН`);
    };

    const rejectProtocol = async () => {
        props.setLoading(true);
        await authPost(`/protocols/${props.protocol.id}/reject`);
        props.setLoading(false);
        props.processingDone(`Протокол ${props.protocol.id} ОТХВЪРЛЕН`);
    };

    const openConfirmModal = () => {
        setModalState({
            isOpen: true,
            title: 'Сигурни ли сте?',
            message: 'Сигурни ли сте, че искате да потвърдите този протокол?',
            warningMessage: performSumCheck(),
            confirmButtonName: 'Потвърди',
            cancelButtonName: 'Върни се',
            confirmHandler: replaceProtocol,
            cancelHandler: () => setModalState({isOpen: false})
        });
    };

    const openRejectModal = () => {
        setModalState({
            isOpen: true,
            title: 'Сигурни ли сте?',
            message: 'Сигурни ли сте, че искате да отвхрълите този протокол?',
            confirmButtonName: 'Отхвърли протокола',
            cancelButtonName: 'Върни се',
            confirmHandler: rejectProtocol,
            cancelHandler: () => setModalState({isOpen: false})
        });
    };

    const openApproveAndSendViolationModal = () => {
        setModalState({
            isOpen: true,
            title: 'Сигурни ли сте?',
            message: 'Сигурни ли сте, че искате да потвърдите този протокол?',
            messageValue: violationMessage,
            messageHandler: (e) => violationMessage.current = e.target.value,
            confirmButtonName: 'Потвърди и изпрати сигнал',
            cancelButtonName: 'Върни се',
            confirmHandler: approveProtocolAndSendViolation,
            cancelHandler: () => setModalState({isOpen: false})
        });
    };

    const replaceProtocol = async () => {
        const results = {};

        Object.keys(resultsData).forEach(key => {
            if(key[key.length - 2] === 'n') {
                let newKey = key.slice(0, key.length - 2);
                if(!results[newKey]) results[newKey] = {};
                results[newKey].nonMachineVotesCount = !sectionData.isMachine? null : parseInt(resultsData[key], 10);
            } else if(key[key.length - 1] === 'm') {
                let newKey = key.slice(0, key.length - 1);
                if(!results[newKey]) results[newKey] = {};
                results[newKey].machineVotesCount = !sectionData.isMachine? null : parseInt(resultsData[key], 10);
            } else {
                if(!results[key]) results[key] = {};
                results[key].validVotesCount = parseInt(resultsData[key], 10);
            }
        });

        const postBody = {
            section: { id: formData.sectionId },
            results: {
                invalidVotesCount: parseInt(formData.invalidVotesCount, 10),
                validVotesCount: parseInt(formData.validVotesCount, 10),
                votersCount: parseInt(formData.votersCount, 10),
                results: Object.keys(results).map(key => {
                    return { party: parseInt(key, 10),
                        validVotesCount: results[key].validVotesCount,
                        machineVotesCount: results[key].machineVotesCount,
                        nonMachineVotesCount: results[key].nonMachineVotesCount,
                    };
                })
            },
            pictures: props.protocol.pictures
        };

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

    const performSumCheck = () => {
        let sum = 0;
        for(const key of Object.keys(resultsData)) {
            if(key[0] !== '0' && key[key.length-1] !== 'm' && !isNaN(resultsData[key]))
                sum += parseInt(resultsData[key], 10);
        }

        if(sum !== parseInt(formData.validVotesCount, 10)) {
            return [`
                Сборът на гласовете в т. 7 (${sum}) не се равнява на числото 
                въведено в т. 6.1 (${formData.validVotesCount}).`,
                <br/>,<br/>,
                `Ако грешката идва от протокола, моля не го поправяйте!
            `];
        } else return null;
    };

    return(
        <div>
            <ConfirmationModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                message={modalState.message}
                confirmButtonName={modalState.confirmButtonName}
                cancelButtonName={modalState.cancelButtonName}
                confirmHandler={modalState.confirmHandler}
                cancelHandler={modalState.cancelHandler}
                warningMessage={modalState.warningMessage}
                messageHandler={modalState.messageHandler}
            />
            <FontAwesomeIcon icon={faChevronDown}/>
            <ProtocolPhotos protocol={props.protocol} reorderPictures={props.reorderPictures}/>
            <ProtocolInfoSection ref={ref}>
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
                    </tbody>
                    </table>
                    <p style={{fontSize: '20px'}}>
                        {!sectionData.country? null : ['Държава: ', <b>{sectionData.country}</b>, ', ']}
                        {!sectionData.electionRegion? null : ['Изборен район: ', <b>{sectionData.electionRegion}</b>, ', ']}
                        <br/>
                        {!sectionData.municipality? null : ['Община: ', <b>{sectionData.municipality}</b>, ', ']}
                        {!sectionData.town? null : ['Населено място: ', <b>{sectionData.town}</b>, ', ']}
                        <br/>
                        {!sectionData.cityRegion? null : ['Район: ', <b>{sectionData.cityRegion}</b>, ', ']}
                        {!sectionData.address? null : ['Локация: ', <b>{sectionData.address}</b>]}
                    </p>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{paddingTop: '20px'}}>Изпратен от (организация)</td>
                            <td style={{paddingTop: '20px'}}>{props.protocol.author.organization.name}</td>
                        </tr>
                        <tr>
                            <td>Машинна секция</td>
                            <td>{sectionData.isMachine? 'Да' : 'Не'}</td>
                        </tr>
                    </tbody>
                    </table>
                    <hr/>
                    <MachineProtocolForm
                        fieldStatus={fieldStatus}
                        handleNumberChange={handleNumberChange}
                        handleResultsChange={handleResultsChange}
                        formData={formData}
                        resultsData={resultsData}
                        sectionData={sectionData}
                        parties={parties}
                        allParties={allParties}
                    />
                    <hr/>
                    {
                        invalidFields || changedFields?
                            <AcceptButton
                                disabled={invalidFields}
                                onClick={openConfirmModal}
                            >
                                Потвърди
                            </AcceptButton> :
                            <AcceptButton onClick={approveProtocol}>
                                Потвърди
                            </AcceptButton>
                    }
                    <RejectButton onClick={openRejectModal}>
                        Отхвърли
                    </RejectButton>
                </ProtocolDetails>
            </ProtocolInfoSection>
        </div>
    );
};
