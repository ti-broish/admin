import React, { useContext } from 'react';
import { AuthContext } from '../../App';

export default (props) => {
  const roles = useContext(AuthContext).roles;

  const { setRole, role } = props;

  const allRoles = [{ role: '00', roleLocalized: 'Всички' }, ...roles];

  const changeHandler = (event) => {
    setRole(event.target.value);
  };

  const filters = allRoles.map((role, idx) => {
    return (
      <option key={idx} value={role.role}>
        {role.roleLocalized}
      </option>
    );
  });

  return (
    <select value={role} onChange={changeHandler}>
      {filters}
    </select>
  );
};
