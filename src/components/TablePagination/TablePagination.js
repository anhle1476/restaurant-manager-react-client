import React from "react";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Col,
  Row,
} from "reactstrap";

import s from "./TablePagination.module.scss";

function TablePagination({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  state: { pageIndex, pageSize },
}) {
  const handlePaginationClick = (e, doPaginate) => {
    e.preventDefault();
    doPaginate();
  };

  return (
    <Row className="table-pagination">
      <Col className={s.paginationContainer}>
        <Pagination>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink
              onClick={(e) => handlePaginationClick(e, () => gotoPage(0))}
            >
              &#8249;&#8249;
            </PaginationLink>
          </PaginationItem>
          <PaginationItem disabled={!canPreviousPage}>
            <PaginationLink
              onClick={(e) => handlePaginationClick(e, () => previousPage())}
            >
              &#8249;
            </PaginationLink>
          </PaginationItem>

          <PaginationItem disabled={!canNextPage}>
            <PaginationLink
              onClick={(e) => handlePaginationClick(e, () => nextPage())}
            >
              &#8250;
            </PaginationLink>
          </PaginationItem>
          <PaginationItem disabled={!canNextPage}>
            <PaginationLink
              onClick={(e) =>
                handlePaginationClick(e, () => gotoPage(pageCount - 1))
              }
            >
              &#8250;&#8250;
            </PaginationLink>
          </PaginationItem>
        </Pagination>
        <span>
          Trang{" "}
          <strong>
            {pageIndex + 1}/{pageOptions.length}
          </strong>{" "}
        </span>
      </Col>
      <Col className="d-flex justify-content-end">
        <Form inline onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Label>Đi đến trang: </Label>
            <Input
              type="number"
              min={1}
              max={pageCount}
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Hiển thị {pageSize}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
      </Col>
    </Row>
  );
}

export default TablePagination;
