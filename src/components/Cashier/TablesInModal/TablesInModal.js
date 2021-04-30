import React from "react";

import TableDisplay from "../TableDisplay/TableDisplay";

import "./TablesInModal.scss";

const TablesInModal = ({
  tables,
  billsByTable,
  currentTableId,
  selectedAreaId,
  selector,
  onClick,
}) => {
  const currentAreaFilter = (table) => table.area.id === selectedAreaId;

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
