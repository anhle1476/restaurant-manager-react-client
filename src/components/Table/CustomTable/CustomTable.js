import React, { useMemo } from "react";
import { Table, Row, Col } from "reactstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import GlobalFilter from "../GlobalFilter/GlobalFilter";
import TablePagination from "../TablePagination/TablePagination";

import s from "./CustomTable.module.scss";

const CustomTable = ({ tableData, tableColumns, children }) => {
  const data = useMemo(() => tableData, [tableData]);

  const tableConfig = useTable(
    {
      columns: tableColumns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = tableConfig;

  return (
    <div className={s.root}>
      <Row className="mb-1">
        <Col>{children}</Col>
        <Col className="d-flex justify-content-end">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Col>
      </Row>
      <Row>
        <Col className="table-responsive">
          <Table {...getTableProps} bordered>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span className={s.sortIcon}>
                        {!column.isSorted ? null : column.isSortedDesc ? (
                          <i
                            className="fa fa-sort-amount-desc"
                            title="Sắp xếp giảm dần"
                          ></i>
                        ) : (
                          <i
                            className="fa fa-sort-amount-asc"
                            title="Sắp xếp tăng dần"
                          ></i>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <TablePagination {...tableConfig} />
        </Col>
      </Row>
    </div>
  );
};

export default CustomTable;
