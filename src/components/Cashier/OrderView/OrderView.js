import React from "react";
import { Col, Row } from "reactstrap";

import "./OrderView.scss";

const OrderView = ({ table, bill = {} }) => {
  return (
    <div className="bg-white order-container flex-container">
      <div className="order-header">
        <Row>
          <Col xs="3" className="order-table">
            <span>Bàn</span>
            <h2>{table.name}</h2>
          </Col>
          <Col xs="9">lorem ipsum</Col>
        </Row>
      </div>
      <div className="flex-body px-2">
        <div className="flex-scrollable">body</div>
      </div>
      <div className="flex-footer">footer</div>
    </div>
  );
};

export default OrderView;
