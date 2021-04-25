import React, { useState } from "react";

import { Modal, ModalBody, ModalFooter, Form, Button } from "reactstrap";

import violationApi from "../../../api/violationApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

const ADD_SCHEMA = { name: "", finesPercent: 0 };
const FEEDBACK_SCHEMA = { name: "", finesPercent: "" };

const AddViolationModal = ({ show, toggle, handleAddViolation }) => {
  const [data, setData] = useState(ADD_SCHEMA);
  const [feedback, setFeedback] = useState(FEEDBACK_SCHEMA);

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedback(FEEDBACK_SCHEMA);
      const res = await violationApi.create({
        name: data.name,
        finesPercent: Number(data.finesPercent),
      });
      handleAddViolation(res.data);
      toastSuccess("Tạo vi phạm thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedback(ex.response.data);
      toastError("Tạo vi phạm thất bại");
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalCustomHeader toggle={toggle}>Thêm vi phạm</ModalCustomHeader>
        <ModalBody className="bg-white">
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Tên vi phạm"
            name="name"
            value={data.name}
            feedback={feedback.name}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            type="number"
            min="0"
            max="100"
            step="1"
            label="Mức phạt theo ca (%)"
            name="finesPercent"
            value={data.finesPercent}
            feedback={feedback.finesPercent}
          />
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
