import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import TableDisplay from "../TableDisplay/TableDisplay";
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

import "./TableGroupingModal.scss";

const TableGroupingModal = ({
  show,
  toggle,
  tables,
  billsByTable,
  currentTable,
}) => {
  const [tableGroup, setTableGroup] = useState({});

  useEffect(() => {
    const parentId = currentTable.id;
    const children = tables
      .filter((table) => table.parent?.id === parentId)
      .map((table) => table.id);
    const childrenSet = new Set(children);
    setTableGroup({ parent: parentId, children: childrenSet });
  }, [tables, currentTable]);

  const currentTableId = currentTable.area?.id;

  const currentAreaFilter = (table) => table.area.id === currentTableId;

  const isSelected = (table) => tableGroup.children.has(table.id);

  const isCurrentTable = (table) => table.id === currentTableId;

  const isAChildOfAnotherTable = (table) =>
    Boolean(table.parent) && table.parent.id !== currentTableId;

  const isDisabled = (table) =>
    !isCurrentTable(table) &&
    (isAChildOfAnotherTable(table) || Boolean(billsByTable[table.id]?.id));

  return (
    <Modal
      className="modal-lg modal-dialog-scrollable"
      isOpen={show}
      toggle={toggle}
    >
      <ModalHeaderWithCloseBtn toggle={toggle}>
        Gộp bàn {currentTable.name}
      </ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white">
        <div className="table-grouping">
          {tables.filter(currentAreaFilter).map((table) => (
            <TableDisplay
              key={table.id}
              table={table}
              disabled={isDisabled(table)}
              selected={isSelected(table)}
              current={isCurrentTable(table)}
              onClick={() => console.log(table)}
            />
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={toggle}>
          Hủy
        </Button>
        <Button color="warning" type="submit">
          Lưu
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TableGroupingModal;
