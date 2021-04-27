import React from "react";
import { Form, FormGroup, Input } from "reactstrap";

function InlineSearch({
  formClassName = "",
  value,
  onChange,
  name,
  ...otherProps
}) {
  return (
    <Form className={formClassName} onSubmit={(e) => e.preventDefault()}>
      <FormGroup>
        <Input
          value={value}
          onChange={onChange}
          type="search"
          name={name}
          {...otherProps}
        />
      </FormGroup>
    </Form>
  );
}

export default InlineSearch;
