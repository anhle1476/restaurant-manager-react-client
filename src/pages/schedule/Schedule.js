import React from "react";
import { Row, Col } from "reactstrap";

import CustomCalendar from "../../components/Schedule/CustomCalendar/CustomCalendar";

function Schedule() {
  return (
    <>
      <Row>
        <Col>
          <h2>Lịch làm việc</h2>
        </Col>
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
