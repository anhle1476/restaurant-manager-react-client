import React from "react";
import { ModalHeader } from "reactstrap";

function ModalCustomHeader({ children, toggle, ...otherProps }) {
  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );

  return (
    <ModalHeader toggle={toggle} close={closeBtn} {...otherProps}>
      {children}
    </ModalHeader>
  );
}

export default ModalCustomHeader;
