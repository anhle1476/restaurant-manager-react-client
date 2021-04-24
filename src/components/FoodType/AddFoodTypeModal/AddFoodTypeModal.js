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

import foodTypeApi from "../../../api/foodTypeApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

const ADD_SCHEMA = { name: "", refundable: false };
const FEEDBACK_SCHEMA = { name: "" };

const AddFoodTypeModal = ({ show, toggle, handleAddFoodType }) => {
  const [data, setData] = useState(ADD_SCHEMA);
  const [feedBack, setFeedBack] = useState(FEEDBACK_SCHEMA);

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedBack(FEEDBACK_SCHEMA);
      const res = await foodTypeApi.create({
        ...data,
        refundable: Boolean(data.refundable),
      });
      handleAddFoodType(res.data);
      toastSuccess("Tạo loại món thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedBack(ex.response.data);
      toastError("Tạo loại món thất bại");
    }
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalCustomHeader toggle={toggle}>Thêm loại món</ModalCustomHeader>
        <ModalBody className="bg-white">
          <FormGroup>
            <Label for="name">Tên loại món</Label>
            <Input
              required
              onChange={handleChange}
              name="name"
              value={data.name}
              invalid={feedBack.name !== ""}
            />
            <FormFeedback>{feedBack.name}</FormFeedback>
          </FormGroup>
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
