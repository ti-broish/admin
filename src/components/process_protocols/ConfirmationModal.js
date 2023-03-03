import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../App'

import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import Loading from '../layout/Loading'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1998;
`

const ConfirmationModal = styled.div`
  background-color: white;
  z-index: 1999;
  position: fixed;
  width: 600px;
  margin: 0 auto;
  display: block;
  top: 25%;
  left: 0;
  right: 0;
  padding: 40px 50px;
  box-sizing: border-box;
  border-radius: 25px;
  border-bottom: 5px solid #aaa;
  box-shadow: 0px 0px 15px #333;

  h1 {
    margin: 0;
  }

  p {
    margin-bottom: 30px;
  }

  hr {
    border-top: none;
    border-color: #ddd;
  }
`

const VerificationPanelButton = styled.button`
  border: none;
  padding: 5px 10px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  box-sizing: border-box;
  display: inline-block;
  font-weight: bold;
  //width: calc(50% - 20px);
  margin: 0 5px;
  position: relative;

  &:active {
    top: 5px;
    border-bottom: 0;
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

const CancelButton = styled(VerificationPanelButton)`
  background-color: #ccc;
  border-bottom: 5px solid #999;
  color: white;

  &:hover {
    background-color: #ddd;
  }
`

const CheckboxList = styled.div`
  list-style: none;
  padding: 0;

  li {
    margin-bottom: 0.9rem;
  }

  .checkbox-list-item {
    display: flex;
    justify-content: space-between;

    label {
      vertical-align: text-bottom;
      margin-left: 0.5rem;
    }
  }
`

export default (props) => {
  const { authGet } = useContext(AuthContext)

  const [rejectionReasons, setRejectionReasons] = useState(null)
  const [selectedReason, setSelectedReason] = useState(null)

  useEffect(() => {
    if (props.isOpen === false) {
      setSelectedReason(null)

      if (rejectionReasons) {
        restoreReasonSelection(rejectionReasons)
      }
    }

    if (props.isRejectionModal && !rejectionReasons) {
      authGet('/protocols/rejection-reasons').then((res) => {
        const reasons = res.data
        if (reasons) {
          restoreReasonSelection(reasons)
        }
      })
    }
  }, [props.isOpen])

  const restoreReasonSelection = (reasons) => {
    setRejectionReasons(
      reasons.map((reason) => ({
        ...reason,
        isChecked: false,
      }))
    )
  }

  const handleOnChange = (item) => {
    const selectedItem = item ? { ...item, isChecked: !item.isChecked } : null
    const updatedCheckedState = rejectionReasons?.map((reason) =>
      reason.rejectionReason === selectedItem.rejectionReason
        ? selectedItem
        : { ...reason, isChecked: false }
    )
    setSelectedReason(selectedItem)
    setRejectionReasons(updatedCheckedState)
  }
  return !props.isOpen ? null : (
    <>
      <ModalOverlay onClick={props.cancelHandler} />,
      <ConfirmationModal>
        <h1>{props.title}</h1>
        <hr />
        <p>{props.message}</p>
        {!props.warningMessage ? null : (
          <p style={{ color: '#f9d71c', fontWeight: 'bold' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {props.warningMessage}
          </p>
        )}
        {!props.isRejectionModal ? null : !rejectionReasons ? (
          <Loading />
        ) : (
          <>
            <h3>Причина за отхвърляне</h3>
            <ul style={{ padding: 0 }}>
              <CheckboxList>
                {rejectionReasons?.map((reason, index) => {
                  return (
                    <li key={index}>
                      <div className="checkbox-list-item">
                        <div>
                          <input
                            type="radio"
                            id={`custom-checkbox-${index}`}
                            name={reason.rejectionReasonLocalized}
                            value={reason.rejectionReasonLocalized}
                            checked={reason.isChecked}
                            onChange={() => handleOnChange(reason)}
                          />
                          <label htmlFor={`custom-checkbox-${index}`}>
                            {reason.rejectionReasonLocalized}
                          </label>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </CheckboxList>
            </ul>
          </>
        )}
        {!props.messageHandler ? null : (
          <div>
            <label htmlFor="violation">Съобщение към сигнала</label>
            <textarea
              name="violation"
              id="violation"
              cols="30"
              rows="10"
              style={{ width: '100%' }}
              onChange={props.messageHandler}
              value={props.messageValue}
            ></textarea>
          </div>
        )}
        <AcceptButton
          onClick={() => props.confirmHandler(selectedReason)}
          disabled={props.isRejectionModal && !selectedReason?.isChecked}
        >
          {props.confirmButtonName}
        </AcceptButton>
        <CancelButton onClick={props.cancelHandler}>
          {props.cancelButtonName}
        </CancelButton>
      </ConfirmationModal>
    </>
  )
}
