import React, { useState } from "react";

import {
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";

import roleApi from "../../api/roleApi";
import { toastError, toastSuccess } from "../../utils/toastUtils";
import ModalCustomHeader from "../ModalCustomHeader/ModalCustomHeader";

const ADD_SCHEMA = { name: "", code: "MISC" };
const FEEDBACK_SCHEMA = { name: "" };

const AddRoleModal = ({ show, toggle, handleAddRole }) => {
  const [data, setData] = useState(ADD_SCHEMA);
  const [feedBack, setFeedBack] = useState(FEEDBACK_SCHEMA);

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedBack(FEEDBACK_SCHEMA);
      const res = await roleApi.create(data);
      handleAddRole(res.data);
      toastSuccess("Tạo chức vụ thành công");
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedBack(ex.response.data);
      toastError("Tạo chức vụ thất bại");
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalCustomHeader toggle={toggle}>Thêm chức vụ</ModalCustomHeader>
        <ModalBody className="bg-white">
          <FormGroup>
            <Label for="name">Tên chức vụ</Label>
            <Input
              required
              onChange={handleChange}
              name="name"
              value={data.name}
              invalid={feedBack.name !== ""}
            />
            <FormFeedback>{feedBack.name}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="code">Mã</Label>
            <Input disabled max="20000000" value="MISC" />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggle}>
            Hủy
          </Button>{" "}
          <Button color="warning" type="submit">
            Lưu
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddRoleModal;
