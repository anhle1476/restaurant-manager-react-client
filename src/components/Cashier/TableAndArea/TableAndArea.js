import React, { useState, useEffect } from "react";
import { Col, Form, FormGroup, Input, Row, Button } from "reactstrap";
import TableDisplay from "./TableDisplay/TableDisplay";

import areaApi from "../../../api/areaApi";
import "./TableAndArea.scss";

const TableAndArea = ({ tables }) => {
  const [areas, setAreas] = useState([]);
  const [currentArea, setCurrentArea] = useState({});
  const [areaSearch, setAreaSearch] = useState("");

  useEffect(() => {
    const doFetch = async () => {
      const res = await areaApi.getAll();
      const areaData = res.data;
      if (areaData.length) {
        setAreas(areaData);
        setCurrentArea(areaData[0]);
      }
    };
    doFetch();
  }, []);

  const toggleCurrentArea = (area) => {
    setCurrentArea(area);
  };

  const handleAreaSearch = (e) => {
    setAreaSearch(e.target.value);
  };

  const areaSearchFilter = (area) =>
    area.name.toLowerCase().indexOf(areaSearch.toLowerCase()) !== -1;

  const tableInCurrentAreaFilter = (table) => table.area.id === currentArea.id;

  return (
    <div>
      <Row>
        {/* AREA LIST */}
        <Col className="p-1 flex-container" xs="3">
          <div className="flex-header">
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormGroup>
                <Input
                  value={areaSearch}
                  onChange={handleAreaSearch}
                  type="search"
                  placeholder="Tìm khu vực..."
                />
              </FormGroup>
            </Form>
          </div>
          <div className="flex-scrollable">
            {areas.filter(areaSearchFilter).map((area, i) => (
              <Button
                key={i}
                color={area.id === currentArea.id ? "primary" : "light"}
                onClick={() => toggleCurrentArea(area)}
                block
              >
                {area.name}
              </Button>
            ))}
            <Button color="white" className="py-2" block>
              + Thêm khu vực
            </Button>
          </div>
        </Col>
        {/* TABLE LIST */}
        <Col className="px-3 py-1 flex-container" xs="9">
          <div>
            <h4>{currentArea.name}</h4>
          </div>
          <div className="flex-scrollable">
            <div className="table-container">
              {tables.filter(tableInCurrentAreaFilter).map((table, i) => (
                <TableDisplay key={i} table={table} />
              ))}
              <div className="table-display table-add">+ Thêm bàn</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TableAndArea;
