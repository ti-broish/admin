import React, { useContext } from "react";
import { AuthContext } from "../../App";


export default (props) => {
  const organizations = useContext(AuthContext).organizations;

  const { setOrganization, organization } = props

  const theOrganizations = [{id: '00', name: 'Всички'}, ...organizations]

  const changeHandler = (event) => {
    setOrganization(event.target.value);
  };

  const filters = theOrganizations.map(({ name, id }) => {
    return (
      <option key={id} value={id}>
        {name}
      </option>
    );
  });

  return <select value={organization} onChange={changeHandler}>{filters}</select>;
};
