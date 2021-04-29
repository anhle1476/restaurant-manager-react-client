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

const DeleteConfirmModal = ({
  show,
  toggle,
  confirm = "Xóa",
  handleDelete,
  title = "Xác nhận xóa",
}) => {
  const [confirmDelete, setConfirmDelete] = useState("");

  const handleChangeConfirmDelete = ({ target }) => {
    setConfirmDelete(target.value);
  };

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    handleDelete();
    toggle();
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <ModalHeaderWithCloseBtn toggle={toggle}>{title}</ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white">
        <Row>
          <Col sm="12">
            <Form onSubmit={handleSubmitDelete}>
              <FormGroup>
                <Label for="confirmDelete">
                  Nhập <strong>{confirm}</strong> và bấm xác nhận để xóa
                </Label>
                <Input
                  required
                  onChange={handleChangeConfirmDelete}
                  name="confirmDelete"
                  value={confirmDelete}
                  placeholder={confirm}
                />
              </FormGroup>
              <Button
                disabled={confirmDelete !== confirm}
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

export default DeleteConfirmModal;
