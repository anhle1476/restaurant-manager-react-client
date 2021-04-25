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

import violationApi from "../../../api/violationApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";

const EDIT_INFO_SCHEMA = { id: 0, name: "", finesPercent: 0 };
const EDIT_INFO_FEEDBACK_SCHEMA = { name: "", finesPercent: "" };

const EditViolationModal = ({
  show,
  toggle,
  violation,
  handleUpdateViolation,
  handleDeleteViolation,
}) => {
  const [activeTab, setActiveTab] = useState("1");

  const [editInfo, setEditInfo] = useState(EDIT_INFO_SCHEMA);
  const [editInfoFeedback, setEditInfoFeedback] = useState(
    EDIT_INFO_FEEDBACK_SCHEMA
  );

  const [confirmDelete, setConfirmDelete] = useState("");

  useEffect(() => {
    setEditInfo(violation?.id ? violation : EDIT_INFO_SCHEMA);
  }, [violation]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleChangeEditInfo = ({ target }) => {
    setEditInfo({ ...editInfo, [target.name]: target.value });
  };

  const handleSubmitEditInfo = async (e) => {
    e.preventDefault();
    try {
      setEditInfoFeedback(EDIT_INFO_FEEDBACK_SCHEMA);
      const res = await violationApi.update({
        ...editInfo,
        finesPercent: Number(editInfo.finesPercent),
      });
      handleUpdateViolation(res.data);
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
      await violationApi.softDelete(violation.id);
      handleDeleteViolation(violation.id);
      toastSuccess("Khóa vi phạm thành công");
      toggle();
      setConfirmDelete("");
    } catch (ex) {
      toastError("Khóa vi phạm thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal
      isOpen={show}
      className="modal-lg modal-dialog-scrollable"
      toggle={toggle}
    >
      <ModalCustomHeader toggle={toggle}>Chi tiết vi phạm</ModalCustomHeader>
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
              Khóa vi phạm
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
                    label="Tên vi phạm"
                    name="name"
                    value={editInfo.name}
                    feedback={editInfoFeedback.name}
                  />
                  <CustomInputGroup
                    required
                    onChange={handleChangeEditInfo}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    label="Mức phạt theo ca (%)"
                    name="finesPercent"
                    value={editInfo.finesPercent}
                    feedback={editInfoFeedback.finesPercent}
                  />

                  <Button type="submit" color="warning" block>
                    Cập nhật
                  </Button>
                </Form>
              </Col>
            </Row>
          </TabPane>

          {/* KHOA VI PHAM */}
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <h4>Khóa vi phạm</h4>
                <p>
                  Vi phạm bị khóa có thể khôi phục ở cuối phần quản lý vi phạm
                </p>
                <Form onSubmit={handleSubmitDelete}>
                  <FormGroup>
                    <Label for="confirmDelete">
                      Nhập <strong>{violation?.name}</strong> và bấm xác nhận để
                      khóa
                    </Label>
                    <Input
                      required
                      onChange={handleChangeConfirmDelete}
                      name="confirmDelete"
                      value={confirmDelete}
                    />
                  </FormGroup>
                  <Button
                    disabled={confirmDelete !== violation?.name}
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

export default EditViolationModal;
