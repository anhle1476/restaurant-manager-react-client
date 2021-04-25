import React, { useState } from "react";

import {
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

import roleApi from "../../../api/roleApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";

const ADD_SCHEMA = { name: "", code: "MISC" };
const FEEDBACK_SCHEMA = { name: "" };

const AddRoleModal = ({ show, toggle, handleAddRole }) => {
  const [data, setData] = useState(ADD_SCHEMA);
  const [feedback, setFeedback] = useState(FEEDBACK_SCHEMA);

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedback(FEEDBACK_SCHEMA);
      const res = await roleApi.create(data);
      handleAddRole(res.data);
      toastSuccess("Tạo chức vụ thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedback(ex.response.data);
      toastError("Tạo chức vụ thất bại");
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalCustomHeader toggle={toggle}>Thêm chức vụ</ModalCustomHeader>
        <ModalBody className="bg-white">
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Tên chức vụ"
            name="name"
            value={data.name}
            feedback={feedback.name}
          />
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
