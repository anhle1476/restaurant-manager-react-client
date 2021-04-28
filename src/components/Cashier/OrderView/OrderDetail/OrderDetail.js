import React from "react";
import { Button, ButtonGroup, Col, Form, Input, Row } from "reactstrap";
import { getMinuteDifference } from "../../../../utils/dateUtils";

import "./OrderDetail.scss";

const OrderDetail = ({
  food,
  quantity,
  doneQuantity,
  lastOrderTime,
  handleSelectFood,
  handleTypeOrderAmount,
}) => {
  const minuteDiff = lastOrderTime ? getMinuteDifference(lastOrderTime) : 0;
  const clockColor =
    minuteDiff < 10 ? "success" : minuteDiff < 20 ? "warning" : "danger";
  return (
    <Row className="order-details">
      <Col xs="5" title="Tên món" className="food-name">
        <span>
          {food.name}
          {lastOrderTime && (
            <i
              className={`fa fa-clock-o ml-2 text-${clockColor}`}
              title={`${minuteDiff} phút trước`}
            ></i>
          )}
        </span>
      </Col>
      <Col xs="2">
        <small>{food.price}</small>
      </Col>
      <Col xs="3">
        <Form onSubmit={(e) => e.preventDefault()}>
          <ButtonGroup className="order-details-quantity-group" size="sm">
            <Button
              onClick={() => handleSelectFood(food, -1)}
              size="sm"
              color="warning"
            >
              -
            </Button>
            <Input
              type="number"
              min={doneQuantity}
              max="2000"
              value={quantity}
              className="order-details-quantity"
              onChange={({ target }) =>
                handleTypeOrderAmount(food, Number(target.value))
              }
            />
            <Button
              onClick={() => handleSelectFood(food, 1)}
              size="sm"
              color="warning"
            >
              +
            </Button>
          </ButtonGroup>
        </Form>
      </Col>
      <Col xs="1">
        <p className="text-center">{doneQuantity}</p>
      </Col>
      <Col xs="1">
        <Button disabled={doneQuantity > 0} outline size="sm" color="warning">
          <i title="Xóa món" className="fa fa-trash"></i>
        </Button>
      </Col>
    </Row>
  );
};

export default OrderDetail;
