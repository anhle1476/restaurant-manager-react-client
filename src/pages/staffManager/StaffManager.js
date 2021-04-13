import React, { useMemo, useState, useEffect } from "react";
import { Row, Col, Table } from "reactstrap";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

import GlobalFilter from "../../components/GlobalFilter";

import staffApi from "../../api/staffApi";

import s from "./StaffManager.module.scss";
import TablePagination from "../../components/TablePagination/TablePagination";

const COLUMNS_SCHEMA = [
  {
    Header: "Tài khoản",
    accessor: "username",
  },
  {
    Header: "Họ và tên",
    accessor: "fullname",
  },
  {
    Header: "Số điện thoại",
    accessor: "phoneNumber",
  },
  {
    Header: "Chức vụ",
    accessor: "role",
  },
];

const StaffManager = () => {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await staffApi.getAll();
        setStaffs(data);
      } catch (ex) {
        console.log(ex);
      }
    }
    fetchData();
  }, []);

  const data = useMemo(
    () => staffs.map((staff) => ({ ...staff, role: staff.role.name })),
    [staffs]
  );

  const columns = useMemo(() => COLUMNS_SCHEMA, []);

  const tableConfig = useTable(
    {
      columns,
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
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <Table {...getTableProps}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span className={s.sortIcon}>
                    {!column.isSorted ? null : column.isSortedDesc ? (
                      <i class="fa fa-sort-amount-desc" title="Lớn tới nhỏ"></i>
                    ) : (
                      <i class="fa fa-sort-amount-asc" title="Nhỏ tới lớn"></i>
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
      <TablePagination {...tableConfig} />
    </div>
  );
};

export default StaffManager;
