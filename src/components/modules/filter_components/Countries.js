import React, { useContext } from 'react';
import { AuthContext } from '../../App';

export default (props) => {
  const countries = useContext(AuthContext).countries;

  //things to do when country is selected
  const optionHandler = (event) => {
    var selectCountry = document.getElementById('selectCountry');
    var selectedValue =
      selectCountry.options[selectCountry.selectedIndex].value;

    //sets the country code for the get request in the filter component
    props.setCountry(selectedValue.split(',')[2]);
    props.setSelectedCountry(event.target.value);

    //if isAbroad === 'true'
    if (selectedValue.split(',')[1] === 'true') {
      props.setIsAbroad(true); //disables MIR dropdown
      props.setDisabled(false); //enables the town field
      props.setMunicipalities([{ name: 'Всички' }]); //sets the visible municipality in the dropdown
      props.setRegions([{ name: 'Всички' }]); //sets the visible region in the dropdown
      props.setTown('00');
      props.setMunicipality('00');
      props.setCityRegion('00');
      props.setSelectedElectionRegion('');
    } else {
      props.setElectionRegion('00');
      props.setIsAbroad(false); //enables the MIR dropdown
      props.setDisabled(true); //disables the town dropdown because it should be enabled when MIR is chosen
      props.setMunicipality('00');
    }
  };

  const filters = countries
    .sort((a, b) => (a.code > b.code ? 1 : -1))
    .map(({ name, code, isAbroad }) => {
      {
        /* to test if the removal of name from the array has any effect??? and If I can make that with key:value pairs */
      }
      {
        /* e.g. value={[isAbroad: isAbroad, code: code]} */
      }
      return (
        <option key={code} value={[name, isAbroad, code]}>
          {name}
        </option>
      );
    });

  return (
    <select
      value={props.selectedCountry}
      id="selectCountry"
      onChange={optionHandler}
    >
      {filters}
    </select>
  );
};
