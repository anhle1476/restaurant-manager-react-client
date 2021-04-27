import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "reactstrap";
import TableDisplay from "./TableDisplay/TableDisplay";
import AddAreaModal from "./AddAreaModal/AddAreaModal";
import AddTableModal from "./AddTableModal/AddTableModal";
import RestoreTableModal from "./RestoreTableModal/RestoreTableModal";

import areaApi from "../../../api/areaApi";
import "./TableAndArea.scss";
import EditTableModal from "./EditTableModal/EditTableModal";
import EditAreaModal from "./EditAreaModal/EditAreaModal";
import RestoreAreaModal from "./RestoreAreaModal/RestoreAreaModal";
import InlineSearch from "../../InlineSearch/InlineSearch";

const MODAL_SCHEMA = {
  ADD_AREA: false,
  ADD_TABLE: false,
  EDIT_TABLE: false,
  EDIT_AREA: false,
  RESTORE_TABLE: false,
  RESTORE_AREA: false,
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
  const [search, setSearch] = useState({ area: "", table: "" });

  useEffect(() => {
    const doFetch = async () => {
      const res = await areaApi.getAll();
      const areaData = res.data;
      if (areaData.length) {
        sortAreas(areaData);
        setAreas(areaData);
        setCurrentArea(areaData[0]);
      }
    };
    doFetch();
  }, []);

  const toggleCurrentArea = (area) => {
    setCurrentArea(area);
  };

  const handleSearch = ({ target }) => {
    setSearch({ ...search, [target.name]: target.value });
  };

  const toggleModal = (modal) => {
    setShowModal({ ...showModal, [modal]: !showModal[modal] });
  };

  const handlePushArea = (newArea) => {
    const newData = sortAreas([...areas, newArea]);
    setAreas(newData);
  };

  const handleUpdateArea = (updated) => {
    setAreas(areas.map((area) => (area.id === updated.id ? updated : area)));
    setCurrentArea(updated);
  };

  const handleDeleteArea = (id) => {
    setAreas(areas.filter((area) => area.id !== id));
    const selectNewArea = areas.find((area) => area.id !== id);
    setCurrentArea(selectNewArea ? selectNewArea : {});
  };

  const areaSearchFilter = (area) =>
    area.name.toLowerCase().indexOf(search.area.toLowerCase()) !== -1;

  const tableFilter = ({ area, name }) =>
    area.id === currentArea.id &&
    name.toLowerCase().indexOf(search.table.toLowerCase()) !== -1;

  const hasTablesInCurrentArea =
    currentArea.id && tables.some((table) => table.area.id === currentArea.id);

  const isCurrentTableInGroup =
    currentTable.parent ||
    tables.some((table) => table.parent?.id === currentTable.id);
  return (
    <div>
      <Row className="area-and-table-container">
        {/* AREA LIST */}
        <Col className="px-1 flex-container" xs="3">
          <div className="flex-header">
            <InlineSearch
              value={search.area}
              onChange={handleSearch}
              name="area"
              placeholder="Tìm khu vực..."
            />
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
            <Button
              block
              color="info"
              onClick={() => toggleModal("RESTORE_AREA")}
            >
              Khu vực đã khóa
            </Button>
          </div>
        </Col>
        {/* TABLE LIST */}
        <Col className="px-3 flex-container" xs="9">
          <div className="flex-header">
            <div className="d-flex align-items-center">
              <h4 className="mb-0 mr-2">{currentArea.name}</h4>
              <Button
                size="sm"
                color="warning"
                onClick={() => toggleModal("EDIT_AREA")}
              >
                <i className="fa fa-pencil"></i>
              </Button>
            </div>
            <InlineSearch
              formClassName="mw-40"
              value={search.table}
              onChange={handleSearch}
              name="table"
              placeholder="Tìm bàn..."
            />
          </div>
          <div className="flex-body">
            <div className="flex-scrollable table-container">
              {tables.filter(tableFilter).map((table, i) => (
                <TableDisplay
                  onClick={() => handleSelectTable(table)}
                  key={i}
                  current={table.id === currentTable.id}
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
              Bàn đã khóa
            </Button>
          </div>
        </Col>
      </Row>
      <AddAreaModal
        show={showModal.ADD_AREA}
        toggle={() => toggleModal("ADD_AREA")}
        handleAddArea={handlePushArea}
      />
      <EditAreaModal
        show={showModal.EDIT_AREA}
        toggle={() => toggleModal("EDIT_AREA")}
        area={currentArea}
        hasTables={hasTablesInCurrentArea}
        handleUpdateArea={handleUpdateArea}
        handleDeleteArea={handleDeleteArea}
      />
      <RestoreAreaModal
        show={showModal.RESTORE_AREA}
        toggle={() => toggleModal("RESTORE_AREA")}
        handleRestoreArea={handlePushArea}
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

function sortAreas(areas) {
  return areas.sort((a1, a2) => a1.name.localeCompare(a2.name));
}

export default TableAndArea;
