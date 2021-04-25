import classnames from "classnames";
import React, { useState, useEffect } from "react";

import {
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Row,
  Col,
} from "reactstrap";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";

import foodTypeApi from "../../../api/foodTypeApi";
import foodApi from "../../../api/foodApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";

const EditFoodModal = ({
  show,
  toggle,
  food,
  handleEditFood,
  handleDeleteFood,
}) => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("1");

  const [editInfo, setEditInfo] = useState({});
  const [editInfoFeedback, setEditInfoFeedback] = useState({});

  const [confirmDelete, setConfirmDelete] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setEditInfo({ ...food, foodTypeId: String(food.foodType.id) });
  }, [food]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleChangeEditInfo = ({ target }) => {
    setEditInfo({ ...editInfo, [target.name]: target.value });
  };

  const handleFileChangeEditInfo = ({ target }) => {
    const file = target.files[0];
    const name = target.name;
    if (file.size >= 10485760) {
      setEditInfoFeedback({
        ...editInfoFeedback,
        [name]:
          "Kích thước hình ảnh không được quá 10MB, vui lòng chọn file khác",
      });
    } else {
      setEditInfo({ ...editInfo, [name]: file });
      setEditInfoFeedback({ ...editInfoFeedback, [name]: "" });
    }
  };

  const handleSubmitEditInfo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await foodApi.update(editInfo);
      handleEditFood(res.data);
      setEditInfo({ ...editInfo, imageUrl: res.data.imageUrl });
      setEditInfoFeedback({});
      toastSuccess("Cập nhật thông tin thành công");
    } catch (ex) {
      setEditInfoFeedback(ex.response.data);
      toastError("Cập nhật thông tin thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeConfirmDelete = ({ target }) => {
    setConfirmDelete(target.value);
  };

  const handleSubmitDeleteFood = async (e) => {
    e.preventDefault();
    try {
      await foodApi.softDelete(food.id);
      handleDeleteFood(food.id);
      toastSuccess("Khóa món ăn thành công");
      toggle();
      setConfirmDelete("");
    } catch (ex) {
      toastError("Khóa món ăn thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal isOpen={show} className="modal-lg modal-dialog" toggle={toggle}>
      <ModalCustomHeader toggle={toggle}>Chi tiết món ăn</ModalCustomHeader>
      <ModalBody className="bg-white">
        <Nav tabs className="bg-light">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggleTab("1")}
            >
              Thông tin chung
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggleTab("2")}
            >
              Khóa món ăn
            </NavLink>
          </NavItem>
        </Nav>
        {/* THONG TIN CHUNG */}
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Form onSubmit={handleSubmitEditInfo}>
                  <h4>Thông tin chung</h4>
                  <CustomInputGroup
                    required
                    onChange={handleChangeEditInfo}
                    label="Tên món"
                    name="name"
                    value={editInfo.name}
                    feedback={editInfoFeedback.name}
                  />
                  <CustomInputGroup
                    required
                    onChange={handleChangeEditInfo}
                    type="number"
                    label="Giá (₫)"
                    name="price"
                    value={editInfo.price}
                    feedback={editInfoFeedback.price}
                  />
                  <CustomInputGroup
                    required
                    onChange={handleChangeEditInfo}
                    label="Đơn vị"
                    name="unit"
                    value={editInfo.unit}
                    feedback={editInfoFeedback.unit}
                  />
                  <CustomInputGroup
                    onChange={handleChangeEditInfo}
                    label="Loại món"
                    type="select"
                    name="foodTypeId"
                    value={editInfo.foodTypeId}
                    feedback={editInfoFeedback.foodTypeId}
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
                    onChange={handleFileChangeEditInfo}
                    type="file"
                    label="Đổi hình ảnh"
                    name="image"
                    feedback={editInfoFeedback.image}
                    accept="image/*"
                  />
                  <div className="d-flex justify-content-center">
                    <img
                      src={editInfo.imageUrl}
                      alt="current food"
                      height="200"
                    />
                  </div>
                  <br />
                  <Button
                    disabled={loading}
                    type="submit"
                    color="warning"
                    block
                  >
                    {loading ? "Đang gửi yêu cầu..." : "Cập nhật"}
                  </Button>
                </Form>
              </Col>
            </Row>
          </TabPane>

          {/* KHOA MON AN */}
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <h4>Khóa món ăn</h4>
                <p>Món ăn bị khóa có thể khôi phục ở cuối phần quản lý</p>
                <Form onSubmit={handleSubmitDeleteFood}>
                  <FormGroup>
                    <Label for="confirmDelete">
                      Nhập <strong>{food.name}</strong> và bấm xác nhận để khóa
                    </Label>
                    <Input
                      required
                      onChange={handleChangeConfirmDelete}
                      name="confirmDelete"
                      value={confirmDelete}
                      placeholder={food.name}
                    />
                  </FormGroup>
                  <Button
                    disabled={confirmDelete !== food.name || loading}
                    type="submit"
                    color="danger"
                    block
                  >
                    Xác nhận
                  </Button>
                </Form>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </ModalBody>
    </Modal>
  );
};

export default EditFoodModal;
