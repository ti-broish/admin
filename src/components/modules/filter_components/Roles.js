import React from 'react';

export default (props) => {
  const { setRole, role, roles } = props;

  const allRoles = roles
    ? [{ role: '00', roleLocalized: 'Всички' }, ...roles]
    : [{ role: '00', roleLocalized: 'Зарежда ...' }];

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
    <select disabled={!roles} value={role} onChange={changeHandler}>
      {filters}
    </select>
  );
};
