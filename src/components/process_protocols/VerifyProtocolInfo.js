//@ts-check
import React, { useContext, useEffect, useRef, useState } from 'react'
import ProtocolPhotos from './protocol_photos/ProtocolPhotos'
import ValidationFormState from './validation_form/ValidationFormState'

import useKeypress from 'react-use-keypress'

import { faChevronDown, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { ProtocolStatus } from '../../common/enums/protocol-status'
import { ProtocolType } from '../../common/enums/protocol-type'
import { AuthContext } from '../App'
import ConfirmationModal from './ConfirmationModal'
import ProtocolForm from './validation_form/ProtocolForm'
import SectionDetails from './validation_form/SectionDetails'
import {
  generateInitialProtocolState,
  generateProtocolResults,
  getValidatedProtocolState,
} from './validation_form/validation-form-utils'

// #region Styled components

const ProtocolInfoSectionDiv = styled.div`
  width: 50vw;
  height: 100vh;
  overflow-y: auto;
  position: absolute;
  top: 0;
  right: 0;
`

const ProtocolDetailsStyleDiv = styled.div`
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

const SectionHeaderDiv = styled.div`
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
    box-shadow: inset 0 0 10px 0 rgba(0, 0, 0, 0.2);
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

// #endregion

/** @type {FnComponent<VerifyProtocolInfoProps>} */
export default function VerifyProtocolInfo(props) {
  // TODO: Add types
  const { parties, authPost, authGet } = useContext(AuthContext)

  const [modalState, setModalState] = useState(
    /** @type {ModalState} */ ({ isOpen: false })
  )
  const [sectionData, setSectionData] = useState({
    country: null,
    electionRegion: null,
    municipality: null,
    town: null,
    townId: null,
    cityRegion: null,
    address: null,
    isMachine: false,
    sectionExist: false,
    rawData: null,
  })

  const [protocolType, setProtocolType] = useState(
    /** @type{ProtocolType} */ (ProtocolType.UNKNOWN)
  )

  // TODO: Remove and use protocolType instead
  const [machineCount, setMachineCount] = useState(/** @type{0 | 1} */ (0))

  const [isFinal, setIsFinal] = useState(
    /** @type{ProtocolStatus}  */ (ProtocolStatus.UNKNOWN)
  )

  const [protocolState, setProtocolState] = useState(() =>
    generateInitialProtocolState(parties, protocolType)
  )

  const [formState, setFormState] = useState(
    () =>
      // @ts-ignore - left for compatibility with SectionDetails, remove when you refactor
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

  useEffect(() => {
    setProtocolState(generateInitialProtocolState(parties, protocolType))

    setMachineCount(protocolType === ProtocolType.PAPER_MACHINE ? 1 : 0)
  }, [protocolType])

  useEffect(() => {
    setProtocolState(generateInitialProtocolState(parties, protocolType))
  }, [props.protocol.id])

  /** @type {Ref} */
  const ref = useRef(null)
  useKeypress(['ArrowUp'], (event) => {
    let lastInput = null

    const traverseNodeTree = (node) => {
      if (node === document.activeElement && lastInput != null)
        lastInput.focus()
      else {
        if (node.tagName === 'INPUT' && node.type === 'text') lastInput = node
        ;[...node.children].forEach(traverseNodeTree)
      }
    }

    traverseNodeTree(ref.current)
  })

  useKeypress(['ArrowDown', 'Enter'], (event) => {
    let shouldFocus = false

    const traverseNodeTree = (node) => {
      if (node.tagName === 'INPUT' && node.type === 'text' && shouldFocus) {
        node.focus()
        shouldFocus = false
      } else {
        if (node === document.activeElement) shouldFocus = true
        ;[...node.children].forEach(traverseNodeTree)
      }
    }

    traverseNodeTree(ref.current)
  })

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
      sectionExist: false,
      rawData: null,
    })

    let res
    let sectionExist = false
    try {
      res = await authGet(`/sections/${formState.formData.sectionId}`)
      sectionExist = true
    } catch (error) {
      if (error?.response?.status === 404 && error?.response?.data) {
        res = { data: error?.response?.data }
        sectionExist = false
      }
    }

    const { town, electionRegion, cityRegion, place } = res.data
    setSectionData({
      country: town.country.name,
      electionRegion: `${electionRegion.code} - ${electionRegion.name}`,
      municipality: town.municipality?.name ?? null,
      town: town.name,
      townId: town.id,
      cityRegion: cityRegion?.name ?? null,
      address: place,
      isMachine: res.data.isMachine,
      sectionExist: sectionExist,
      rawData: res.data,
    })
  }

  /** @type {ChangeEventHandler} */
  const handleProtocolNumberChange = (e) => {
    setFormState(formState.updateProtocolNumber(e.target.value))
  }

  const rejectProtocol = async (reason) => {
    if (reason?.rejectionReason) {
      props.setLoading(true)

      authPost(`/protocols/${props.protocol.id}/reject`, {
        reason: reason?.rejectionReason,
      })
        .then(() => {
          props.processingDone(`Протокол ${props.protocol.id} ОТХВЪРЛЕН`)
        })
        .catch(() => {
          props.processingFailed('Възникна грешка, моля опитайте отново')
        })
        .finally(() => {
          props.setLoading(false)
        })
    }
  }

  const openConfirmModal = () => {
    setModalState({
      isOpen: true,
      isRejectionModal: false,
      title: 'Сигурни ли сте?',
      message: 'Сигурни ли сте, че искате да потвърдите този протокол?',
      warningMessage:
        protocolState.errors.length > 0 &&
        'Някои от валидациите на протокола не минават, моля прегледайте го отново.',
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
    /** @type {ProtocolReplaceDto} */
    const postBody = {
      section: { id: formState.formData.sectionId },
      hasPaperBallots: true,
      machinesCount: machineCount,
      isFinal: isFinal === ProtocolStatus.ORIGINAL,

      totalBallotsCount: +protocolState.inputs.totalBallotsCount.value,
      votersCount: +protocolState.inputs.votersCount.value,
      additionalVotersCount: +protocolState.inputs.additionalVotersCount.value,
      votersVotedCount: +protocolState.inputs.votersVotedCount.value,
      uncastBallots: +protocolState.inputs.uncastBallots.value,
      invalidAndUncastBallots:
        +protocolState.inputs.invalidAndUncastBallots.value,
      castBallotsCount: +protocolState.inputs.castBallotsCount.value,
      // new fields below
      nonMachineCastBallotsCount:
        +protocolState.inputs.nonMachineCastBallotsCount.value,
      machineCastBallotsCount:
        +protocolState.inputs.machineCastBallotsCount.value,
      validVotesCount: +protocolState.inputs.validVotesCount.value,
      partyValidVotesCount: +protocolState.inputs.partyValidVotesCount.value,
      partyNonMachineVotesCount:
        +protocolState.inputs.partyNonMachineVotesCount.value,
      partyMachineVotesCount:
        +protocolState.inputs.partyMachineVotesCount.value,
      nonMachineVotesCount: +protocolState.inputs.nonMachineVotesCount.value,
      machineVotesCount: +protocolState.inputs.machineVotesCount.value,
      results: generateProtocolResults(protocolState, parties),
      pictures: props.protocol.pictures,
    }

    props.setLoading(true)

    try {
      await authPost(`/protocols/${props.protocol.id}/replace`, postBody)
      props.processingDone(`Протокол ${props.protocol.id} ОДОБРЕН с КОРЕКЦИЯ`)
    } catch {
      // ignore error?
    } finally {
      props.setLoading(false)
    }
  }

  /** @type {(protocolState: ProtocolState) => void} */
  const validateProtocolForm = (protocolState) => {
    setProtocolState(
      getValidatedProtocolState(protocolState, protocolType, parties)
    )
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

      <ProtocolInfoSectionDiv ref={ref}>
        <SectionHeaderDiv>
          <BackButton onClick={props.returnProtocol}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </BackButton>
          <h1 style={{ display: 'inline-block' }}>
            Секция {props.protocol.section?.id}
          </h1>
        </SectionHeaderDiv>
        <ProtocolDetailsStyleDiv>
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
            isFinal={isFinal}
            refetchNewSection={updateSectionData}
          />

          {protocolType != ProtocolType.UNKNOWN && (
            <ProtocolForm
              validateProtocolForm={validateProtocolForm}
              parties={parties}
              protocolType={protocolType}
              protocolState={protocolState}
              sectionData={sectionData}
            />
          )}

          {protocolState.errors.length > 0 &&
            protocolType !== ProtocolType.UNKNOWN && (
              <>
                <hr />
                <h2>Контролни проверки</h2>
                <ul>
                  {protocolState.errors.map((e, i) => (
                    <li key={i} style={{ color: 'red' }}>
                      {e}
                    </li>
                  ))}
                </ul>
                <input
                  type="checkbox"
                  name="accept-invalid-protocol"
                  id="accept-invalid-protocol"
                  checked={protocolState.acceptInvalidProtocol}
                  onChange={(e) =>
                    setProtocolState({
                      ...protocolState,
                      acceptInvalidProtocol:
                        !protocolState.acceptInvalidProtocol,
                    })
                  }
                />
                <label
                  style={{ marginLeft: '8px' }}
                  htmlFor="accept-invalid-protocol"
                >
                  Потвърждавам, че протоколът има грешки при контролните
                  проверки и е въведен точно както е попълнен от СИК.
                </label>
              </>
            )}

          <hr />
          {invalidFields || changedFields ? (
            <AcceptButton
              disabled={
                !protocolState.isValid && !protocolState.acceptInvalidProtocol
              }
              onClick={openConfirmModal}
            >
              Потвърди
            </AcceptButton>
          ) : (
            <AcceptButton onClick={openConfirmModal}>Потвърди</AcceptButton>
          )}
          <RejectButton onClick={openRejectModal}>Отхвърли</RejectButton>
        </ProtocolDetailsStyleDiv>
      </ProtocolInfoSectionDiv>
    </div>
  )
}
