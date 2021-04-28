import React, { useState } from "react";

import { Modal, ModalBody, ModalFooter, Form, Button } from "reactstrap";

import areaApi from "../../../../api/areaApi";
import { toastError, toastSuccess } from "../../../../utils/toastUtils";
import ModalHeaderWithCloseBtn from "../../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";
import CustomInputGroup from "../../../CustomInputGroup/CustomInputGroup";

const ADD_SCHEMA = { name: "" };
const FEEDBACK_SCHEMA = { name: "" };

const AddAreaModal = ({ show, toggle, handleAddArea }) => {
  const [data, setData] = useState(ADD_SCHEMA);
  const [feedback, setFeedback] = useState(FEEDBACK_SCHEMA);

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedback(FEEDBACK_SCHEMA);
      const res = await areaApi.create(data);
      handleAddArea(res.data);
      toastSuccess("Tạo khu vực thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedback(ex.response.data);
      toastError("Tạo khu vực thất bại");
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalHeaderWithCloseBtn toggle={toggle}>
          Thêm khu vực
        </ModalHeaderWithCloseBtn>
        <ModalBody className="bg-white">
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Tên khu vực"
            name="name"
            value={data.name}
            feedback={feedback.name}
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

export default AddAreaModal;
