import React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

const CustomInputGroup = ({
  children,
  name,
  label,
  feedback = "",
  ...otherProps
}) => (
  <FormGroup>
    <Label for={name}>{label}</Label>
    <Input name={name} invalid={feedback !== ""} {...otherProps}>
      {children}
    </Input>
    <FormFeedback>{feedback}</FormFeedback>
  </FormGroup>
);

export default CustomInputGroup;
