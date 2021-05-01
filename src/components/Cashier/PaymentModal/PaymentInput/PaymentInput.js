import React, { useState } from "react";

import {
  Button,
  ButtonGroup,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";

import { formatVnd } from "../../../../utils/moneyUtils";

import "./PaymentInput.scss";

const PaymentInput = ({ title, value = "", max, name, onChange }) => {
  const [percent, setPercent] = useState(0);
  const [show, setShow] = useState(false);

  const onChangePercent = (value) => {
    let newPercent = Number(value);
    newPercent = newPercent < 0 ? 0 : newPercent > 100 ? 100 : newPercent;
    setPercent(value);
    onChange({ name, value: Math.round((max * newPercent) / 100) });
  };

  const onChangeNumber = ({ target: { value } }) => {
    let newNumber = Number(value);
    newNumber = newNumber < 0 ? 0 : newNumber > max ? max : newNumber;
    setPercent(0);
    onChange({ name, value: newNumber });
  };

  const toggle = () => {
    setShow(!show);
  };

  return (
    <>
      <Button outline onClick={toggle} color="warning">
        <i className="fas fa-edit"></i>
      </Button>
      <div className={`payment-input ${show ? "show" : ""}`}>
        <div className="payment-input-header">
          <strong>{title}</strong>
          <span onClick={toggle} className="payment-input-close-btn">
            &#10005;
          </span>
        </div>
        <InputGroup>
          <Input
            value={percent}
            onChange={(e) => onChangePercent(e.target.value)}
            min="0"
            max="100"
            type="number"
            step="1"
          />
          <InputGroupAddon addonType="append">%</InputGroupAddon>
        </InputGroup>
        <ButtonGroup className="payment-input-percent-btn">
          <Button color="warning" onClick={() => onChangePercent(5)}>
            5%
          </Button>
          <Button color="warning" onClick={() => onChangePercent(10)}>
            10%
          </Button>
          <Button color="warning" onClick={() => onChangePercent(15)}>
            15%
          </Button>
          <Button color="warning" onClick={() => onChangePercent(20)}>
            20%
          </Button>
          <Button color="warning" onClick={() => onChangePercent(50)}>
            50%
          </Button>
        </ButtonGroup>
        <hr className="m-1" />
        <InputGroup>
          <Input
            value={value}
            onChange={onChangeNumber}
            min="0"
            max={max}
            type="number"
            step="1"
          />
          <InputGroupAddon addonType="append">₫</InputGroupAddon>
        </InputGroup>
        <div className="payment-input-value">
          <span>Thành tiền:</span>
          <span>{formatVnd(value)}</span>
        </div>
      </div>
    </>
  );
};

export default PaymentInput;
