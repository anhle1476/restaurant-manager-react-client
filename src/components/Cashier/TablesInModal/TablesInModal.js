import React from "react";

import TableDisplay from "../TableDisplay/TableDisplay";

import "./TablesInModal.scss";

const TablesInModal = ({
  tables,
  billsByTable = {},
  currentTableId = 0,
  selectedAreaId = 0,
  selector,
  onClick,
}) => {
  const currentAreaFilter = (table) =>
    selectedAreaId === 0 || table.area.id === selectedAreaId;

  const isCurrentTable = (table) => table.id === currentTableId;

  const isAChildOfAnotherTable = (table) =>
    Boolean(table.parent) && table.parent.id !== currentTableId;

  const isDisabled = (table) =>
    !isCurrentTable(table) &&
    (isAChildOfAnotherTable(table) || Boolean(billsByTable[table.id]?.id));

  return (
    <div className="tables-modal-view">
      {tables.filter(currentAreaFilter).map((table) => (
        <TableDisplay
          key={table.id}
          table={table}
          disabled={isDisabled(table)}
          selected={selector(table.id)}
          current={isCurrentTable(table)}
          onClick={() => onClick(table.id)}
        />
      ))}
    </div>
  );
};

export default TablesInModal;
