import React, { useContext, useEffect, useRef, useState } from 'react'
import ProtocolPhotos from './protocol_photos/ProtocolPhotos'
import ValidationFormState from './validation_form/ValidationFormState'

import useKeypress from 'react-use-keypress'

import { faChevronDown, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { AuthContext } from '../App'
import ConfirmationModal from './ConfirmationModal'
import ProtocolForm from './validation_form/ProtocolForm'
import SectionDetails from './validation_form/SectionDetails'

const ProtocolInfoSection = styled.div`
  width: 50vw;
  height: 100vh;
  overflow-y: auto;
  position: absolute;
  top: 0;
  right: 0;
`

const ProtocolDetailsStyle = styled.div`
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
`

const SectionHeader = styled.div`
  //padding: 10px;
  background-color: rgb(56, 222, 203);
  color: white;
`

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
`

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
`

const AcceptButton = styled(VerificationPanelButton)`
  background-color: #44e644;
  border-bottom: 5px solid #2eae1c;
  color: white;

  &:hover {
    background-color: #2ece2e;
  }
`

const CorrectButton = styled(VerificationPanelButton)`
  background-color: #f9de00;
  border-bottom: 5px solid #a69b00;
  color: white;

  &:hover {
    background-color: #ffe405;
  }
`

const RejectButton = styled(VerificationPanelButton)`
  background-color: #ff4545;
  border-bottom: 5px solid #ce4c4c;
  color: white;

  &:hover {
    background-color: #ff2626;
  }
`

const ApproveAndSendViolationButton = styled(VerificationPanelButton)`
  background-color: #f19c48;
  border-bottom: 5px solid #eeaa67;
  color: white;

  &:hover {
    background-color: #ef8a25;
  }
`

export default (props) => {
  const { parties, authPost, authGet } = useContext(AuthContext)

  const [allParties, setAllParties] = useState(true) //Math.random() < 0.5);
  const [modalState, setModalState] = useState({ isOpen: false })
  const [sectionData, setSectionData] = useState({
    country: null,
    electionRegion: null,
    municipality: null,
    town: null,
    townId: null,
    cityRegion: null,
    address: null,
    isMachine: false,
  })

  const [machineHash, setMachineHash] = useState([
    { startHash: '', endHash: '' },
  ])

  const [protocolType, setProtocolType] = useState('unset')
  const [machineCount, setMachineCount] = useState(0)
  const [isFinal, setIsFinal] = useState(false)

  const [formState, setFormState] = useState(
    () =>
      new ValidationFormState({
        protocol: props.protocol,
        parties,
        protocolType,
        machineCount,
      })
  )

  const { fieldStatus, invalidFields, changedFields } =
    formState.getFieldStatus(
      props.protocol,
      parties,
      protocolType,
      machineCount
    )
  const ref = useRef()

  useEffect(() => {
    setFormState(
      new ValidationFormState({
        protocol: props.protocol,
        parties,
        protocolType,
        machineCount,
      })
    )

    setMachineCount(protocolType == 'paper-machine' ? 1 : 0)
  }, [protocolType])

  useEffect(() => {
    setFormState(
      new ValidationFormState({
        protocol: props.protocol,
        parties,
        protocolType,
        machineCount,
      })
    )

    if (machineCount === 0) {
      setMachineHash([])
    } else if (machineCount === 1) {
      setMachineHash([{ startHash: '', endHash: '' }])
    } else if (machineCount === 2) {
      setMachineHash([
        { startHash: '', endHash: '' },
        { startHash: '', endHash: '' },
      ])
    }
  }, [machineCount])

  useKeypress(['ArrowUp'], (event) => {
    let lastInput = null

    const traverseNodeTree = (node) => {
      if (node === document.activeElement && lastInput != null)
        lastInput.focus()
      else {
        if (node.tagName === 'INPUT') lastInput = node
          ;[...node.children].forEach(traverseNodeTree)
      }
    }

    traverseNodeTree(ref.current)
  })

  useKeypress(['ArrowDown', 'Enter'], (event) => {
    let shouldFocus = false

    const traverseNodeTree = (node) => {
      if (node.tagName === 'INPUT' && shouldFocus) {
        node.focus()
        shouldFocus = false
      } else {
        if (node === document.activeElement) shouldFocus = true
          ;[...node.children].forEach(traverseNodeTree)
      }
    }

    traverseNodeTree(ref.current)
  })

  const violationMessage = useRef('')

  useEffect(() => {
    if (formState.formData.sectionId?.length === 9) {
      updateSectionData()
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
    })

    const res = await authGet(`/sections/${formState.formData.sectionId}`)

    const { town, electionRegion, cityRegion, place } = res.data

    setSectionData({
      country: town.country.name,
      electionRegion: electionRegion.name,
      municipality: town.municipality ? town.municipality.name : null,
      town: town.name,
      townId: town.id,
      cityRegion: !cityRegion ? null : cityRegion.name,
      address: place,
      isMachine: res.data.isMachine,
    })
  }

  const handleProtocolNumberChange = (e) => {
    setFormState(formState.updateProtocolNumber(e.target.value))
  }

  const handleResultsChange = (e) => {
    const key = e.target.name //`${e.target.dataset.partyId}`;
    setFormState(formState.updateResultsData(key, e.target.value))
  }

  const handleNumberChange = (e) => {
    const key = e.target.name
    setFormState(formState.updateFormData(key, e.target.value))
  }

  const rejectProtocol = async (reason) => {
    if (reason?.rejectionReason) {
      props.setLoading(true)

      authPost(`/protocols/${props.protocol.id}/reject`, {
        reason: reason?.rejectionReason,
      })
        .then((res) => {
          props.setLoading(false)
          props.processingDone(`Протокол ${props.protocol.id} ОТХВЪРЛЕН`)
        })
        .catch((err) => {
          props.setLoading(false)
          props.processingFailed('Възникна грешка, моля опитайте отново')
        })
    }
  }

  const openConfirmModal = () => {
    setModalState({
      isOpen: true,
      isRejectionModal: false,
      title: 'Сигурни ли сте?',
      message: 'Сигурни ли сте, че искате да потвърдите този протокол?',
      warningMessage: performSumCheck(),
      confirmButtonName: 'Потвърди',
      cancelButtonName: 'Върни се',
      confirmHandler: replaceProtocol,
      cancelHandler: () => setModalState({ isOpen: false }),
    })
  }

  const openRejectModal = () => {
    setModalState({
      isOpen: true,
      isRejectionModal: true,
      title: 'Сигурни ли сте?',
      message: 'Сигурни ли сте, че искате да отхвърлите този протокол?',
      confirmButtonName: 'Отхвърли протокола',
      cancelButtonName: 'Върни се',
      confirmHandler: (reason) => rejectProtocol(reason),
      cancelHandler: () => setModalState({ isOpen: false }),
    })
  }

  const replaceProtocol = async () => {
    const postBody = {
      section: { id: formState.formData.sectionId },
      hasPaperBallots:
        protocolType === 'paper' || protocolType === 'paper-machine',
      machinesCount: machineCount,
      isFinal: isFinal,
      votersCount: parseInt(formState.formData.votersCount, 10),
      additionalVotersCount: parseInt(
        formState.formData.additionalVotersCount,
        10
      ),
      votersVotedCount: parseInt(formState.formData.votersVotedCount, 10),
      uncastBallots: parseInt(formState.formData.uncastBallots, 10),
      invalidAndUncastBallots: parseInt(
        formState.formData.invalidAndUncastBallots,
        10
      ),
      totalVotesCast: parseInt(formState.formData.totalVotesCast, 10),
      results: formState.generateResults(parties, protocolType, machineCount),
      pictures: props.protocol.pictures,
    }

    if (protocolType === 'paper-machine') {
      postBody['nonMachineVotesCount'] = parseInt(
        formState.formData.nonMachineVotesCount,
        10
      )
      postBody['machineVotesCount'] = parseInt(
        formState.formData.machineVotesCount,
        10
      )
    }

    if (protocolType === 'paper' || protocolType === 'paper-machine') {
      postBody['invalidVotesCount'] = parseInt(
        formState.formData.invalidVotesCount,
        10
      )
      postBody['validVotesCount'] = parseInt(
        formState.formData.validVotesCount,
        10
      )
    }

    if (protocolType === 'machine' || protocolType === 'paper-machine') {
      postBody['machineHashes'] = machineHash
    }

    props.setLoading(true)
    try {
      const res = await authPost(
        `/protocols/${props.protocol.id}/replace`,
        postBody
      )
    } catch (err) {
      props.setLoading(false)
      return
    }
    props.setLoading(false)
    props.processingDone(`Протокол ${props.protocol.id} ОДОБРЕН с КОРЕКЦИЯ`)
  }

  const performSumCheck = () => {
    return null
    if (protocolType === 'machine') return null

    let sum = 0
    for (const key of Object.keys(formState.resultsData)) {
      sum += parseInt(formState.resultsData[key], 10)
    }

    if (sum !== parseInt(formState.formData.validVotesCount, 10)) {
      return [
        `
                Сборът на гласовете на всички партии (${sum}) не се равнява на числото
                въведено в т. 7.1 (${formState.formData.validVotesCount}).`,
        <br />,
        <br />,
        `Ако грешката идва от протокола, моля не го поправяйте!
            `,
      ]
    } else return null
  }

  return (
    <div>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        isRejectionModal={modalState.isRejectionModal}
        title={modalState.title}
        message={modalState.message}
        confirmButtonName={modalState.confirmButtonName}
        cancelButtonName={modalState.cancelButtonName}
        confirmHandler={modalState.confirmHandler}
        cancelHandler={modalState.cancelHandler}
        warningMessage={modalState.warningMessage}
        messageHandler={modalState.messageHandler}
      />
      <FontAwesomeIcon icon={faChevronDown} />
      <ProtocolPhotos
        protocol={props.protocol}
        reorderPictures={props.reorderPictures}
      />
      <ProtocolInfoSection ref={ref}>
        <SectionHeader>
          <BackButton onClick={props.returnProtocol}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </BackButton>
          <h1 style={{ display: 'inline-block' }}>
            Секция {props.protocol.section?.id}
          </h1>
        </SectionHeader>
        <ProtocolDetailsStyle>
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
            setIsFinal={setIsFinal}
          />
          {protocolType === 'unset' ||
            (protocolType === 'machine' && machineCount === 0) ||
            (protocolType === 'paper-machine' && machineCount === 0) ? null : (
            <ProtocolForm
              fieldStatus={fieldStatus}
              handleNumberChange={handleNumberChange}
              handleResultsChange={handleResultsChange}
              formState={formState}
              parties={parties}
              allParties={allParties}
              protocolType={protocolType}
              machineCount={machineCount}
              machineHash={machineHash}
              setMachineHash={setMachineHash}
            />
          )}
          {protocolType !== 'unset' ? <hr /> : null}
          {invalidFields || changedFields ? (
            <AcceptButton disabled={invalidFields} onClick={openConfirmModal}>
              Потвърди
            </AcceptButton>
          ) : (
            <AcceptButton onClick={openConfirmModal}>Потвърди</AcceptButton>
          )}
          <RejectButton onClick={openRejectModal}>Отхвърли</RejectButton>
        </ProtocolDetailsStyle>
      </ProtocolInfoSection>
    </div>
  )
}
