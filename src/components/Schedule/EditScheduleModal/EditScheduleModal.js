import React, { useState, useEffect } from "react";

import {
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Table,
  Collapse,
  CardBody,
  Card,
  CardText,
  CardTitle,
} from "reactstrap";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

import shiftApi from "../../../api/shiftApi";
import staffApi from "../../../api/staffApi";
import scheduleApi from "../../../api/scheduleApi";
import violationApi from "../../../api/violationApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import { formatDateStr } from "../../../utils/dateUtils";

import s from "./EditScheduleModal.module.scss";

const SCHEDULE_SCHEMA = {
  date: "",
  shift: {},
  scheduleDetails: [],
  note: "",
};

const SCHEDULE_DETAIL_SCHEMA = {
  staff: {},
  violation: undefined,
  overtimeHours: 0,
};

const ViolationOption = ({ violation }) => (
  <option value={violation.id}>
    {`${violation.name} (${violation.finesPercent}%)${
      violation.deleted ? " - Đã khóa" : ""
    }`}
  </option>
);

const EditScheduleModal = ({
  show,
  toggle,
  date,
  disabledEdit,
  schedules = [],
  handleEditSchedule,
  handleDeleteSchedule,
}) => {
  const [shifts, setShifts] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [violations, setViolations] = useState([]);
  const [editSchedule, setEditSchedule] = useState(SCHEDULE_SCHEMA);
  const [addShift, setAddShift] = useState("");
  const [selectStaff, setSelectStaff] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const displayDate = formatDateStr(date);

  useEffect(() => {
    Promise.all([staffApi.getAll(), shiftApi.getAll(), violationApi.getAll()])
      .then(([staffsRes, shiftsRes, violationsRes]) => {
        setStaffs(staffsRes.data);
        setShifts(shiftsRes.data);
        setViolations(violationsRes.data);
      })
      .catch((ex) => {
        toastError("Lấy thông tin thất bại, vui lòng thử lại sau");
        console.log(ex.response.data);
      });
  }, []);

  const handleAddShiftChange = ({ target }) => {
    setAddShift(target.value);
  };

  const handleShowAddShiftModal = (e) => {
    e.preventDefault();
    setEditSchedule({
      ...SCHEDULE_SCHEMA,
      date: date,
      shift: shifts.find((sh) => sh.id === Number(addShift)),
    });
  };

  const closeEditSchedule = () => {
    setEditSchedule(SCHEDULE_SCHEMA);
  };

  const doToggle = () => {
    toggle();
    closeEditSchedule();
  };

  const handleSubmitEditSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = editSchedule.id
        ? await scheduleApi.update(editSchedule)
        : await scheduleApi.create(editSchedule);
      handleEditSchedule(res.data);
      toastSuccess("Thêm ca làm thành công");
    } catch (ex) {
      toastError("Thêm ca làm thất bại: " + ex?.response?.data?.message);
      console.log(ex);
    }
  };

  const handleAddStaffToSchedule = () => {
    if (!selectStaff) return;
    const selected = staffs.find((st) => st.id === Number(selectStaff));
    const newScheduleDetail = { ...SCHEDULE_DETAIL_SCHEMA, staff: selected };
    setEditSchedule({
      ...editSchedule,
      scheduleDetails: [...editSchedule.scheduleDetails, newScheduleDetail],
    });
    setSelectStaff("");
  };

  const handleSetViolation = ({ target }, staffId) => {
    const selected = violations.find((v) => v.id === Number(target.value));
    setEditSchedule({
      ...editSchedule,
      scheduleDetails: editSchedule.scheduleDetails.map((sd) =>
        sd.staff.id !== staffId ? sd : { ...sd, violation: selected }
      ),
    });
  };

  const handleSetOvertime = ({ target }, staffId) => {
    setEditSchedule({
      ...editSchedule,
      scheduleDetails: editSchedule.scheduleDetails.map((sd) =>
        sd.staff.id !== staffId
          ? sd
          : { ...sd, overtimeHours: Number(target.value) }
      ),
    });
  };

  const handleRemoveStaff = (staffId) => {
    setEditSchedule({
      ...editSchedule,
      scheduleDetails: editSchedule.scheduleDetails.filter(
        (sd) => sd.staff.id !== staffId
      ),
    });
  };

  const handleEditNote = ({ target }) => {
    setEditSchedule({ ...editSchedule, note: target.value });
  };

  const shiftOptionFilter = (sh) =>
    !schedules?.length || !schedules.some((sch) => sch.shift.id === sh.id);

  const isShowEditSchedule = Boolean(editSchedule.shift?.id);

  const isHasStaff = Boolean(editSchedule?.scheduleDetails?.length);

  const staffOptionFilter = (st) =>
    !isHasStaff ||
    !editSchedule.scheduleDetails.some((sch) => sch.staff.id === st.id);

  const toggleShowDelete = () => {
    setShowDelete(!showDelete);
  };

  const handleSubmitDelete = async () => {
    try {
      toggleShowDelete();
      handleDeleteSchedule(editSchedule);
      closeEditSchedule();
      await scheduleApi.deleteSchedule(editSchedule.id);
      toastSuccess("Xóa ca làm thành công");
    } catch (ex) {
      console.log(ex);
      toastError("Xóa ca làm thất bại, vui lòng thử lại sau");
    }
  };

  return (
    <Modal
      isOpen={show}
      className="modal-lg modal-dialog-scrollable"
      toggle={doToggle}
    >
      <ModalCustomHeader toggle={doToggle}>
        Ngày {displayDate}
      </ModalCustomHeader>
      {show && (
        <ModalBody
          className={`bg-white position-relative ${s.detailsContainer}`}
        >
          {!disabledEdit && (
            <Form inline onSubmit={handleShowAddShiftModal}>
              <FormGroup>
                <Input
                  required
                  type="select"
                  value={addShift}
                  onChange={handleAddShiftChange}
                >
                  <option value="" disabled>
                    ---Chọn ca làm---
                  </option>
                  {shifts.filter(shiftOptionFilter).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Input>
                <Button color="warning" type="submit">
                  Thêm
                </Button>
              </FormGroup>
            </Form>
          )}
          <Row className="my-2">
            <Col>
              <Table className={s.scheduleTable} bordered>
                <thead>
                  <tr>
                    <th>Ca làm</th>
                    <th>Nhân viên</th>
                    <th>Ghi chú</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.length ? (
                    schedules.map((sch) => (
                      <tr key={sch.id}>
                        <td>{sch.shift.name}</td>
                        <td>
                          <ul>
                            {sch.scheduleDetails.map((sd) => (
                              <li key={sd.id}>{sd.staff.fullname}</li>
                            ))}
                          </ul>
                        </td>
                        <td>{sch.note?.length ? sch.note : "Không"}</td>
                        <td>
                          <Button
                            color="warning"
                            onClick={() => setEditSchedule(sch)}
                          >
                            <i className="fa fa-eye"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center my-2">
                        Chưa có ca làm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
          {/* SCHEDULE DETAILS EDITOR */}
          <div className={`${s.detailsForm} ${isShowEditSchedule && s.show}`}>
            {isShowEditSchedule && (
              <>
                <Row className="my-2">
                  <Col className="d-flex align-items-center">
                    <Button
                      color="light"
                      className={s.closeBtn}
                      onClick={closeEditSchedule}
                    >
                      ❮
                    </Button>
                    <h5 className="mb-0 mx-3">{editSchedule.shift.name}</h5>
                  </Col>
                  <Col className="d-flex justify-content-end mr-2">
                    {editSchedule.id && !disabledEdit && (
                      <Button onClick={toggleShowDelete} color="warning">
                        <i className="fa fa-trash"></i>
                      </Button>
                    )}
                  </Col>
                </Row>
                <Collapse isOpen={showDelete}>
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">Xóa ca làm</CardTitle>
                      <CardText>
                        Hành động này không thể khôi phục, bạn có chắc chắn xóa{" "}
                        {editSchedule.shift?.name} ngày {date} không?
                      </CardText>
                      <Button
                        onClick={handleSubmitDelete}
                        color="danger"
                        className="mr-2"
                      >
                        Xóa
                      </Button>
                      <Button onClick={toggleShowDelete} color="light">
                        Hủy
                      </Button>
                    </CardBody>
                  </Card>
                </Collapse>
                <br />
                <Row>
                  <Col>
                    <Form className="px-2" onSubmit={handleSubmitEditSchedule}>
                      {!disabledEdit && (
                        <FormGroup>
                          <Label>Thêm nhân viên</Label>
                          <div className="d-flex">
                            <Input
                              type="select"
                              value={selectStaff}
                              onChange={(e) => setSelectStaff(e.target.value)}
                            >
                              <option value="">---Chọn nhân viên---</option>
                              {staffs.filter(staffOptionFilter).map((st) => (
                                <option key={st.id} value={st.id}>
                                  {`${st.fullname} (${st.role.name})`}
                                </option>
                              ))}
                            </Input>
                            <Button
                              color="warning"
                              onClick={handleAddStaffToSchedule}
                            >
                              Thêm
                            </Button>
                          </div>
                        </FormGroup>
                      )}

                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Tên</th>
                            <th>Chức vụ</th>
                            <th>Vi phạm</th>
                            <th>Giờ tăng ca</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {isHasStaff ? (
                            editSchedule.scheduleDetails.map((sd, i) => (
                              <tr key={i}>
                                <td>{sd.staff.fullname}</td>
                                <td>{sd.staff.role.name}</td>
                                <td>
                                  <Input
                                    type="select"
                                    value={
                                      sd.violation?.id ? sd.violation.id : ""
                                    }
                                    onChange={(e) =>
                                      handleSetViolation(e, sd.staff.id)
                                    }
                                    disabled={disabledEdit}
                                  >
                                    <option value="">Không có</option>
                                    {violations.map((v) => (
                                      <ViolationOption
                                        key={v.id}
                                        violation={v}
                                      />
                                    ))}
                                    {sd.violation?.deleted && (
                                      <ViolationOption
                                        violation={sd.violation}
                                      />
                                    )}
                                  </Input>
                                </td>

                                <td>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="8"
                                    step="0.1"
                                    value={sd.overtimeHours}
                                    disabled={disabledEdit}
                                    onChange={(e) =>
                                      handleSetOvertime(e, sd.staff.id)
                                    }
                                  />
                                </td>
                                <td>
                                  <Button
                                    color="light"
                                    size="sm"
                                    disabled={disabledEdit}
                                    className="bg-light"
                                    onClick={() =>
                                      handleRemoveStaff(sd.staff.id)
                                    }
                                  >
                                    &#10005;
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center">
                                Chưa có nhân viên nào
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      <FormGroup>
                        <Label>Ghi chú</Label>
                        <Input
                          type="textarea"
                          name="note"
                          disabled={disabledEdit}
                          value={editSchedule.note ? editSchedule.note : ""}
                          onChange={handleEditNote}
                        />
                      </FormGroup>
                      <Button
                        disabled={!isHasStaff || disabledEdit}
                        color="warning"
                        type="submit"
                        className="mb-3"
                        block
                      >
                        {editSchedule.id ? "Cập nhật" : "Tạo ca làm"}
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </>
            )}
          </div>
        </ModalBody>
      )}
    </Modal>
  );
};

export default EditScheduleModal;
