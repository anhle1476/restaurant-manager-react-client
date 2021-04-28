import React, { useState } from "react";

import { Modal, ModalBody, ModalFooter, Form, Button } from "reactstrap";

import tableApi from "../../../../api/tableApi";
import { toastError, toastSuccess } from "../../../../utils/toastUtils";
import ModalHeaderWithCloseBtn from "../../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";
import CustomInputGroup from "../../../CustomInputGroup/CustomInputGroup";

const ADD_SCHEMA = { name: "" };
const FEEDBACK_SCHEMA = { name: "", area: "" };

const AddAreaModal = ({ show, toggle, currentArea, handleAddTable }) => {
  const [data, setData] = useState(ADD_SCHEMA);
  const [feedback, setFeedback] = useState(FEEDBACK_SCHEMA);

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedback(FEEDBACK_SCHEMA);
      const res = await tableApi.create({ ...data, area: currentArea });
      handleAddTable(res.data);
      toastSuccess("Tạo bàn thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedback(ex.response.data);
      toastError("Tạo bàn thất bại");
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalHeaderWithCloseBtn toggle={toggle}>
          Thêm bàn
        </ModalHeaderWithCloseBtn>
        <ModalBody className="bg-white">
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Tên bàn"
            name="name"
            value={data.name}
            feedback={feedback.name}
          />
          <CustomInputGroup
            disabled
            required
            onChange={(e) => e.preventDefault()}
            label="Khu vực"
            name="area"
            value={currentArea.name}
            feedback={feedback.area}
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
