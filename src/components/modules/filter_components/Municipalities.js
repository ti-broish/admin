import React from "react";

export default (props) => {
  let municipalities = [];

  if (!props.isAbroad) {
    municipalities = [
      { code: "00", name: "Всички", isAbroad: false },
      ...props.municipalities,
    ];
  } else {
    municipalities = props.municipalities;
  }

  const municipalityHandler = (event) => {

    props.setSelectedMunicipality(event.target.value)
    
    var selectMunicipality = document.getElementById("selectMunicipality");
    var selectedValue =
      selectMunicipality.options[selectMunicipality.selectedIndex].value;

    municipalities.map(({ code, name }) => {
      if (selectedValue === name) {
        props.setMunicipality(code);
      }
    });
  };
  const filters = municipalities
    .sort((a, b) => (a.code > b.code ? 1 : -1))
    .map(({ code, name }) => {
      return (
        <option key={code} value={name}>
          {name}
        </option>
      );
    });

  return (
    <select
      id="selectMunicipality"
      onChange={municipalityHandler}
      disabled={props.disabled || props.isAbroad}
      value={props.selectedMunicipality}
    >
      {filters}
    </select>
  );
};
