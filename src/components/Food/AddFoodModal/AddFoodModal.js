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
  const [loading, setLoading] = useState(false);

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

  const resetAndDoToggle = () => {
    setFeedback(INITIAL_FEEDBACK);
    toggle();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(INITIAL_FEEDBACK);
    setLoading(true);

    try {
      const res = await foodApi.create(data);
      handleAddFood(res.data);
      toastSuccess("Thêm món thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedback({ ...feedback, ...ex.response.data });
      toastError("Đã có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleFileChange = ({ target }) => {
    const file = target.files[0];
    const name = target.name;
    if (file.size >= 10485760) {
      setFeedback({
        ...feedback,
        [name]:
          "Kích thước hình ảnh không được quá 10MB, vui lòng chọn file khác",
      });
    } else {
      setData({ ...data, [name]: file });
      setFeedback({ ...feedback, [name]: "" });
    }
  };

  return (
    <Modal isOpen={show} toggle={resetAndDoToggle}>
      <Form onSubmit={handleSubmit}>
        <ModalCustomHeader toggle={resetAndDoToggle}>
          Thêm món ăn
        </ModalCustomHeader>
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
            label="Giá (₫)"
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
            accept="image/*"
          />
        </ModalBody>
        <ModalFooter>
          <Button disabled={loading} color="light" onClick={resetAndDoToggle}>
            Hủy
          </Button>{" "}
          <Button
            disabled={loading || Boolean(feedback.image)}
            color="warning"
            type="submit"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddFoodModal;
