import React from "react";
import "./TableDisplay.scss";

import classnames from "classnames";

const TableDisplay = ({
  table,
  disabled,
  current,
  busy,
  selected,
  noSelect,
  onClick,
}) => {
  const isGrouping = Boolean(table.parent);

  return (
    <div
      className={classnames(
        "table-display",
        { "table-disabled": isGrouping || disabled },
        { "table-busy": busy },
        { "table-current": current },
        { "table-selected": selected },
        { "table-no-select": noSelect }
      )}
      onClick={onClick}
    >
      {table.name}
      {isGrouping && <small>(Ghép {table.parent.name})</small>}
    </div>
  );
};

export default TableDisplay;
