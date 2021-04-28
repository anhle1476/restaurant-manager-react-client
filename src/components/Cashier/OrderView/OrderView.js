import React from "react";
import { Button, Col, Form, Input, Row } from "reactstrap";
import ButtonGroup from "reactstrap/lib/ButtonGroup";

import "./OrderView.scss";

const OrderView = ({ table, bill = {} }) => {
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
              <span>{bill.startTime ? bill.startTime : "Chưa có"}</span>
            </div>
            <div className="order-meta">
              <span>Mã hóa đơn:</span>
              <span>{bill.id ? bill.id : "Chưa có"}</span>
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
            bill.billDetails.map(
              ({ food, quantity, doneQuantity, lastOrderTime }) => (
                <Row className="order-details">
                  <Col xs="5" title="Tên món" className="food-name">
                    <span>
                      {food.name}
                      {lastOrderTime && (
                        <i
                          className="fa fa-clock ml-2"
                          title={lastOrderTime}
                        ></i>
                      )}
                    </span>
                  </Col>
                  <Col xs="2">
                    <small>{food.price}</small>
                  </Col>
                  <Col xs="3">
                    <Form onSubmit={(e) => e.preventDefault()}>
                      <ButtonGroup
                        className="order-details-quantity-group"
                        size="sm"
                      >
                        <Button size="sm" color="warning">
                          -
                        </Button>
                        <Input
                          type="number"
                          min={doneQuantity}
                          max="2000"
                          value={quantity}
                          className="order-details-quantity"
                        />
                        <Button size="sm" color="warning">
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
                      outline
                      size="sm"
                      color="warning"
                    >
                      <i title="Xóa món" className="fa fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              )
            )
          )}
        </div>
      </div>
      <div className="flex-footer">footer</div>
    </div>
  );
};

export default OrderView;
