import React from "react";
import "./TableDisplay.scss";

import classnames from "classnames";

const TableDisplay = ({ table, group, busy, disabled, add }) => {
  if (add) return <div className="table-display table-add">+ Thêm bàn</div>;

  return (
    <div
      className={classnames(
        "table-display",
        { "table-disabled": group || disabled },
        { "table-busy": busy }
      )}
    >
      {table.name}
      {group && <span>(Gộp {group})</span>}
    </div>
  );
};

export default TableDisplay;
