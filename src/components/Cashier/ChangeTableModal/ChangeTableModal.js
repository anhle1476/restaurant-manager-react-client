import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";
import TablesInModal from "../TablesInModal/TablesInModal";

import { toastError, toastSuccessLeft } from "../../../utils/toastUtils";
import tableApi from "../../../api/tableApi";

const ChangeTableModal = ({
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

  const isSelected = (tableId) => tableGroup.children.has(tableId);

  const handleSelectTable = (tableId) => {
    if (tableId === tableGroup.parent) return;
    const childrenSet = tableGroup.children;
    if (isSelected(tableId)) childrenSet.delete(tableId);
    else childrenSet.add(tableId);
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
          <TablesInModal
            tables={tables}
            billsByTable={billsByTable}
            currentTableId={currentTable.id}
            selectedAreaId={currentTable.area.id}
            selector={isSelected}
            onClick={handleSelectTable}
          />
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

export default ChangeTableModal;
