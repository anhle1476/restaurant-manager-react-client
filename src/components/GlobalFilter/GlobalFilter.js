import React, { useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { useAsyncDebounce } from "react-table";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Form inline onSubmit={(e) => e.preventDefault()}>
      <FormGroup>
        <Label className="mr-3">Tìm kiếm:</Label>
        <Input
          value={value || ""}
          onChange={({ target }) => {
            setValue(target.value);
            onChange(target.value);
          }}
          placeholder={`Tìm trong ${count} hàng...`}
        />
      </FormGroup>
    </Form>
  );
}

export default GlobalFilter;
