import React from "react";

export default (props) => {
  const { setStatus, status } = props;

  const statuses = [{status: '00', statusLocalized: 'Всички'}, ...props.statuses]

  const changeHandler = (event) => {
    setStatus(event.target.value);
  };

  const filters = statuses
    .sort((a, b) => (a.statusLocalized > b.statusLocalized ? 1 : -1))
    .map(({ status, statusLocalized }, index) => {
      return (
        <option key={index} value={status}>
          {statusLocalized}
        </option>
      );
    });

  return (
    <select value={status} onChange={changeHandler}>
      {filters}
    </select>
  );
};
