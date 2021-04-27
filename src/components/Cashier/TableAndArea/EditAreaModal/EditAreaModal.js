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

import areaApi from "../../../../api/areaApi";
import { toastError, toastSuccess } from "../../../../utils/toastUtils";

const EDIT_INFO_SCHEMA = { id: 0, name: "" };
const FEEDBACK_SCHEMA = { name: "" };

const EditAreaModal = ({
  show,
  toggle,
  area,
  hasTables,
  handleUpdateArea,
  handleDeleteArea,
}) => {
  const [activeTab, setActiveTab] = useState("1");

  const [editInfo, setEditInfo] = useState(EDIT_INFO_SCHEMA);
  const [editInfoFeedback, setEditInfoFeedback] = useState(FEEDBACK_SCHEMA);

  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    setEditInfo(area?.id ? area : EDIT_INFO_SCHEMA);
  }, [area]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleChangeEditInfo = ({ target }) => {
    setEditInfo({ ...editInfo, name: target.value });
  };

  const handleSubmitEditInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await areaApi.update(editInfo);
      handleUpdateArea(res.data);
      toastSuccess("Thay đổi tên khu vực thành công");
    } catch (ex) {
      setEditInfoFeedback(ex.response.data);
      toastError("Thay đổi tên khu vực thất bại");
    }
  };

  const handleChangeConfirmDelete = ({ target }) => {
    setConfirmDelete(target.value);
  };

  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    try {
      await areaApi.softDelete(area.id);
      handleDeleteArea(area.id);
      toastSuccess("Khóa khu vực thành công");
      toggle();
      setConfirmDelete("");
    } catch (ex) {
      toastError("Khóa khu vực thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal
      isOpen={show}
      className="modal-lg modal-dialog-scrollable"
      toggle={toggle}
    >
      <ModalCustomHeader toggle={toggle}>Chỉnh sửa khu vực</ModalCustomHeader>
      <ModalBody className="bg-white">
        <Nav tabs className="bg-light">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggleTab("1")}
            >
              Thông tin khu vực
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggleTab("2")}
            >
              Khóa khu vực
            </NavLink>
          </NavItem>
        </Nav>
        {/* THONG TIN CHUNG */}
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Form onSubmit={handleSubmitEditInfo}>
                  <h4>Thông tin khu vực</h4>
                  <CustomInputGroup
                    required
                    name="name"
                    label="Tên khu vực"
                    value={editInfo.name}
                    onChange={handleChangeEditInfo}
                    feedback={editInfoFeedback.name}
                  />
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
                <h4>Khóa khu vực</h4>
                <p>Khu vực bị khóa có thể khôi phục ở cuối phần quản lý</p>
                <Form onSubmit={handleSubmitDelete}>
                  <FormGroup>
                    {hasTables && (
                      <p className="text-danger">
                        Khu vực đang còn bàn, không thể khóa
                      </p>
                    )}
                    <Label for="confirmDelete">
                      Nhập <strong>{area.name}</strong> và bấm xác nhận để khóa
                    </Label>
                    <Input
                      required
                      disabled={hasTables}
                      onChange={handleChangeConfirmDelete}
                      name="confirmDelete"
                      value={confirmDelete}
                      placeholder={area.name}
                    />
                  </FormGroup>
                  <Button
                    disabled={confirmDelete !== area.name || hasTables}
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

export default EditAreaModal;
