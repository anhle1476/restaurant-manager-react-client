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

import violationApi from "../../../api/violationApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

const ADD_SCHEMA = { name: "", finesPercent: 0 };
const FEEDBACK_SCHEMA = { name: "", finesPercent: "" };

const AddViolationModal = ({ show, toggle, handleAddViolation }) => {
  const [data, setData] = useState(ADD_SCHEMA);
  const [feedBack, setFeedBack] = useState(FEEDBACK_SCHEMA);

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedBack(FEEDBACK_SCHEMA);
      const res = await violationApi.create({
        name: data.name,
        finesPercent: Number(data.finesPercent),
      });
      handleAddViolation(res.data);
      toastSuccess("Tạo vi phạm thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedBack(ex.response.data);
      toastError("Tạo vi phạm thất bại");
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalCustomHeader toggle={toggle}>Thêm vi phạm</ModalCustomHeader>
        <ModalBody className="bg-white">
          <FormGroup>
            <Label for="name">Tên vi phạm</Label>
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
            <Label for="finesPercent">Mức phạt theo ca (%)</Label>
            <Input
              required
              onChange={handleChange}
              type="number"
              min="0"
              max="100"
              step="1"
              name="finesPercent"
              value={data.finesPercent}
              invalid={feedBack.finesPercent !== ""}
            />
            <FormFeedback>{feedBack.finesPercent}</FormFeedback>
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

export default AddViolationModal;
