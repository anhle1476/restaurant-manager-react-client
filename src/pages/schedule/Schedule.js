import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "reactstrap";

import CustomCalendar from "../../components/Schedule/CustomCalendar/CustomCalendar";
import ShiftsModal from "../../components/Schedule/ShiftsModal/ShiftsModal";

import shiftApi from "../../api/shiftApi";
import { toastError } from "../../utils/toastUtils";

function Schedule() {
  const [shifts, setShifts] = useState([]);
  const [showShifts, setShowShifts] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await shiftApi.getAllWithBothDeletedStatus();
        setShifts(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      }
    }
    fetchData();
  }, []);

  const toggleShowShifts = () => {
    setShowShifts(!showShifts);
  };

  const handleAddNewShift = (newShift) => {
    setShifts([...shifts, newShift]);
  };

  const handleUpdateShift = (updated) => {
    setShifts(
      shifts.map((shift) => (shift.id === updated.id ? updated : shift))
    );
  };

  const handleDeleteShift = (id) => {
    setShifts(
      shifts.map((shift) =>
        shift.id !== id ? shift : { ...shift, deleted: true }
      )
    );
  };

  const handleRestoreShift = (id) => {
    setShifts(
      shifts.map((shift) =>
        shift.id !== id ? shift : { ...shift, deleted: false }
      )
    );
  };

  return (
    <>
      <Row>
        <Col>
          <h2>Lịch làm việc</h2>
        </Col>
        <Col color="warning" className="d-flex justify-content-end">
          <Button color="warning" onClick={toggleShowShifts}>
            Quản lý ca làm
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <CustomCalendar shifts={shifts} />
        </Col>
      </Row>
      <ShiftsModal
        shifts={shifts}
        handleAddNewShift={handleAddNewShift}
        handleUpdateShift={handleUpdateShift}
        handleRestoreShift={handleRestoreShift}
        handleDeleteShift={handleDeleteShift}
        show={showShifts}
        toggle={toggleShowShifts}
      />
    </>
  );
}

export default Schedule;
