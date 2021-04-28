import React from "react";
import { Col, Row } from "reactstrap";
import OrderDetail from "./OrderDetail/OrderDetail";

import { formatDateTime } from "../../../utils/dateUtils";

import "./OrderView.scss";

const OrderView = ({
  table,
  bill = {},
  handleSelectFood,
  handleTypeOrderAmount,
}) => {
  return (
    <div className="bg-white order-container flex-container">
      <div className="order-header">
        <Row>
          <Col xs="4" className="order-table">
            <span>Bàn</span>
            <h2>{table.name}</h2>
          </Col>
          <Col xs="8">
            <h5 className="text-center">Nhà hàng Super Pig</h5>
            <div className="order-meta">
              <span>Khu vực:</span>
              <span>{table.area?.name}</span>
            </div>
            <div className="order-meta">
              <span>Giờ vào:</span>
              <span>
                {bill.startTime ? formatDateTime(bill.startTime) : "Chưa có"}
              </span>
            </div>
            <div className="order-meta">
              <span>Mã hóa đơn:</span>
              <span title={bill.id}>{bill.id ? bill.id : "Chưa có"}</span>
            </div>
          </Col>
        </Row>
      </div>
      <div className="flex-body">
        <Row className="order-details order-details-header">
          <Col xs="5">Món</Col>
          <Col xs="2">Giá</Col>
          <Col xs="3">Số lượng</Col>
          <Col xs="1">Đã ra</Col>
          <Col xs="1"></Col>
        </Row>
        <div className="flex-scrollable">
          {bill.billDetails === undefined ? (
            <p className="text-center mt-3">Bàn đang trống</p>
          ) : !bill.billDetails.length ? (
            <p className="text-center mt-3">
              Chọn món trong mục menu để thêm vào hóa đơn
            </p>
          ) : (
            bill.billDetails.map((detail, i) => (
              <OrderDetail
                handleSelectFood={handleSelectFood}
                handleTypeOrderAmount={handleTypeOrderAmount}
                key={i}
                {...detail}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex-footer">footer</div>
    </div>
  );
};

export default OrderView;
