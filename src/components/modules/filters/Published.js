import React, { useState } from "react";

export default (props) => {
  const statuses = [
    { all: "Всички"},
    { published: "Да" },
    { notPublished: "Не" },
  ];

  const changeHandler = (event) => {
    if (event.target.value === 'published') {
      props.setIsPublished(true);
    } else if (event.target.value === 'notPublished') {
      props.setIsPublished(false);
    } else {
      props.setIsPublished('');
    }
  };

  const filters = statuses.map((status, index) => {
    return (
      <option key={index} value={Object.keys(status)}>
        {Object.values(status)}
      </option>
    );
  });

  return (
    <select onChange={changeHandler}>
      {filters}
    </select>
  );
};