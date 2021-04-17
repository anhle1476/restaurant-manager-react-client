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
} from "reactstrap";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

import shiftApi from "../../../api/shiftApi";
import staffApi from "../../../api/staffApi";
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
  violation: {},
  overtimeHours: 0,
};

const EditScheduleModal = ({ show, toggle, date, schedules, addSchedule }) => {
  const [shifts, setShifts] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [violations, setViolations] = useState([]);
  const [editSchedule, setEditSchedule] = useState(SCHEDULE_SCHEMA);
  const [addShift, setAddShift] = useState("");

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
      shift: shifts.find((sh) => sh.id === Number(addShift)),
    });
  };

  const closeEditSchedule = () => {
    setEditSchedule(SCHEDULE_SCHEMA);
  };

  const handleSubmitEditSchedule = (e) => {
    e.preventDefault();
    console.log(editSchedule);
  };

  const isShowEditSchedule = Boolean(editSchedule.shift?.id);

  return (
    <Modal
      isOpen={show}
      className="modal-lg modal-dialog-scrollable"
      toggle={() => toggle()}
    >
      <ModalCustomHeader toggle={() => toggle()}>
        Ngày {displayDate}
      </ModalCustomHeader>
      {show && (
        <ModalBody
          className={`bg-white position-relative ${s.detailsContainer}`}
        >
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
                {shifts.map((s) => (
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
          <div className={`${s.detailsForm} ${isShowEditSchedule && s.show}`}>
            {isShowEditSchedule && (
              <>
                <Row>
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
                </Row>
                <br />
                <Row>
                  <Col>
                    <Form className="px-2" onSubmit={handleSubmitEditSchedule}>
                      <FormGroup>
                        <Label>Thêm nhân viên</Label>
                        <div className="d-flex">
                          <Input type="select">
                            <option value="">---Chọn nhân viên---</option>
                            {staffs.map((st) => (
                              <option key={st.id} value={st.id}>
                                {`${st.fullname} (${st.role.name})`}
                              </option>
                            ))}
                          </Input>
                          <Button color="warning">Thêm</Button>
                        </div>
                      </FormGroup>
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Tên</th>
                            <th>Chức vụ</th>
                            <th>Số điện thoại</th>
                            <th>Vi phạm</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>lorem ipsum</td>
                            <td>ascaln</td>
                            <td>029352395</td>
                            <td>
                              <Input type="select">
                                <option value="">Không có</option>
                                {violations.map((v) => (
                                  <option key={v.id} value={v.id}>
                                    {`${v.name} (${v.finesPercent}%)`}
                                  </option>
                                ))}
                              </Input>
                            </td>
                            <td>
                              <Button
                                color="light"
                                size="sm"
                                className="bg-light"
                              >
                                &#10005;
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <FormGroup>
                        <Label>Ghi chú</Label>
                        <Input type="textarea" name="note" />
                      </FormGroup>
                      <Button color="warning" type="submit" block>
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
