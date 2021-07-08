import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ProtocolPhotos from './protocol_photos/ProtocolPhotos';
import ProtocolForm from './validation_form/ProtocolForm';
import ValidationFormState from './validation_form/ValidationFormState';

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
import SectionDetails from './validation_form/SectionDetails';

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

    const [protocolType, setProtocolType] = useState('unset');
    const [machineCount, setMachineCount] = useState(0);
    const [isFinal, setIsFinal] = useState(false);

    const [formState, setFormState] = useState(new ValidationFormState({ protocol: props.protocol, parties, allParties }));
    const { fieldStatus, invalidFields, changedFields } = formState.getFieldStatus(props.protocol, parties, allParties, sectionData, protocolType);
    const ref = useRef();

    useEffect(() => {
        setFormState(new ValidationFormState({ protocol: props.protocol, parties, allParties }));
    }, [protocolType]);

    useEffect(() => {
        setFormState(new ValidationFormState({ protocol: props.protocol, parties, allParties }));
    }, [machineCount]);

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

    const violationMessage = useRef('')

    useEffect(() => {
        if(formState.formData.sectionId.length === 9) {
            updateSectionData();
        }
    }, [formState.formData.sectionId])

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

        const res = await authGet(`/sections/${formState.formData.sectionId}`);

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

    const handleProtocolNumberChange = e => {
        setFormState(formState.updateProtocolNumber(e.target.value));
    };

    const handleResultsChange = e => {
        const key = e.target.name;//`${e.target.dataset.partyId}`;
        setFormState(formState.updateResultsData(key, e.target.value));
    };

    const handleNumberChange = e => {
        const key = e.target.name;
        setFormState(formState.updateFormData(key, e.target.value));
    };

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

    const replaceProtocol = async () => {
        const results = formState.generateResults(sectionData.isMachine);

        const postBody = {
            section: { id: formState.formData.sectionId },
            hasPaperBallots: protocolType === 'paper' || protocolType === 'paper-machine',
            machinesCount: machineCount,
            isFinal: isFinal,
            votersCount: parseInt(formState.formData.votersCount, 10),
            additionalVotersCount: parseInt(formState.formData.additionalVotersCount, 10),
            paperBallotsOutsideOfBox: parseInt(formState.formData.paperBallotsOutsideOfBox, 10),
            votesCount: parseInt(formState.formData.votesCount, 10),
            paperVotesCount: parseInt(formState.formData.paperVotesCount, 10),
            machineVotesCount: parseInt(formState.formData.machineVotesCount, 10),
            invalidVotesCount: parseInt(formState.formData.invalidVotesCount, 10),
            validVotesCount: parseInt(formState.formData.validVotesCount, 10),
            results: {        
                results: Object.keys(results).map(key => {
                    return { party: parseInt(key, 10),
                        validVotesCount: results[key].validVotesCount,
                        machineVotesCount: results[key].machineVotesCount,
                        nonMachineVotesCount: results[key].nonMachineVotesCount,
                    };
                })
            },
            pictures: props.protocol.pictures,
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
        for(const key of Object.keys(formState.resultsData)) {
            if(key[0] !== '0' && key[key.length-1] !== 'm' && !isNaN(formState.resultsData[key]))
                sum += parseInt(formState.resultsData[key], 10);
        }

        if(sum !== parseInt(formState.formData.validVotesCount, 10)) {
            return [`
                Сборът на гласовете в т. 7 (${sum}) не се равнява на числото 
                въведено в т. 6.1 (${formState.formData.validVotesCount}).`,
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
                    <SectionDetails
                        fieldStatus={fieldStatus}
                        handleProtocolNumberChange={handleProtocolNumberChange}
                        sectionData={sectionData}
                        protocol={props.protocol}
                        formState={formState}
                        protocolType={protocolType}
                        setProtocolType={setProtocolType}
                        machineCount={machineCount}
                        setMachineCount={setMachineCount}
                    />
                    {
                        protocolType === 'unset' ||
                        (protocolType === 'machine' && machineCount === 0) ||
                        (protocolType === 'paper-machine' && machineCount === 0)? null :
                            <ProtocolForm
                                fieldStatus={fieldStatus}
                                handleNumberChange={handleNumberChange}
                                handleResultsChange={handleResultsChange}
                                formState={formState}
                                sectionData={sectionData}
                                parties={parties}
                                allParties={allParties}
                                protocolType={protocolType}
                                setIsFinal={setIsFinal}
                            />
                    }
                    {protocolType !== 'unset'? <hr/> : null}
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
