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

import foodTypeApi from "../../../api/foodTypeApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

const ADD_SCHEMA = { name: "", refundable: false };
const FEEDBACK_SCHEMA = { name: "" };

const AddFoodTypeModal = ({ show, toggle, handleAddFoodType }) => {
  const [data, setData] = useState(ADD_SCHEMA);
  const [feedback, setFeedback] = useState(FEEDBACK_SCHEMA);

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedback(FEEDBACK_SCHEMA);
      const res = await foodTypeApi.create({
        ...data,
        refundable: Boolean(data.refundable),
      });
      handleAddFoodType(res.data);
      toastSuccess("Tạo loại món thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedback(ex.response.data);
      toastError("Tạo loại món thất bại");
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalCustomHeader toggle={toggle}>Thêm loại món</ModalCustomHeader>
        <ModalBody className="bg-white">
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Tên loại món"
            name="name"
            value={data.name}
            feedback={feedback.name}
          />
          <FormGroup check>
            <Input
              onChange={handleChange}
              type="checkbox"
              name="refundable"
              value={data.refundable}
            />
            <Label check for="refundable">
              Được hoàn trả món đã ra
            </Label>
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

export default AddFoodTypeModal;
