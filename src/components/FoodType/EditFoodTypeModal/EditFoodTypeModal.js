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
  Table,
} from "reactstrap";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";
import FoodStatusBadge from "../../Food/FoodStatusBadge/FoodStatusBadge";

import foodTypeApi from "../../../api/foodTypeApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";

const EDIT_INFO_SCHEMA = { id: 0, name: "", refundable: false };

const EditFoodTypeModal = ({
  show,
  toggle,
  foodType,
  handleUpdateFoodType,
  handleDeleteFoodType,
}) => {
  const [foods, setFoods] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [search, setSearch] = useState("");

  const [editInfo, setEditInfo] = useState(EDIT_INFO_SCHEMA);
  const [editInfoFeedback, setEditInfoFeedback] = useState({});

  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    if (!foodType.id || foodType.id === editInfo.id) return;
    setEditInfo(foodType?.id ? foodType : EDIT_INFO_SCHEMA);
    const fetchData = async () => {
      try {
        const res = await foodTypeApi.getAllFoodsByFoodTypeId(foodType.id);
        setFoods(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      }
    };
    fetchData();
  }, [foodType, editInfo.id]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  const handleChangeEditInfo = ({ target }) => {
    setEditInfo({ ...editInfo, [target.name]: target.value });
  };

  const handleToggleEditInfo = ({ target }) => {
    setEditInfo({ ...editInfo, [target.name]: !editInfo[target.name] });
  };

  const handleSubmitEditInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await foodTypeApi.update(editInfo);
      handleUpdateFoodType(res.data);
      toastSuccess("Thay đổi thông tin thành công");
    } catch (ex) {
      setEditInfoFeedback(ex.response.data);
      toastError("Thay đổi thông tin thất bại");
    }
  };

  const handleChangeConfirmDelete = ({ target }) => {
    setConfirmDelete(target.value);
  };

  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    try {
      await foodTypeApi.softDelete(foodType.id);
      handleDeleteFoodType(foodType.id);
      toastSuccess("Khóa loại món thành công");
      toggle();
      setConfirmDelete("");
    } catch (ex) {
      toastError("Khóa loại món thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  const searchFilter = ({ name }) =>
    name.toLowerCase().indexOf(search.toLowerCase()) !== -1;

  const isNoFood = foods.length === 0;

  return (
    <Modal
      isOpen={show}
      className="modal-lg modal-dialog-scrollable"
      toggle={toggle}
    >
      <ModalCustomHeader toggle={toggle}>Chi tiết loại món</ModalCustomHeader>
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
              Danh sách món
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => toggleTab("3")}
            >
              Khóa loại món
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
                    label="Tên loại món"
                    name="name"
                    value={editInfo.name}
                    feedback={editInfoFeedback.name}
                  />

                  <FormGroup check>
                    <Input
                      onChange={handleToggleEditInfo}
                      type="checkbox"
                      name="refundable"
                      checked={editInfo.refundable}
                    />
                    <Label for="refundable">Được hoàn trả món đã ra</Label>
                  </FormGroup>
                  <Button type="submit" color="warning" block>
                    Cập nhật
                  </Button>
                </Form>
              </Col>
            </Row>
          </TabPane>

          {/* DANH SACH CAC MON CUA LOAI MON */}
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <h4>Danh sách món</h4>

                <Form onSubmit={(e) => e.preventDefault()}>
                  <FormGroup>
                    <Input
                      type="search"
                      value={search}
                      placeholder="Tìm kiếm..."
                      onChange={handleSearch}
                    ></Input>
                  </FormGroup>
                </Form>
                <Table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Tên món</th>
                      <th>Giá (₫)</th>
                      <th>Đơn vị</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods
                      .filter(searchFilter)
                      .map(({ id, name, price, unit, imageUrl, available }) => (
                        <tr key={id}>
                          <th>
                            <img src={imageUrl} alt="food" height="50" />
                          </th>
                          <th>{name}</th>
                          <th>{price}</th>
                          <th>{unit}</th>
                          <th>
                            <FoodStatusBadge status={available} />
                          </th>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                {isNoFood && (
                  <p className="text-center">
                    Loại món này hiện chưa có món nào
                  </p>
                )}
              </Col>
            </Row>
          </TabPane>
          {/* KHOA LOAI MON */}
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <h4>Khóa loại món</h4>
                <p>Loại món bị khóa có thể khôi phục ở cuối phần quản lý</p>
                {!isNoFood && (
                  <p className="text-danger">
                    Đang tồn tại món ăn trong loại món này, không thể xóa
                  </p>
                )}
                <Form onSubmit={handleSubmitDelete}>
                  <FormGroup>
                    <Label for="confirmDelete">
                      Nhập <strong>{foodType.name}</strong> và bấm xác nhận để
                      khóa
                    </Label>
                    <Input
                      required
                      disabled={!isNoFood}
                      onChange={handleChangeConfirmDelete}
                      name="confirmDelete"
                      value={confirmDelete}
                      placeholder={foodType.name}
                    />
                  </FormGroup>
                  <Button
                    disabled={confirmDelete !== foodType.name || !isNoFood}
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

export default EditFoodTypeModal;
