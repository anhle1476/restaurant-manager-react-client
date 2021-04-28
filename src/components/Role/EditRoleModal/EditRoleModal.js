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
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";

import roleApi from "../../../api/roleApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import InlineSearch from "../../InlineSearch/InlineSearch";

const EDIT_INFO_SCHEMA = { id: 0, name: "", code: "" };

const EditRoleModal = ({
  show,
  toggle,
  role,
  handleUpdateRole,
  handleDeleteRole,
}) => {
  const [staffs, setStaffs] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [search, setSearch] = useState("");

  const [editInfo, setEditInfo] = useState(EDIT_INFO_SCHEMA);
  const [editInfoFeedback, setEditInfoFeedback] = useState({});

  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    if (!role.id || role.id === editInfo.id) return;
    setEditInfo(role?.id ? role : EDIT_INFO_SCHEMA);
    const fetchData = async () => {
      try {
        const res = await roleApi.getAllStaffsByRoleId(role.id);
        setStaffs(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      }
    };
    fetchData();
  }, [role, editInfo.id]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  const handleChangeEditInfo = ({ target }) => {
    setEditInfo({ ...editInfo, name: target.value });
  };

  const handleSubmitEditInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await roleApi.update(editInfo);
      handleUpdateRole(res.data);
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
      await roleApi.softDelete(role.id);
      handleDeleteRole(role.id);
      toastSuccess("Khóa chức vụ thành công");
      toggle();
      setConfirmDelete("");
    } catch (ex) {
      toastError("Khóa chức vụ thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  const searchFilter = ({ username, fullname, phoneNumber }) => {
    const keyword = search.toLowerCase();
    return (
      username.toLowerCase().indexOf(keyword) !== -1 ||
      fullname.toLowerCase().indexOf(keyword) !== -1 ||
      phoneNumber.toLowerCase().indexOf(keyword) !== -1
    );
  };

  const isMainRole = role?.code !== "MISC";
  const isNoStaff = staffs.length === 0;

  return (
    <Modal
      isOpen={show}
      className="modal-lg modal-dialog-scrollable"
      toggle={toggle}
    >
      <ModalHeaderWithCloseBtn toggle={toggle}>
        Chi tiết chức vụ
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
              Danh sách nhân viên
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => toggleTab("3")}
            >
              Khóa chức vụ
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
                    name="name"
                    label="Tên chức vụ"
                    value={editInfo.name}
                    onChange={handleChangeEditInfo}
                    feedback={editInfoFeedback.name}
                  />
                  <FormGroup>
                    <Label for="code">Mã</Label>
                    <Input disabled name="code" value={editInfo.code} />
                  </FormGroup>
                  <Button type="submit" color="warning" block>
                    Cập nhật
                  </Button>
                </Form>
              </Col>
            </Row>
          </TabPane>

          {/* DANH SACH NHAN VIEN CUA CHUC VU */}
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <h4>Danh sách nhân viên</h4>

                <InlineSearch
                  value={search}
                  placeholder="Tìm nhân viên..."
                  onChange={handleSearch}
                />
                <Table>
                  <thead>
                    <tr>
                      <th>Tài khoản</th>
                      <th>Họ và tên</th>
                      <th>Số điện thoại</th>
                      <th>Lương/Ca (VND)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffs
                      .filter(searchFilter)
                      .map(
                        ({
                          id,
                          username,
                          fullname,
                          phoneNumber,
                          salaryPerShift,
                        }) => (
                          <tr key={id}>
                            <th>{username}</th>
                            <th>{fullname}</th>
                            <th>{phoneNumber}</th>
                            <th>{salaryPerShift}</th>
                          </tr>
                        )
                      )}
                  </tbody>
                </Table>
                {isNoStaff && (
                  <p className="text-center">
                    Chức vụ hiện chưa có nhân viên nào
                  </p>
                )}
              </Col>
            </Row>
          </TabPane>
          {/* KHOA TAI KHOAN */}
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <h4>Khóa chức vụ</h4>
                <p>
                  Chức vụ bị khóa có thể khôi phục ở cuối phần quản lý chức vụ
                </p>
                {isMainRole ? (
                  <p className="text-danger">
                    Tính năng không áp dụng với các chức vụ chính
                  </p>
                ) : (
                  !isNoStaff && (
                    <p className="text-danger">
                      Đang tồn tại tài khoản với chức vụ này, không thể xóa
                    </p>
                  )
                )}
                <Form onSubmit={handleSubmitDelete}>
                  <FormGroup>
                    <Label for="confirmDelete">
                      Nhập <strong>{role.name}</strong> và bấm xác nhận để khóa
                      chức vụ
                    </Label>
                    <Input
                      required
                      disabled={!isNoStaff}
                      onChange={handleChangeConfirmDelete}
                      name="confirmDelete"
                      value={confirmDelete}
                      placeholder={role.name}
                    />
                  </FormGroup>
                  <Button
                    disabled={confirmDelete !== role.name || !isNoStaff}
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

export default EditRoleModal;
