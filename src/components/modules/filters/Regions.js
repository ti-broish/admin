import React from "react";

export default (props) => {

  let regions = [];

  if (!props.isAbroad) {
    regions = [{ code: "00", name: "Всички", isAbroad: false }, ...props.regions];
  } else {
    regions = props.regions;
  }

  const changeHandler = (event) => {
    props.setCityRegion(event.target.value);
  };

  const filters = regions.map(({ name, code }) => {
    return (
      <option key={code} value={code}>
        {name}
      </option>
    );
  });

  return <select value={props.cityRegion} disabled={props.isAbroad || props.disabled} onChange={changeHandler}>{filters}</select>;
};
