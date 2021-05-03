import React from "react";
import "./TableDisplay.scss";

import classnames from "classnames";
import { formatVnd, getBillRawCost } from "../../../utils/moneyUtils";
import { formatTime } from "../../../utils/dateUtils";

const TableDisplay = ({
  table,
  current,
  selected,
  disabled,
  bill,
  reserving,
  onClick,
}) => {
  const isChild = Boolean(table.parent);

  const isBusy = Boolean(bill?.id);

  const isReserved = Boolean(reserving?.id) && !reserving.deleted;

  const total = isBusy ? getBillRawCost(bill) : 0;

  return (
    <div
      className={classnames(
        "table-display",
        { "table-child": isChild },
        { "table-busy": isBusy },
        { "table-reserved": isReserved },
        { "table-current": current },
        { "table-selected": selected },
        { "table-disabled": disabled }
      )}
      onClick={onClick}
    >
      {isBusy && (
        <span className="table-widget table-time">
          {formatTime(bill.startTime)}
        </span>
      )}
      {disabled && (
        <span className="table-widget table-in-use">Đã có khách</span>
      )}
      {isReserved && (
        <span className="table-widget table-reserved">
          <i className="fas fa-user text-white mr-1"></i>
          {formatTime(reserving.reservingTime)}
        </span>
      )}
      {table.name}
      {isChild && (
        <small className="table-in-group">(Ghép {table.parent.name})</small>
      )}
      {total > 0 && (
        <span className="table-widget table-total">{formatVnd(total)}</span>
      )}
    </div>
  );
};

export default TableDisplay;
