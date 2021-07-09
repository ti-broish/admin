import React, { useState } from 'react';

import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: flex;
  align-content: center;
  justify-content: center;

  .tooltip-box {
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    top: calc(100% + 5px);
    display: none;
    z-index: 1;
  }

  .tooltip-box.visible {
    display: block;
  }
`;

export default ({ children, text }) => {
  const [show, setShow] = useState(false);

  return (
    <TooltipContainer>
      <div className={show ? 'tooltip-box visible' : 'tooltip-box'}>{text}</div>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
    </TooltipContainer>
  );
};
