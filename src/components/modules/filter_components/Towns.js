import React from 'react'

export default (props) => {
  let towns = []

  if (!props.isAbroad) {
    towns = [{ id: '00', name: 'Всички', isAbroad: false }, ...props.towns]
  } else {
    towns = [{ id: '00', name: 'Всички', isAbroad: true }, ...props.towns]
  }

  const townHandler = (event) => {
    props.setSelectedTown(event.target.value)

    var selectTown = document.getElementById('selectTown')
    var selectedValue = selectTown.options[selectTown.selectedIndex].value
    if (!props.isAbroad) {
      if (selectedValue !== 'Всички') {
        towns.map(({ name, cityRegions, id }) => {
          if (selectedValue === name) {
            props.setRegions(cityRegions)
            props.setTown(id)
          }
        })
      } else {
        props.setTown('')
      }
    } else {
      props.setRegions([{ name: 'Всички', code: '00' }])
      towns
        .sort((a, b) => (a.id > b.id ? 1 : -1))
        .map(({ name, id }) => {
          if (selectedValue === name) {
            props.setTown(id)
          }
        })
    }
  }

  const filters = towns
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map(({ name, id }) => {
      return (
        <option key={id} value={name}>
          {name}
        </option>
      )
    })

  return (
    <select
      value={props.selectedTown}
      id="selectTown"
      onChange={townHandler}
      disabled={props.disabled}
    >
      {filters}
    </select>
  )
}
