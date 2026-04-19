import React from 'react'

export default (props) => {
  const { setAssignee, assignee, assignees } = props

  const options = [
    { id: '', label: 'Всички' },
    { id: 'none', label: 'Неназначен' },
    ...assignees.map((user) => ({
      id: user.email,
      label: `${user.firstName} ${user.lastName}`,
    })),
  ]

  const changeHandler = (event) => {
    setAssignee(event.target.value)
  }

  return (
    <select value={assignee} onChange={changeHandler}>
      {options.map(({ id, label }, index) => (
        <option key={index} value={id}>
          {label}
        </option>
      ))}
    </select>
  )
}
