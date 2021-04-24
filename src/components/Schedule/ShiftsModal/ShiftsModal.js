import React, { useState } from "react";
import classnames from "classnames";

import {
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Button,
  Table,
  TabPane,
  TabContent,
  Nav,
  NavItem,
  NavLink,
  FormFeedback,
} from "reactstrap";

import shiftApi from "../../../api/shiftApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

import s from "./ShiftsModal.module.scss";

const ADD_FORM_SCHEMA = {
  data: "",
  feedback: "",
};

const ShiftsModal = ({
  shifts,
  handleAddNewShift,
  handleUpdateShift,
  handleRestoreShift,
  handleDeleteShift,
  show,
  toggle,
}) => {
  const [activeTab, setActiveTab] = useState("1");
  const [addForm, setAddForm] = useState(ADD_FORM_SCHEMA);
  const [editing, setEditing] = useState({});
  const [deleting, setDeleting] = useState({});

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleOpenEdit = (id) => {
    const target = shifts.find((shift) => shift.id === id);
    setEditing({ ...editing, [id]: target.name });
  };

  const handleChangeAdd = ({ target }) => {
    setAddForm({ ...addForm, data: target.value });
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await shiftApi.create({ name: addForm.data });
      setAddForm(ADD_FORM_SCHEMA);
      handleAddNewShift(res.data);
      toastSuccess("Tạo ca làm thành công");
    } catch (ex) {
      toastError("Tạo ca làm thất bại");
      const feedback = ex.response?.data?.name;
      setAddForm({
        ...addForm,
        feedback: feedback ? feedback : "Lỗi không xác định",
      });
    }
  };

  const handleEditShiftName = ({ target }) => {
    setEditing({ ...editing, [target.name]: target.value });
  };

  const cancelEditShiftName = (id) => {
    setEditing({ ...editing, [id]: undefined });
  };

  const handleSubmitEditShiftName = async (e, id) => {
    e.preventDefault();
    try {
      const updatingShift = shifts.find((shift) => shift.id === id);
      const res = await shiftApi.update({
        ...updatingShift,
        name: editing[id],
      });
      handleUpdateShift(res.data);
      setEditing({ ...editing, [id]: undefined });
      toastSuccess("Cập nhật ca làm thành công");
    } catch (ex) {
      toastError("Cập nhật ca làm thất bại: " + ex.response.data.name);
    }
  };

  const toggleDeleteShift = (id) => {
    setDeleting({ ...deleting, [id]: !deleting[id] });
  };

  const handleSubmitDelete = async (id) => {
    try {
      await shiftApi.softDelete(id);
      handleDeleteShift(id);
      toastSuccess("Xóa ca làm thành công");
      toggleDeleteShift(id);
    } catch (ex) {
      toastError("Khóa ca làm thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  const handleSubmitRestore = async (id) => {
    try {
      await shiftApi.restore(id);
      handleRestoreShift(id);
      toastSuccess("Khôi phục thành công");
    } catch (ex) {
      toastError("Khôi phục thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal
      className="modal-lg modal-dialog-scrollable"
      isOpen={show}
      toggle={toggle}
    >
      <ModalCustomHeader toggle={toggle}>Quản lý ca làm</ModalCustomHeader>
      {/* edit */}
      <ModalBody className="bg-white">
        <Nav tabs className="bg-light">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggleTab("1")}
            >
              Ca làm hiện tại
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggleTab("2")}
            >
              Ca làm đã khóa
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          {/* CA LAM HIEN TAI */}
          <TabPane tabId="1">
            <h4>Ca làm hiện tại</h4>
            <Form inline onSubmit={handleSubmitAdd}>
              <FormGroup>
                <Input
                  required
                  value={addForm.data}
                  onChange={handleChangeAdd}
                  placeholder="Tên ca làm mới..."
                  invalid={Boolean(addForm.feedback)}
                />
                <Button type="submit" color="warning">
                  Thêm
                </Button>
                <FormFeedback>{addForm.feedback}</FormFeedback>
              </FormGroup>
            </Form>

            <Table>
              <thead>
                <tr>
                  <th>Tên ca</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shifts
                  .filter((shift) => !shift.deleted)
                  .map(({ id, name }) => (
                    <tr key={id}>
                      <td>
                        {editing[id] === undefined ? (
                          name
                        ) : (
                          <Form
                            inline
                            onSubmit={(e) => handleSubmitEditShiftName(e, id)}
                          >
                            <FormGroup>
                              <Input
                                required
                                value={editing[id]}
                                name={id}
                                onChange={handleEditShiftName}
                              />
                            </FormGroup>
                            <Button color="warning" type="submit">
                              Cập nhật
                            </Button>
                            <Button
                              color="light"
                              onClick={() => cancelEditShiftName(id)}
                            >
                              Hủy
                            </Button>
                          </Form>
                        )}
                        {deleting[id] && (
                          <>
                            <br />
                            <p>Bạn có chắc chắn khóa ca này không?</p>
                            <Button
                              color="warning"
                              onClick={() => handleSubmitDelete(id)}
                            >
                              Có
                            </Button>
                            <Button
                              color="light"
                              onClick={() => toggleDeleteShift(id)}
                            >
                              Không
                            </Button>
                          </>
                        )}
                      </td>
                      <td className={s.actions}>
                        {editing[id] === undefined && (
                          <Button
                            size="sm"
                            color="warning"
                            title="Đổi tên"
                            onClick={() => handleOpenEdit(id)}
                          >
                            <i className="fa fa-pencil"></i>
                          </Button>
                        )}
                        {!deleting[id] && (
                          <Button
                            size="sm"
                            color="danger"
                            title="Khóa"
                            onClick={() => toggleDeleteShift(id)}
                          >
                            <i className="fa fa-lock"></i>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </TabPane>
          <TabPane tabId="2">
            <h4>Ca làm đã khóa</h4>
            <Table>
              <thead>
                <tr>
                  <th>Tên ca</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shifts
                  .filter((shift) => shift.deleted)
                  .map(({ id, name }) => (
                    <tr key={id}>
                      <td>{name}</td>
                      <td className={s.actions}>
                        <Button
                          size="sm"
                          color="warning"
                          title="Khóa"
                          onClick={() => handleSubmitRestore(id)}
                        >
                          <i className="fa fa-undo"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </TabPane>
        </TabContent>
      </ModalBody>

      <ModalFooter>
        <Button color="light" onClick={toggle}>
          Thoát
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ShiftsModal;
