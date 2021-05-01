import React, { useState, useRef } from "react";
import ReactToPrint from "react-to-print";

import {
  Modal,
  ModalBody,
  Form,
  Input,
  FormGroup,
  Label,
  Button,
  Col,
  Row,
} from "reactstrap";
import { formatVnd, getBillRawCost } from "../../../utils/moneyUtils";
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";
import PaymentInput from "./PaymentInput/PaymentInput";

import "./PaymentModal.scss";
import PrintableBill from "./PrintableBill/PrintableBill";

const PaymentModal = ({
  show,
  toggle,
  currentTable,
  bill = {},
  handleChangePaymentInfo,
  handleSavePayment,
  handleDoPayment,
}) => {
  const [takeIn, setTakeIn] = useState(0);

  const printerRef = useRef();

  const rawCost = show ? getBillRawCost(bill) : 0;

  const totalCost = rawCost + bill.surcharge - bill.discount;

  const shouldSave = bill.unsaved || !bill.lastPrice;

  const hasUnfinishedFood =
    bill.billDetails?.length &&
    bill.billDetails.some(
      ({ quantity, doneQuantity }) => doneQuantity < quantity
    );

  const doToggle = () => {
    toggle();
    setTakeIn(0);
  };

  return (
    <Modal
      className="modal-full-screen modal-dialog-scrollable"
      isOpen={show}
      toggle={doToggle}
    >
      <ModalHeaderWithCloseBtn toggle={doToggle}>
        Thanh toán {currentTable.name}
      </ModalHeaderWithCloseBtn>
      {show && (
        <ModalBody className="bg-white">
          <Row>
            <Col md="6" sm="12">
              <Form onSubmit={handleSavePayment}>
                <FormGroup className="payment-form-group">
                  <Label>Tổng giá trị</Label>
                  <span>{formatVnd(rawCost)}</span>
                </FormGroup>
                <FormGroup className="payment-form-group">
                  <Label>Phụ thu</Label>
                  <div>
                    <PaymentInput
                      title="Tiền phụ thu"
                      value={bill.surcharge}
                      name="surcharge"
                      max={rawCost}
                      onChange={handleChangePaymentInfo}
                    />
                    <span>{formatVnd(bill.surcharge)}</span>
                  </div>
                </FormGroup>

                <FormGroup className="payment-form-group">
                  <Label>Giảm giá</Label>
                  <div>
                    <PaymentInput
                      title="Tiền giảm giá"
                      value={bill.discount}
                      name="discount"
                      max={rawCost}
                      onChange={handleChangePaymentInfo}
                    />
                    <span>{formatVnd(bill.discount)}</span>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label>Chi tiết giảm giá</Label>
                  <Input
                    onChange={({ target }) => handleChangePaymentInfo(target)}
                    label="Chi tiết giảm giá"
                    name="discountDescription"
                    value={bill.discountDescription}
                    type="textarea"
                  />
                </FormGroup>
                <hr />
                <FormGroup className="payment-form-group">
                  <strong>Tổng cộng</strong>
                  <strong>{formatVnd(totalCost)}</strong>
                </FormGroup>
                <FormGroup className="payment-form-group">
                  <Label>Khách đưa</Label>
                  <div className="d-flex justify-content-end align-items-center">
                    <Input
                      name="takeIn"
                      className="payment-take-in"
                      type="number"
                      value={takeIn}
                      onChange={(e) => setTakeIn(Number(e.target.value))}
                    ></Input>
                    ₫
                  </div>
                </FormGroup>
                <FormGroup className="payment-form-group">
                  <Label>Thối lại</Label>
                  <span>
                    {formatVnd(Math.max(totalCost, Number(takeIn)) - totalCost)}
                  </span>
                </FormGroup>
                <div className="payment-btn-group">
                  <Button
                    block
                    disabled={!shouldSave}
                    className="payment-save"
                    type="submit"
                    color="primary"
                  >
                    <i className="fas fa-book"></i> Lưu thông tin
                  </Button>
                  <ReactToPrint
                    trigger={() => (
                      <Button
                        block
                        disabled={shouldSave}
                        className="payment-print"
                        color="dark"
                      >
                        <i className="fas fa-print"></i> In tạm tính
                      </Button>
                    )}
                    content={() => printerRef.current}
                  />

                  <Button
                    block
                    disabled={shouldSave || hasUnfinishedFood}
                    className="payment-process"
                    color="warning"
                    onClick={handleDoPayment}
                  >
                    <i className="fas fa-coins"></i> Xác nhận thanh toán
                  </Button>
                </div>

                {hasUnfinishedFood && (
                  <p className="text-center text-danger">
                    * Không thể thanh toán hóa đơn chưa ra hết món
                  </p>
                )}
              </Form>
            </Col>
            <Col md="6" sm="12">
              <PrintableBill
                {...bill}
                rawCost={rawCost}
                totalCost={totalCost}
                ref={printerRef}
              />
            </Col>
          </Row>
        </ModalBody>
      )}
    </Modal>
  );
};

export default PaymentModal;
