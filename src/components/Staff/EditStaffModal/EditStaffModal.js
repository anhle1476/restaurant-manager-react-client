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
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

import roleApi from "../../../api/roleApi";
import staffApi from "../../../api/staffApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";

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
    setEditInfo({ ...staff, role: String(staff.role.id) });
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
      const res = await staffApi.update(mapStaffData(editInfo, roles));
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
      setConfirmDelete("");
    } catch (ex) {
      toastError("Khóa tài khoản thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal isOpen={show} className="modal-lg modal-dialog" toggle={toggle}>
      <ModalHeaderWithCloseBtn toggle={toggle}>
        Chi tiết nhân viên
      </ModalHeaderWithCloseBtn>
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

                  <CustomInputGroup
                    required
                    disabled
                    onChange={handleChangeEditInfo}
                    label="Tên tài khoản"
                    name="username"
                    value={editInfo.username}
                    feedback={editInfoFeedback.username}
                  />
                  <CustomInputGroup
                    required
                    onChange={handleChangeEditInfo}
                    label="Họ và tên"
                    name="fullname"
                    value={editInfo.fullname}
                    feedback={editInfoFeedback.fullname}
                  />
                  <CustomInputGroup
                    required
                    onChange={handleChangeEditInfo}
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={editInfo.phoneNumber}
                    feedback={editInfoFeedback.phoneNumber}
                  />
                  <CustomInputGroup
                    required
                    onChange={handleChangeEditInfo}
                    label="Chức vụ"
                    type="select"
                    name="role"
                    value={editInfo.role}
                    feedback={editInfoFeedback.role}
                  >
                    <option disabled value="">
                      --- Chọn chức vụ ---
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </CustomInputGroup>
                  {editInfo.role === "1" && (
                    <p className="text-danger">* Chức vụ này có quyền ADMIN</p>
                  )}
                  <CustomInputGroup
                    required
                    onChange={handleChangeEditInfo}
                    type="number"
                    label="Lương/Ca"
                    name="salaryPerShift"
                    min="0"
                    max="20000000"
                    value={editInfo.salaryPerShift}
                    feedback={editInfoFeedback.salaryPerShift}
                  />

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

                  <CustomInputGroup
                    required
                    disabled={isAdmin}
                    onChange={handleChangeReissuePassword}
                    label="Mật khẩu mới"
                    name="newPassword"
                    type="password"
                    value={reissuePassword.newPassword}
                    feedback={reissuePasswordFeedback.newPassword}
                  />

                  <CustomInputGroup
                    required
                    disabled={isAdmin}
                    onChange={handleChangeReissuePassword}
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    type="password"
                    value={reissuePassword.confirmPassword}
                    feedback={reissuePasswordFeedback.confirmPassword}
                  />

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

const mapStaffData = (data, roles) => ({
  id: data.id,
  username: data.username,
  fullname: data.fullname,
  phoneNumber: data.phoneNumber,
  role: roles.find((r) => r.id === Number(data.role)),
  salaryPerShift: Number(data.salaryPerShift),
});

export default EditStaffModal;
