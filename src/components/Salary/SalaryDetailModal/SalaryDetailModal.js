import React from "react";

import { Modal, ModalBody, Table, Row, Col } from "reactstrap";

import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

import s from "./SalaryDetailModal.module.scss";

import { formatMonthStr } from "../../../utils/dateUtils";
import { formatVnd } from "../../../utils/moneyUtils";

const SalaryDetailModal = ({ show, toggle, details }) => {
  const {
    staff,
    firstDateOfMonth,
    currentSalaryPerShift,
    numberOfShift,
    violationDetails,
    salary,
    totalOvertimeHours,
  } = details;

  const hasViolations = Boolean(violationDetails) && violationDetails?.length;

  const totalFinesAmount = hasViolations
    ? violationDetails.reduce(
        (acc, v) => acc + violationMoneyCalc(v, currentSalaryPerShift),
        0
      )
    : 0;

  return (
    <Modal isOpen={show} toggle={toggle}>
      <ModalCustomHeader toggle={toggle}>
        Bảng lương tháng {formatMonthStr(firstDateOfMonth)}
      </ModalCustomHeader>
      {show && (
        <ModalBody className="bg-white">
          <Row>
            <Col className={s.modalInfo}>
              <h5>Thông tin nhân viên</h5>
              <div>
                <span>Nhân viên:</span>
                <span>
                  {staff.fullname} ({staff.username})
                </span>
              </div>
              <div>
                <span>Chức vụ:</span>
                <span>{staff.role.name}</span>
              </div>
              <div>
                <span>Số điện thoại:</span>
                <span>{staff.phoneNumber}</span>
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col className={s.modalInfo}>
              <h5>Chi tiết lương</h5>
              <div>
                <span>Lương mỗi ca:</span>
                <span>{formatVnd(currentSalaryPerShift)}</span>
              </div>
              <div>
                <span>Số ca:</span>
                <span>{numberOfShift}</span>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Table bordered className={s.modalTable + " mt-2"}>
                <thead>
                  <tr>
                    <th>Vi phạm</th>
                    <th>Mức phạt</th>
                    <th>Số lần</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {hasViolations ? (
                    violationDetails.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <p className={s.tableRow}>{d.violation.name}</p>
                        </td>
                        <td>
                          <p className={s.tableRowRight}>{d.finesPercent}%</p>
                        </td>
                        <td>
                          <p className={s.tableRowRight}>
                            {d.numberOfViolations}
                          </p>
                        </td>
                        <td>
                          <p className={s.tableRowRight}>
                            {formatVnd(
                              violationMoneyCalc(d, currentSalaryPerShift)
                            )}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Không có vi phạm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
          <hr className="mt-0" />
          <Row>
            <Col className={s.modalInfo}>
              <div>
                <span>Lương tháng:</span>
                <span>{formatVnd(numberOfShift * currentSalaryPerShift)}</span>
              </div>
              <div>
                <span>Tiền phạt:</span>
                <span>{formatVnd(totalFinesAmount)}</span>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className={s.modalInfo}>
              <div>
                <strong>Tổng lương:</strong>
                <span>{formatVnd(salary)}</span>
              </div>
              <br />
              <div>
                <span>Số giờ tăng ca:</span>
                <span>{totalOvertimeHours} giờ</span>
              </div>
              <div>
                <small className="font-italic">(Tính riêng)</small>
              </div>
            </Col>
          </Row>
        </ModalBody>
      )}
    </Modal>
  );
};

function violationMoneyCalc(v, salaryPerShift) {
  return Math.round(
    ((v.numberOfViolations * v.finesPercent) / 100) * salaryPerShift
  );
}

export default SalaryDetailModal;
