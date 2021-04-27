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
import ModalCustomHeader from "../../../ModalCustomHeader/ModalCustomHeader";
import CustomInputGroup from "../../../CustomInputGroup/CustomInputGroup";

import tableApi from "../../../../api/tableApi";
import { toastError, toastSuccess } from "../../../../utils/toastUtils";

const EDIT_INFO_SCHEMA = { id: 0, name: "", area: { id: "", name: "" } };
const FEEDBACK_SCHEMA = { name: "", area: "" };

const EditTableModal = ({
  show,
  toggle,
  table,
  areas,
  isGrouping,
  handleUpdateTable,
  handleDeleteTable,
}) => {
  const [activeTab, setActiveTab] = useState("1");

  const [editInfo, setEditInfo] = useState(EDIT_INFO_SCHEMA);
  const [editInfoFeedback, setEditInfoFeedback] = useState(FEEDBACK_SCHEMA);

  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    setEditInfo(table?.id ? table : EDIT_INFO_SCHEMA);
  }, [table]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleChangeEditInfo = ({ target }) => {
    setEditInfo({ ...editInfo, name: target.value });
  };

  const handleChangeArea = ({ target }) => {
    const selectValue = Number(target.value);
    setEditInfo({
      ...editInfo,
      area: areas.find((area) => area.id === selectValue),
    });
  };

  const handleSubmitEditInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await tableApi.update(editInfo);
      handleUpdateTable(res.data);
      toastSuccess("Thay đổi thông tin bàn thành công");
    } catch (ex) {
      setEditInfoFeedback(ex.response.data);
      toastError("Thay đổi thông tin bàn thất bại");
    }
  };

  const handleChangeConfirmDelete = ({ target }) => {
    setConfirmDelete(target.value);
  };

  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    try {
      await tableApi.softDelete(table.id);
      handleDeleteTable(table.id);
      toastSuccess("Khóa bàn thành công");
      toggle();
      setConfirmDelete("");
    } catch (ex) {
      toastError("Khóa bàn thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal
      isOpen={show}
      className="modal-lg modal-dialog-scrollable"
      toggle={toggle}
    >
      <ModalCustomHeader toggle={toggle}>Chỉnh sửa bàn</ModalCustomHeader>
      <ModalBody className="bg-white">
        <Nav tabs className="bg-light">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggleTab("1")}
            >
              Thông tin bàn
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggleTab("2")}
            >
              Khóa bàn
            </NavLink>
          </NavItem>
        </Nav>
        {/* THONG TIN CHUNG */}
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Form onSubmit={handleSubmitEditInfo}>
                  <h4>Thông tin bàn</h4>
                  <CustomInputGroup
                    required
                    name="name"
                    label="Tên bàn"
                    value={editInfo.name}
                    onChange={handleChangeEditInfo}
                    feedback={editInfoFeedback.name}
                  />
                  <CustomInputGroup
                    required
                    type="select"
                    name="area"
                    disabled={isGrouping}
                    label="Khu vực"
                    value={editInfo.area.id}
                    onChange={handleChangeArea}
                    feedback={editInfoFeedback.area}
                  >
                    {areas.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </CustomInputGroup>
                  {isGrouping && (
                    <p className="text-center">
                      Bàn đang được ghép, tạm thời không thể đổi khu vực
                    </p>
                  )}
                  <Button type="submit" color="warning" block>
                    Cập nhật
                  </Button>
                </Form>
              </Col>
            </Row>
          </TabPane>

          {/* KHOA BAN */}
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <h4>Khóa bàn</h4>
                <p>Bàn bị khóa có thể khôi phục ở cuối phần quản lý</p>
                <Form onSubmit={handleSubmitDelete}>
                  <FormGroup>
                    {isGrouping && (
                      <p className="text-danger">
                        Bàn đang được gộp, không thể khóa
                      </p>
                    )}
                    <Label for="confirmDelete">
                      Nhập <strong>{table.name}</strong> và bấm xác nhận để khóa
                    </Label>
                    <Input
                      required
                      disabled={isGrouping}
                      onChange={handleChangeConfirmDelete}
                      name="confirmDelete"
                      value={confirmDelete}
                      placeholder={table.name}
                    />
                  </FormGroup>
                  <Button
                    disabled={confirmDelete !== table.name || isGrouping}
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

export default EditTableModal;
