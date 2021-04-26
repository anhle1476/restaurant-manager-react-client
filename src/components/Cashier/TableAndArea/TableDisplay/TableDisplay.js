import React from "react";
import "./TableDisplay.scss";

import classnames from "classnames";

const TableDisplay = ({ table, disabled }) => {
  const isGrouping = Boolean(table.parent);

  return (
    <div
      className={classnames(
        "table-display",
        { "table-disabled": isGrouping || disabled },
        { "table-busy": false }
      )}
    >
      {table.name}
      {isGrouping && <span>(Gộp {table.parent.name})</span>}
    </div>
  );
};

export default TableDisplay;
