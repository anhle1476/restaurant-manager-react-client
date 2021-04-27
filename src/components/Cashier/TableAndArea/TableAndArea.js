import React, { useState, useEffect } from "react";
import { Col, Form, FormGroup, Input, Row, Button } from "reactstrap";
import TableDisplay from "./TableDisplay/TableDisplay";
import AddAreaModal from "./AddAreaModal/AddAreaModal";
import AddTableModal from "./AddTableModal/AddTableModal";

import areaApi from "../../../api/areaApi";
import "./TableAndArea.scss";

const MODAL_SCHEMA = {
  ADD_AREA: false,
  ADD_TABLE: false,
};

const TableAndArea = ({ tables, handleAddTable }) => {
  const [areas, setAreas] = useState([]);
  const [currentArea, setCurrentArea] = useState({});
  const [showModal, setShowModal] = useState(MODAL_SCHEMA);
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

  const toggleModal = (modal) => {
    setShowModal({ ...showModal, [modal]: !showModal[modal] });
  };

  const handleAddArea = (newArea) => {
    setAreas([...areas, newArea]);
  };

  const areaSearchFilter = (area) =>
    area.name.toLowerCase().indexOf(areaSearch.toLowerCase()) !== -1;

  const tableInCurrentAreaFilter = (table) => table.area.id === currentArea.id;

  return (
    <div>
      <Row>
        {/* AREA LIST */}
        <Col className="px-1 flex-container" xs="3">
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
            <Button
              onClick={() => toggleModal("ADD_AREA")}
              color="white"
              className="py-2"
              block
            >
              + Thêm khu vực
            </Button>
            <div className="bottom-options">
              <Button block color="info">
                Đã khóa
              </Button>
            </div>
          </div>
        </Col>
        {/* TABLE LIST */}
        <Col className="px-3 flex-container" xs="9">
          <div className="flex-header">
            <h4>{currentArea.name}</h4>
          </div>
          <div className="flex-scrollable table-container">
            {tables.filter(tableInCurrentAreaFilter).map((table, i) => (
              <TableDisplay key={i} table={table} />
            ))}
            <div
              onClick={() => toggleModal("ADD_TABLE")}
              className="table-display table-add text-center"
            >
              + Thêm bàn
            </div>

            <div className="bottom-options">
              <Button color="info">Sửa bàn hiện tại</Button>
            </div>
          </div>
        </Col>
      </Row>
      <AddAreaModal
        show={showModal.ADD_AREA}
        toggle={() => toggleModal("ADD_AREA")}
        handleAddArea={handleAddArea}
      />
      <AddTableModal
        show={showModal.ADD_TABLE}
        toggle={() => toggleModal("ADD_TABLE")}
        handleAddTable={handleAddTable}
        currentArea={currentArea}
      />
    </div>
  );
};

export default TableAndArea;
