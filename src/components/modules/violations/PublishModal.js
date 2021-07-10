import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1998;
`;

const PublishModal = styled.div`
  background-color: white;
  z-index: 1999;
  position: fixed;
  width: 600px;
  margin: 0 auto;
  display: block;
  top: 5%;
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
`;

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
`;

const AcceptButton = styled(VerificationPanelButton)`
  background-color: #44e644;
  border-bottom: 5px solid #2eae1c;
  color: white;

  &:hover {
    background-color: #2ece2e;
  }
`;

const CancelButton = styled(VerificationPanelButton)`
  background-color: #ccc;
  border-bottom: 5px solid #999;
  color: white;

  &:hover {
    background-color: #ddd;
  }
`;

export default (props) => {

    const [publishedText, setPublishedText] = useState();

    useEffect(() => {
        if(props.isOpen) {
            setPublishedText(props.violationText);
        }
    }, [props.isOpen]);

    const handleChange = e => {
        console.log(e.target.value);
        setPublishedText(e.target.value);
    };

  return !props.isOpen ? null : (
    <>
      <ModalOverlay onClick={props.cancelHandler} />,
      <PublishModal>
        <h1>Публикуване на сигнал</h1>
        <hr />
        <p>
            Моля редактирайте текста, който ще се показва на публичния сайт
            с резултати и нанесете нужните корекции, като например да 
            <b> заличите личните данни</b>.
        </p>

        <textarea 
            style={{width: '100%', padding: '10px', boxSizing: 'border-box', resize: 'none'}}
            value={publishedText}
            onChange={handleChange}
            rows="10"
        />
        
        <hr/>

        <AcceptButton onClick={() => { console.log(publishedText); props.confirmHandler(publishedText) }}>
          Публикувай
        </AcceptButton>
        <CancelButton onClick={props.cancelHandler}>
          Назад
        </CancelButton>
      </PublishModal>
    </>
  );
};
