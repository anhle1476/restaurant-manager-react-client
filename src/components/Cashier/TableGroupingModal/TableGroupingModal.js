import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import TableDisplay from "../TableDisplay/TableDisplay";
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

import "./TableGroupingModal.scss";
import { toastError, toastSuccessLeft } from "../../../utils/toastUtils";
import tableApi from "../../../api/tableApi";

const TableGroupingModal = ({
  show,
  toggle,
  tables,
  billsByTable,
  currentTable,
  updateTablesState,
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

  const currentAreaFilter = (table) => table.area.id === currentTable.area.id;

  const isSelected = (table) => tableGroup.children.has(table.id);

  const isCurrentTable = (table) => table.id === tableGroup.parent;

  const isAChildOfAnotherTable = (table) =>
    Boolean(table.parent) && table.parent.id !== tableGroup.parent;

  const isDisabled = (table) =>
    !isCurrentTable(table) &&
    (isAChildOfAnotherTable(table) || Boolean(billsByTable[table.id]?.id));

  const handleSelectTable = (table) => {
    if (isCurrentTable(table)) return;
    const childrenSet = tableGroup.children;
    if (isSelected(table)) childrenSet.delete(table.id);
    else childrenSet.add(table.id);
    setTableGroup({ ...tableGroup, children: childrenSet });
  };

  const handleSubmitGroupingTable = async () => {
    try {
      const res = await tableApi.grouping(tableGroup);
      updateTablesState(res.data);
      toastSuccessLeft("Gộp bàn thành công");
    } catch (ex) {
      toastError("Gộp bàn thất bại: " + ex.response?.data?.message);
    }
  };

  const handleSubmitSeparatingTable = async () => {
    try {
      const res = await tableApi.separate(tableGroup.parent);
      updateTablesState(res.data);
      toastSuccessLeft("Tách bàn thành công");
    } catch (ex) {
      toastError("Tách bàn đã gộp thất bại: " + ex.response?.data?.message);
    }
  };

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
        {show && (
          <div className="table-grouping">
            {tables.filter(currentAreaFilter).map((table) => (
              <TableDisplay
                key={table.id}
                table={table}
                disabled={isDisabled(table)}
                selected={isSelected(table)}
                current={isCurrentTable(table)}
                onClick={() => handleSelectTable(table)}
              />
            ))}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          className="my-0 mx-1"
          onClick={handleSubmitSeparatingTable}
          block
          disabled={!tableGroup.children?.size}
        >
          Tách toàn bộ bàn con
        </Button>
        <Button
          color="warning"
          className="my-0 mx-1"
          onClick={handleSubmitGroupingTable}
          block
        >
          Lưu trạng thái gộp
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TableGroupingModal;
