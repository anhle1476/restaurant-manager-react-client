import React, { useState, useEffect } from "react";
import { Col, Form, FormGroup, Input, Row, Button } from "reactstrap";
import TableDisplay from "./TableDisplay/TableDisplay";
import AddAreaModal from "./AddAreaModal/AddAreaModal";
import AddTableModal from "./AddTableModal/AddTableModal";
import RestoreTableModal from "./RestoreTableModal/RestoreTableModal";

import areaApi from "../../../api/areaApi";
import "./TableAndArea.scss";
import EditTableModal from "./EditTableModal/EditTableModal";
import EditAreaModal from "./EditAreaModal/EditAreaModal";

const MODAL_SCHEMA = {
  ADD_AREA: false,
  ADD_TABLE: false,
  EDIT_TABLE: false,
  EDIT_AREA: false,
  RESTORE_TABLE: false,
};

const TableAndArea = ({
  tables,
  currentTable,
  handleSelectTable,
  handleAddTable,
  handleUpdateTable,
  handleDeleteTable,
  handleRestoreTable,
}) => {
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

  const handleUpdateArea = (updated) => {
    setAreas(areas.map((area) => (area.id === updated.id ? updated : area)));
    setCurrentArea(updated);
  };

  const handleDeleteArea = (id) => {
    setAreas(areas.filter((area) => area.id !== id));
  };

  const areaSearchFilter = (area) =>
    area.name.toLowerCase().indexOf(areaSearch.toLowerCase()) !== -1;

  const tableInCurrentAreaFilter = (table) => table.area.id === currentArea.id;

  const isCurrentTableInGroup =
    currentTable.parent ||
    tables.some((table) => table.parent?.id === currentTable.id);
  return (
    <div>
      <Row className="area-and-table-container">
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
          <div className="flex-body">
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
            </div>
          </div>
          <div className="flex-footer">
            <Button block color="info">
              Đã khóa
            </Button>
          </div>
        </Col>
        {/* TABLE LIST */}
        <Col className="px-3 flex-container" xs="9">
          <div className="flex-header">
            <h4>{currentArea.name}</h4>
            <Button color="warning" onClick={() => toggleModal("EDIT_AREA")}>
              <i className="fa fa-pencil"></i>
            </Button>
          </div>
          <div className="flex-body">
            <div className="flex-scrollable table-container">
              {tables.filter(tableInCurrentAreaFilter).map((table, i) => (
                <TableDisplay
                  onClick={() => handleSelectTable(table)}
                  key={i}
                  table={table}
                />
              ))}
              <div
                onClick={() => toggleModal("ADD_TABLE")}
                className="table-display table-add text-center"
              >
                + Thêm bàn
              </div>
            </div>
          </div>
          <div className="flex-footer">
            <Button onClick={() => toggleModal("EDIT_TABLE")} color="warning">
              Sửa bàn hiện tại ({currentTable.name})
            </Button>
            <Button onClick={() => toggleModal("RESTORE_TABLE")} color="info">
              Bàn đã xóa
            </Button>
          </div>
        </Col>
      </Row>
      <AddAreaModal
        show={showModal.ADD_AREA}
        toggle={() => toggleModal("ADD_AREA")}
        handleAddArea={handleAddArea}
      />
      <EditAreaModal
        show={showModal.EDIT_AREA}
        toggle={() => toggleModal("EDIT_AREA")}
        area={currentArea}
        handleUpdateArea={handleUpdateArea}
        handleDeleteArea={handleDeleteArea}
      />
      <AddTableModal
        show={showModal.ADD_TABLE}
        toggle={() => toggleModal("ADD_TABLE")}
        handleAddTable={handleAddTable}
        currentArea={currentArea}
      />
      <EditTableModal
        show={showModal.EDIT_TABLE}
        toggle={() => toggleModal("EDIT_TABLE")}
        table={currentTable}
        areas={areas}
        isGrouping={isCurrentTableInGroup}
        handleDeleteTable={handleDeleteTable}
        handleUpdateTable={handleUpdateTable}
      />
      <RestoreTableModal
        show={showModal.RESTORE_TABLE}
        toggle={() => toggleModal("RESTORE_TABLE")}
        handleRestoreTable={handleRestoreTable}
      />
    </div>
  );
};

export default TableAndArea;
