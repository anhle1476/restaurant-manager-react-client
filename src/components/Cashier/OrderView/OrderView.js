import React from "react";
import { Badge, Button, Col, Row } from "reactstrap";
import OrderDetail from "./OrderDetail/OrderDetail";

import { formatDateTime } from "../../../utils/dateUtils";

import "./OrderView.scss";
import { formatVnd, getBillRawCost } from "../../../utils/moneyUtils";
import DeleteConfirmModal from "../../DeleteConfirmModal/DeleteConfirmModal";
import { useState } from "react";

const MODAL_SCHEMA = {
  DELETE_MODAL: false,
};

const OrderView = ({
  table,
  bill = {},
  handleClickOrderAmount,
  handleTypeOrderAmount,
  handleDeleteOrderDetail,
  handleSaveBill,
  handleDeleteBill,
}) => {
  const [showModal, setShowModal] = useState(MODAL_SCHEMA);

  const toggleModal = (modal) => {
    setShowModal({ ...showModal, [modal]: !showModal[modal] });
  };

  const total = getBillRawCost(bill);

  const hasBillDetails = Boolean(bill.billDetails?.length);

  const chefHasNotDoAnything =
    hasBillDetails &&
    !bill.billDetails.some(({ doneQuantity }) => doneQuantity > 0);

  const canNotDeleteBill =
    Boolean(bill.changed) || !hasBillDetails || !chefHasNotDoAnything;

  const hasUndoneFood =
    hasBillDetails &&
    bill.billDetails.some(
      ({ quantity, doneQuantity }) => quantity !== doneQuantity
    );

  const canNotDoPayment =
    Boolean(bill.changed) || !hasBillDetails || hasUndoneFood;

  return (
    <>
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
        <div className="flex-body order-body">
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
            ) : !hasBillDetails ? (
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
        {total !== 0 && (
          <div className="order-total">
            <span>Tổng giá trị:</span>
            <span>
              {chefHasNotDoAnything ? (
                <Badge color="danger">Chưa ra món nào</Badge>
              ) : hasUndoneFood ? (
                <Badge color="warning">Chưa ra hết món</Badge>
              ) : (
                <Badge color="success">Đã ra hết món</Badge>
              )}{" "}
              {formatVnd(total)}
            </span>
          </div>
        )}
        <div className="flex-footer order-footer">
          <Button
            block
            disabled={!bill.id || bill.changed}
            color="dark"
            className="text-white order-grouping"
          >
            <i className="fas fa-chair"></i> Gộp bàn
          </Button>
          <Button
            block
            disabled={!bill.id || bill.changed}
            color="info"
            className="order-moving"
          >
            <i className="fa fa-arrows-alt"></i> Chuyển bàn
          </Button>
          <Button
            block
            size="lg"
            disabled={!(hasBillDetails && Boolean(bill.changed))}
            color="primary"
            className="order-update"
            onClick={handleSaveBill}
          >
            <i className="fas fa-book"></i> Lưu
          </Button>
          <Button
            block
            color="danger"
            disabled={canNotDeleteBill}
            className="order-delete"
            onClick={() => toggleModal("DELETE_MODAL")}
          >
            <i className="fas fa-trash"></i> Xóa hóa đơn
          </Button>
          <Button
            block
            disabled={canNotDoPayment}
            color="warning"
            className="order-payment text-white"
          >
            <i className="fas fa-coins"></i> Thanh toán
          </Button>
        </div>
      </div>
      <DeleteConfirmModal
        show={showModal.DELETE_MODAL}
        toggle={() => toggleModal("DELETE_MODAL")}
        handleDelete={handleDeleteBill}
        confirm={`Bàn ${table.name}`}
        title="Xóa hóa đơn"
      />
    </>
  );
};

export default OrderView;
