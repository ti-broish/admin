import React from 'react'

export default (props) => {
  let mirs = []

  if (!props.isAbroad) {
    mirs = [{ code: '00', name: 'Всички', isAbroad: false }, ...props.mirs]
  } else {
    mirs = props.mirs
  }

  const mirHandler = (event) => {
    var selectMir = document.getElementById('selectMir')
    var selectedValue = selectMir.options[selectMir.selectedIndex].value

    props.setSelectedElectionRegion(event.target.value)

    if (selectedValue === 'Всички') {
      props.setDisabled(true)
      props.setElectionRegion('00')
    } else {
      mirs.map(({ name, code, municipalities }) => {
        if (name === selectedValue) {
          props.setMunicipalities(municipalities)
          props.setTowns([])
          props.setRegions([])
          props.setDisabled(false)
          props.setElectionRegion(code)
        } else {
          props.setMunicipality('00')
        }
      })
    }
  }

  const filters = mirs.map(({ name, code }) => {
    return (
      <option key={code} value={name}>
        {name}
      </option>
    )
  })

  return (
    <select
      id="selectMir"
      value={props.selectedElectionRegion}
      onChange={mirHandler}
      disabled={props.isAbroad}
    >
      {filters}
    </select>
  )
}
