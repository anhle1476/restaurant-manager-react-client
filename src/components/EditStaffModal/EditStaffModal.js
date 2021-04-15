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
  FormText,
} from "reactstrap";
import ModalCustomHeader from "../ModalCustomHeader/ModalCustomHeader";

import roleApi from "../../api/roleApi";
import staffApi from "../../api/staffApi";
import { toastError, toastSuccess } from "../../utils/toastUtils";

const REISSUE_PASSWORD_SCHEMA = {
  newPassword: "",
  confirmPassword: "",
};

const EditStaffModal = ({
  show,
  toggle,
  staff,
  handleEditStaff,
  handleDeleteStaff,
}) => {
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("1");

  const [editInfo, setEditInfo] = useState({});
  const [editInfoFeedback, setEditInfoFeedback] = useState({});

  const [reissuePassword, setReissuePassword] = useState(
    REISSUE_PASSWORD_SCHEMA
  );
  const [reissuePasswordFeedback, setReissuePasswordFeedback] = useState({});

  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await roleApi.getAll();
        setRoles(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
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

  const isAdmin = staff.role.code === "ADMIN";

  const handleChangeReissuePassword = ({ target }) => {
    setReissuePassword({ ...reissuePassword, [target.name]: target.value });
  };

  const handleSubmitReissuePassword = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = reissuePassword;
    if (confirmPassword !== newPassword || isAdmin) {
      setReissuePasswordFeedback({
        confirmPassword: "Mật khẩu không trùng khớp",
      });
      return;
    }
    try {
      await staffApi.reissuePassword({
        staffId: staff.id,
        newPassword: reissuePassword.newPassword,
      });
      setReissuePassword(REISSUE_PASSWORD_SCHEMA);
      setReissuePasswordFeedback({});
      toastSuccess("Cấp lại mật khẩu thành công");
    } catch (ex) {
      setReissuePasswordFeedback(ex.response.data);
      toastError("Cấp lại mật khẩu thất bại, vui lòng thử lại");
    }
  };

  const handleChangeConfirmDelete = ({ target }) => {
    setConfirmDelete(target.value);
  };

  const handleSubmitDeleteStaff = async (e) => {
    e.preventDefault();
    try {
      await staffApi.softDelete(staff.id);
      handleDeleteStaff(staff.id);
      toastSuccess("Khóa tài khoản thành công");
      toggle();
    } catch (ex) {
      console.log(ex.response.data);
      toastError("Khóa tài khoản thất bại, Vui lòng thử lại");
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
        {/* THONG TIN CHUNG */}
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
                    {editInfo.role === "1" && (
                      <FormText>Chức vụ này có quyền ADMIN</FormText>
                    )}
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

          {/* CAP LAI MAT KHAU */}
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Form onSubmit={handleSubmitReissuePassword}>
                  <h4>Cấp lại mật khẩu</h4>
                  {isAdmin && (
                    <p>
                      Tính năng này không áp dụng với tài khoản có quyền ADMIN
                    </p>
                  )}

                  <FormGroup>
                    <Label for="newPassword">Mật khẩu mới</Label>
                    <Input
                      required
                      disabled={isAdmin}
                      onChange={handleChangeReissuePassword}
                      name="newPassword"
                      type="password"
                      value={reissuePassword.newPassword}
                      invalid={Boolean(reissuePasswordFeedback.newPassword)}
                    />
                    <FormFeedback>
                      {reissuePasswordFeedback.newPassword}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label for="confirmPassword">Xác nhận mật khẩu</Label>
                    <Input
                      required
                      disabled={isAdmin}
                      onChange={handleChangeReissuePassword}
                      name="confirmPassword"
                      type="password"
                      value={reissuePassword.confirmPassword}
                      invalid={Boolean(reissuePasswordFeedback.confirmPassword)}
                    />
                    <FormFeedback>
                      {reissuePasswordFeedback.confirmPassword}
                    </FormFeedback>
                  </FormGroup>
                  <Button disabled={isAdmin} type="submit" color="danger" block>
                    Xác nhận cấp lại mật khẩu
                  </Button>
                </Form>
              </Col>
            </Row>
          </TabPane>
          {/* KHOA TAI KHOAN */}
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <h4>Khóa tài khoản</h4>
                <p>
                  Tài khoản bị khóa có thể khôi phục ở cuối phần quản lý nhân
                  viên
                </p>
                <Form onSubmit={handleSubmitDeleteStaff}>
                  <FormGroup>
                    <Label for="confirmDelete">
                      Nhập <strong>{staff.username}</strong> và bấm xác nhận để
                      khóa tài khoản
                    </Label>
                    <Input
                      required
                      onChange={handleChangeConfirmDelete}
                      name="confirmDelete"
                      value={confirmDelete}
                    />
                  </FormGroup>
                  <Button
                    disabled={confirmDelete !== staff.username}
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

export default EditStaffModal;
