import React from 'react'

import styled from 'styled-components'

const InputField = styled.input`
  background: white;
  border: 1px solid #ccc;
  height: 35px;
  width: 230px;
  overflow: hidden;
  box-sizing: border-box;
`

export default (props) => {
  const { setTextInput } = props

  const changeHandler = (event) => {
    event.preventDefault()
    setTextInput(event.target.value)
  }

  return <InputField value={props.textInput} onChange={changeHandler} />
}
