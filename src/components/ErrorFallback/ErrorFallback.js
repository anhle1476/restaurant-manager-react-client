import React from "react";
import "./ErrorFallback.scss";

const ErrorFallback = ({ message, children }) => {
  return (
    <div className="error-fallback">
      <h4>Nhà hàng Super Pig</h4>
      <p className="main-message">{message}</p>
      {children}
    </div>
  );
};

export default ErrorFallback;
