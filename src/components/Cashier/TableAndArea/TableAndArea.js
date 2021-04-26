import React from "react";
import { Col, Form, FormGroup, Input, Row } from "reactstrap";
import TableDisplay from "../TableDisplay/TableDisplay";

import "./TableAndArea.scss";

const TableAndArea = () => {
  const fakeTables = [
    { name: "T1.1" },
    { name: "T1.2" },
    { name: "T1.3" },
    { name: "T1.4", parent: { name: "T1.1" } },
  ];

  return (
    <div>
      <Row>
        {/* AREA LIST */}
        <Col className="p-1 area-container" sm="3">
          <div>
            <Form>
              <FormGroup>
                <Input type="search" placeholder="Tìm khu vực..." />
              </FormGroup>
            </Form>
          </div>
          <div className="area-scrollable">lorem</div>
        </Col>
        {/* TABLE LIST */}
        <Col className="px-3 py-1" sm="9">
          <h4>Tầng 1</h4>
          <hr className="m-1" />
          <div className="table-container">
            {fakeTables.map((table, i) => (
              <TableDisplay
                key={i}
                table={table}
                group={table.parent?.name}
                busy={table.name === "T1.2"}
              />
            ))}
            <TableDisplay add />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TableAndArea;
