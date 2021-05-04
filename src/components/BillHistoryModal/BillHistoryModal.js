import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";

import { getBillRawCost } from "../../utils/moneyUtils";
import PrintableBill from "../Cashier/PaymentModal/PrintableBill/PrintableBill";
import ModalHeaderWithCloseBtn from "../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

const BillHistoryModal = ({ show, toggle, bill }) => {
  const printerRef = useRef();

  return (
    <Modal
      className="modal-lg modal-dialog-scrollable"
      isOpen={show}
      toggle={toggle}
    >
      <ModalHeaderWithCloseBtn toggle={toggle}>
        Hóa đơn {bill.id}
      </ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white">
        <PrintableBill
          {...bill}
          ref={printerRef}
          rawCost={getBillRawCost(bill)}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={toggle}>
          Hủy
        </Button>
        <ReactToPrint
          trigger={() => (
            <Button color="warning">
              <i className="fas fa-print mr-2"></i> In hóa đơn
            </Button>
          )}
          content={() => printerRef.current}
        />
      </ModalFooter>
    </Modal>
  );
};

export default BillHistoryModal;
