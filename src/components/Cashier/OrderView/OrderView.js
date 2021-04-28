import React from "react";
import { Button, Col, Row } from "reactstrap";
import OrderDetail from "./OrderDetail/OrderDetail";

import { formatDateTime } from "../../../utils/dateUtils";

import "./OrderView.scss";

const OrderView = ({
  table,
  bill = {},
  handleClickOrderAmount,
  handleTypeOrderAmount,
  handleDeleteOrderDetail,
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
        <div className="flex-scrollable">
          <Row className="order-details order-details-header">
            <Col xs="5">Món</Col>
            <Col xs="2">Giá</Col>
            <Col xs="3">Số lượng</Col>
            <Col xs="1">Đã ra</Col>
            <Col xs="1"></Col>
          </Row>
          {bill.billDetails === undefined ? (
            <p className="text-center mt-3">Bàn đang trống</p>
          ) : !bill.billDetails.length ? (
            <p className="text-center mt-3">
              Chọn món trong mục menu để thêm vào hóa đơn
            </p>
          ) : (
            bill.billDetails.map((detail, i) => (
              <OrderDetail
                handleClickOrderAmount={handleClickOrderAmount}
                handleTypeOrderAmount={handleTypeOrderAmount}
                handleDeleteOrderDetail={handleDeleteOrderDetail}
                key={i}
                {...detail}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex-footer order-footer">
        <Button block color="primary" className="order-grouping">
          <i className="fas fa-chair"></i> Gộp bàn
        </Button>
        <Button block color="primary" className="order-moving">
          <i className="fa fa-arrows-alt"></i> move
        </Button>
        <Button block color="info" className="order-update">
          update
        </Button>
        <Button block color="danger" className="order-delete">
          delete
        </Button>
        <Button block color="primary" className="order-payment">
          pay
        </Button>
      </div>
    </div>
  );
};

export default OrderView;
