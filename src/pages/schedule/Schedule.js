import React from "react";
import { Row, Col } from "reactstrap";

import CustomCalendar from "../../components/Schedule/CustomCalendar/CustomCalendar";

function Schedule() {
  return (
    <>
      <Row>
        <Col>Lịch làm việc</Col>
      </Row>
      <Row>
        <Col>
          <CustomCalendar />
        </Col>
      </Row>
    </>
  );
}

export default Schedule;
