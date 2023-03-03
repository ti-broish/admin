import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import React, { useState, useContext, useMemo } from 'react'

import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { AuthContext } from '../../App'

const CommentFormStyle = styled.form`
  width: 100%;

  input[type='radio'] {
    margin-left: 15px;
    margin-right: 5px;

    &:first-of-type {
      margin-left: 0;
    }
  }

  textarea {
    width: 100%;
    font-size: 18px;
    padding: 20px;
    border: 1px solid #eee;
    margin: 20px 0;
    box-sizing: border-box;
  }
`

const FancyButton = styled.input`
  border: none;
  padding: 5px 10px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 5px;
  box-sizing: border-box;
  display: inline-block;
  font-weight: bold;
  margin: 0 2px;
  position: relative;
  color: white;

  &:active:enabled {
    top: 5px;
    border-bottom: 0;
  }

  &:disabled {
    cursor: auto;
    color: white;
  }

  &:first-of-type {
    margin-left: 0;
  }
`

export const FancyButtonBlue = styled(FancyButton)`
  background-color: #36a2e3;
  border-bottom: 5px solid #1e70b9;

  &:hover {
    background-color: #48b4f4;
  }

  &:disabled {
    background-color: #b6e4ff;
    border-bottom-color: #b9d4ec;
  }
`

const generateEmailSubject = (section) => {
  if (section) {
    return `Сигнал за нередност в изборна секция №${section.id}`
  }
  return 'Сигнал за нередност'
}

export default (props) => {
  const [formData, setFormData] = useState({ type: 'internal' })
  const [loading, setLoading] = useState(false)
  const { violation } = useParams()

  const { authPost } = useContext(AuthContext)
  const foreignAreaSection = useMemo(() => {
    return (
      props.section && props.section.id && props.section.id.slice(0, 2) === '32'
    )
  }, [props.section])

  const handleSubmit = (e) => {
    e.preventDefault()

    setLoading(true)
    authPost(`/violations/${violation}/comments`, formData)
      .then((res) => {
        setLoading(false)
        props.newComment(res.data)
        if (formData.type === 'sentToCIK') {
          window.open(
            `mailto:cik@cik.bg?body=${encodeURIComponent(
              formData.text
            )}&subject=${encodeURIComponent(
              generateEmailSubject(props.section)
            )}`
          )
        } else if (formData.type === 'sentToRIK') {
          const sectionArea = props.section.id.slice(0, 2)
          window.open(
            `mailto:rik${sectionArea}@cik.bg?body=${encodeURIComponent(
              formData.text
            )}&subject=${encodeURIComponent(
              generateEmailSubject(props.section)
            )}`
          )
        }
        setFormData({ text: '', type: 'internal' })
      })
      .catch((err) => setLoading(false))
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <CommentFormStyle onSubmit={handleSubmit}>
      <label style={{ fontWeight: 'bold', margin: '10px 0', display: 'block' }}>
        Изпрати до:
      </label>
      <input
        type="radio"
        checked={formData.type === 'sentToCIK'}
        name="type"
        id="sentToCIK"
        value="sentToCIK"
        onChange={handleChange}
      />
      <label htmlFor="sentToCIK">ЦИК</label>
      <input
        type="radio"
        disabled={foreignAreaSection}
        checked={formData.type === 'sentToRIK'}
        name="type"
        id="sentToRIK"
        value="sentToRIK"
        onChange={handleChange}
      />
      <label htmlFor="sentToRIK">РИК</label>
      <input
        type="radio"
        checked={formData.type === 'sentToMVR'}
        name="type"
        id="sentToMVR"
        value="sentToMVR"
        onChange={handleChange}
      />
      <label htmlFor="sentToMVR">МВР</label>
      <input
        type="radio"
        checked={formData.type === 'sentToProsecutor'}
        name="type"
        id="sentToProsecutor"
        value="sentToProsecutor"
        onChange={handleChange}
      />
      <label htmlFor="sentToProsecutor">Дежурен прокурор</label>
      <input
        type="radio"
        checked={formData.type === 'sentToAuthor'}
        name="type"
        id="sentToAuthor"
        value="sentToAuthor"
        onChange={handleChange}
      />
      <label htmlFor="sentToAuthor">Застъпник</label>
      <input
        type="radio"
        checked={formData.type === 'internal'}
        name="type"
        id="internal"
        value="internal"
        onChange={handleChange}
      />
      <label htmlFor="internal">Не изпращай</label>
      <br />
      <textarea
        type="text"
        name="text"
        rows={4}
        placeholder={'Напишете коментар към сигнала'}
        value={formData.text}
        onChange={handleChange}
      />
      <FancyButtonBlue
        type="submit"
        disabled={loading}
        value={loading ? 'Изпращане...' : 'Изпрати коментар'}
      />
      <FancyButtonBlue style={{ visibility: 'hidden' }} />
      <hr />
    </CommentFormStyle>
  )
}
