import React from 'react'

export default (props) => {
  const { setOrigin, origin } = props
  const origins = [
    { origin: '00', originLocalized: 'Всички' },
    ...props.origins,
  ]

  const changeHandler = (event) => {
    setOrigin(event.target.value)
  }

  const filters = origins.map(({ origin, originLocalized }, index) => {
    return (
      <option key={index} value={origin}>
        {originLocalized}
      </option>
    )
  })

  return (
    <select value={origin} onChange={changeHandler}>
      {filters}
    </select>
  )
}
