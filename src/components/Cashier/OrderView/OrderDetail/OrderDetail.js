import React from "react";
import { Button, ButtonGroup, Col, Form, Input, Row } from "reactstrap";
import { getMinuteDifference } from "../../../../utils/dateUtils";

import "./OrderDetail.scss";

const OrderDetail = ({
  food,
  quantity,
  doneQuantity,
  lastOrderTime,
  handleClickOrderAmount,
  handleTypeOrderAmount,
  handleDeleteOrderDetail,
}) => {
  const minuteDiff = lastOrderTime ? getMinuteDifference(lastOrderTime) : 0;
  const clockColor =
    minuteDiff < 15
      ? "success fa-hourglass-start"
      : minuteDiff < 30
      ? "warning fa-hourglass-half"
      : "danger fa-hourglass-end";
  return (
    <Row className="order-details">
      <Col xs="5" title={food.name} className="food-name">
        <span>
          {food.name}
          {food.foodType.refundable && (
            <i
              className="fas fa-undo-alt text-secondary pl-2"
              title="Món trả được"
            ></i>
          )}
          {lastOrderTime && quantity > doneQuantity && (
            <i
              className={`fas pl-2 text-${clockColor}`}
              title={minuteDiff + " phút trước"}
            ></i>
          )}
          {!food.available && (
            <i className="fas fa-ban pl-2 text-danger" title="Hết hàng"></i>
          )}
        </span>
      </Col>
      <Col xs="2">
        <small>{food.price}₫</small>
      </Col>
      <Col xs="3">
        <Form onSubmit={(e) => e.preventDefault()}>
          <ButtonGroup className="order-details-quantity-group" size="sm">
            <Button
              onClick={() => handleClickOrderAmount(food, -1)}
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
              onClick={() => handleClickOrderAmount(food, 1)}
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
        <Button
          disabled={doneQuantity > 0}
          onClick={() => handleDeleteOrderDetail(food.id)}
          outline
          size="sm"
          color="warning"
        >
          <i title="Xóa món" className="fas fa-trash"></i>
        </Button>
      </Col>
    </Row>
  );
};

export default OrderDetail;
