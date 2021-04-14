import classnames from "classnames";
import React, { useState, useEffect } from "react";

import {
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Row,
  Col,
} from "reactstrap";
import ModalCustomHeader from "../ModalCustomHeader/ModalCustomHeader";

import roleApi from "../../api/roleApi";
import staffApi from "../../api/staffApi";
import { toastError, toastSuccess } from "../../utils/toastUtils";

const EditStaffModal = ({ show, toggle, staff, handleEditStaff }) => {
  const [roles, setRoles] = useState([]);
  const [editInfo, setEditInfo] = useState({});
  const [editInfoFeedback, setEditInfoFeedback] = useState({});
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await roleApi.getAll();
        setRoles(res.data);
      } catch (ex) {
        console.log(ex);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setEditInfo(staff);
  }, [staff]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleChangeEditInfo = ({ target }) => {
    setEditInfo({ ...editInfo, [target.name]: target.value });
  };

  const handleSubmitEditInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await staffApi.update(editInfo);
      handleEditStaff(res.data);
      setEditInfoFeedback({});
      toastSuccess("Cập nhật thông tin thành công");
    } catch (ex) {
      setEditInfoFeedback(ex.response.data);
      toastError("Cập nhật thông tin thất bại, vui lòng thử lại");
    }
  };

  return (
    <Modal isOpen={show} className="modal-lg modal-dialog" toggle={toggle}>
      <ModalCustomHeader toggle={toggle}>Chi tiết nhân viên</ModalCustomHeader>
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
              Cấp lại mật khẩu
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => toggleTab("3")}
            >
              Khóa tài khoản
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Form onSubmit={handleSubmitEditInfo}>
                  <h4>Thông tin chung</h4>
                  <FormGroup>
                    <Label for="username">Tên tài khoản</Label>
                    <Input
                      disabled
                      required
                      name="username"
                      value={editInfo.username}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="fullname">Họ và tên</Label>
                    <Input
                      required
                      onChange={handleChangeEditInfo}
                      name="fullname"
                      value={editInfo.fullname}
                      invalid={Boolean(editInfoFeedback.fullname)}
                    />
                    <FormFeedback>{editInfoFeedback.fullname}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="phoneNumber">Số điện thoại</Label>
                    <Input
                      required
                      onChange={handleChangeEditInfo}
                      name="phoneNumber"
                      value={editInfo.phoneNumber}
                      invalid={Boolean(editInfoFeedback.phoneNumber)}
                    />
                    <FormFeedback>{editInfoFeedback.phoneNumber}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="role">Chức vụ</Label>
                    <Input
                      required
                      type="select"
                      onChange={handleChangeEditInfo}
                      name="role"
                      value={editInfo.role}
                      invalid={Boolean(editInfoFeedback.role)}
                    >
                      <option disabled value="">
                        --- Chọn chức vụ ---
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>{editInfoFeedback.role}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="salaryPerShift">Lương/Ca</Label>
                    <Input
                      required
                      onChange={handleChangeEditInfo}
                      type="number"
                      name="salaryPerShift"
                      min="0"
                      max="20000000"
                      value={editInfo.salaryPerShift}
                      invalid={Boolean(editInfoFeedback.salaryPerShift)}
                    />
                    <FormFeedback>
                      {editInfoFeedback.salaryPerShift}
                    </FormFeedback>
                  </FormGroup>
                  <Button type="submit" color="warning" block>
                    Cập nhật
                  </Button>
                </Form>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Form>
                  <h4>Cấp lại mật khẩu</h4>
                </Form>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <h4>Khóa tài khoản</h4>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </ModalBody>
    </Modal>
  );
};

export default EditStaffModal;
