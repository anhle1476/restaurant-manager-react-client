import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Form, Button } from "reactstrap";

import foodTypeApi from "../../../api/foodTypeApi";
import foodApi from "../../../api/foodApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";

const INITIAL_FEEDBACK = {
  name: "",
  price: "",
  unit: "",
  foodTypeId: "",
  image: "",
};

const ADD_SCHEMA = {
  name: "",
  price: 0,
  unit: "",
  foodTypeId: 0,
  image: null,
};

const AddFoodModal = ({ show, toggle, handleAddFood }) => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [data, setData] = useState(ADD_SCHEMA);

  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await foodTypeApi.getAll();
        setFoodTypes(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(INITIAL_FEEDBACK);

    const foodData = mapFoodData(data);
    try {
      const res = await foodApi.create(foodData);
      handleAddFood(res.data);
      toastSuccess("Thêm món thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedback({ ...feedback, ...ex.response.data });
      toastError("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleFileChange = ({ target }) => {
    setData({ ...data, [target.name]: target.files[0] });
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalCustomHeader toggle={toggle}>Thêm món ăn</ModalCustomHeader>
        <ModalBody className="bg-white">
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Tên món"
            name="name"
            value={data.name}
            feedback={feedback.name}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            type="number"
            label="Giá"
            name="price"
            value={data.price}
            feedback={feedback.price}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Đơn vị"
            name="unit"
            value={data.unit}
            feedback={feedback.unit}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Loại món"
            type="select"
            name="foodTypeId"
            value={data.foodTypeId}
            feedback={feedback.foodTypeId}
          >
            <option disabled value="">
              --- Chọn loại món ---
            </option>
            {foodTypes.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </CustomInputGroup>
          <CustomInputGroup
            required
            onChange={handleFileChange}
            type="file"
            label="Hình ảnh"
            name="image"
            feedback={feedback.image}
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

const mapFoodData = ({ name, price, unit, foodTypeId, image }) => {
  const form = new FormData();
  form.append("name", name);
  form.append("price", price);
  form.append("unit", unit);
  form.append("foodTypeId", foodTypeId);
  form.append("image", image);
  return form;
};

export default AddFoodModal;
