import React, { useState, useEffect } from "react";
import { Button, Card, CardTitle, CardText, ButtonGroup } from "reactstrap";
import { getMinuteDifference } from "../../../utils/dateUtils";

import "./ChefOrderDisplay.scss";

const ChefOrderDisplay = ({ order, handleSubmit }) => {
  const [done, setDone] = useState(2000);

  useEffect(() => {
    const newRemains = getRemains(order);
    setDone((prev) => (prev < newRemains ? prev : newRemains));
  }, [order]);

  const handleClickDone = () => {
    handleSubmit({
      billId: order.billId,
      foodId: order.food.id,
      processQuantity: done,
    });
  };

  const minutesAgo = getMinuteDifference(order.lastOrderTime);

  const color =
    minutesAgo < 15 ? "success" : minutesAgo < 30 ? "warning" : "danger";

  const iconClass =
    minutesAgo < 15
      ? "fa-hourglass-start"
      : minutesAgo < 30
      ? "fa-hourglass-half"
      : "fa-hourglass-end";

  const remains = getRemains(order);

  return (
    <Card body inverse color={color} className="chef-order-display">
      <CardTitle tag="h5" className="chef-order-display-header">
        {order.food.name} x {remains}
      </CardTitle>
      <CardText className="chef-order-display-meta">
        <span>
          <i className={"fas " + iconClass}></i> {minutesAgo} phút trước
        </span>
        <span>Bàn {order.table}</span>
      </CardText>
      <ButtonGroup className="chef-order-display-btn-group">
        <Button
          disabled={done === 0}
          onClick={() => setDone(done - 1)}
          color="light"
        >
          -
        </Button>
        <Button disabled={done === 0} onClick={handleClickDone} color="light">
          Xong {done}/{remains}
        </Button>
        <Button
          disabled={done >= remains}
          onClick={() => setDone(done + 1)}
          color="light"
        >
          +
        </Button>
      </ButtonGroup>
    </Card>
  );
};

function getRemains(order) {
  return order.quantity - order.doneQuantity;
}

export default ChefOrderDisplay;
