import React, { useState } from "react";

export default (props) => {

  const [entry, setEntry] = useState('');

  const statuses = [
    { all: "Всички"},
    { published: "Да" },
    { notPublished: "Не" },
  ];

  const changeHandler = (event) => {
    if (event.target.value === 'published') {
      props.setPublished(true);
      setEntry('published');
    } else if (event.target.value === 'notPublished') {
      props.setPublished(false);
      setEntry('notPublished');
    } else {
      props.setPublished('');
      setEntry('all');
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
    <select value={entry} onChange={changeHandler}>
      {filters}
    </select>
  );
};