import React, { useState } from "react";

import {
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import ModalHeaderWithCloseBtn from "../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

const ConfirmModal = ({
  show,
  toggle,
  confirm = "Xóa",
  onAccept,
  title = "Xác nhận xóa",
}) => {
  const [confirmInput, setConfirmInput] = useState("");

  const handleChangeConfirmInput = ({ target }) => {
    setConfirmInput(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAccept();
    toggle();
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <ModalHeaderWithCloseBtn toggle={toggle}>{title}</ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white">
        <Row>
          <Col sm="12">
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="confirmInput">
                  Nhập <strong>{confirm}</strong> và bấm xác nhận để thực hiện
                </Label>
                <Input
                  required
                  onChange={handleChangeConfirmInput}
                  name="confirmInput"
                  value={confirmInput}
                  placeholder={confirm}
                />
              </FormGroup>
              <Button
                disabled={confirmInput !== confirm}
                type="submit"
                color="danger"
                block
              >
                Xác nhận
              </Button>
            </Form>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmModal;
