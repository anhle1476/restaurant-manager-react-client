import React, { useState } from "react";
import { Row, Col, Button, Form, FormGroup, Input } from "reactstrap";

import CustomTable from "../../components/Table/CustomTable/CustomTable";

import billApi from "../../api/billApi";

import { toastError } from "../../utils/toastUtils";
import { formatMoney } from "../../utils/moneyUtils";
import { formatDateTime } from "../../utils/dateUtils";

import "./BillSearch.scss";
import BillHistoryModal from "../../components/BillHistoryModal/BillHistoryModal";

const BillSearch = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [bills, setBills] = useState([]);
  const [view, setView] = useState({});

  async function fetchBills() {
    try {
      setLoading(true);
      const res = await billApi.searchById(search);
      const parsedData = res.data.map((bill) => ({
        ...bill,
        total: bill.lastPrice + bill.discount - bill.surcharge,
        billId: bill.id,
      }));
      console.log(parsedData);
      setBills(parsedData);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBills();
  };

  const formatTimeCell = ({ value }) => formatDateTime(value);

  const formatMoneyCell = ({ value }) => formatMoney(value);

  const handleShowModal = (id) => {
    const showView = bills.find((bill) => bill.id === id);
    setView(showView ? showView : {});
  };

  const tableColumns = [
    {
      Header: "Mã hóa đơn",
      accessor: "billId",
      Cell: ({ value }) => <span title={value}>{value}</span>,
    },
    {
      Header: "Giờ vào",
      accessor: "startTime",
      Cell: formatTimeCell,
    },
    {
      Header: "Giờ ra",
      accessor: "payTime",
      Cell: formatTimeCell,
    },
    {
      Header: "Bàn",
      accessor: "appTable",
      Cell: ({ value }) => value?.name,
    },
    {
      Header: "Thu ngân",
      accessor: "staff",
      Cell: ({ value }) => value?.fullname,
    },
    {
      Header: "Giá trị (₫)",
      accessor: "total",
      Cell: formatMoneyCell,
    },
    {
      Header: "Giảm giá (₫)",
      accessor: "discount",
      Cell: formatMoneyCell,
    },
    {
      Header: "Phụ thu (₫)",
      accessor: "surcharge",
      Cell: formatMoneyCell,
    },
    {
      Header: "Tổng tiền (₫)",
      accessor: "lastPrice",
      Cell: formatMoneyCell,
    },
    {
      Header: "",
      accessor: "id",
      Cell: ({ value }) => (
        <Button
          size="sm"
          color="warning"
          onClick={() => handleShowModal(value)}
        >
          <i className="fa fa-eye"></i>
        </Button>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col>
          <h2>Tìm hóa đơn</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form
            onSubmit={handleSearchSubmit}
            inline
            className="bill-search-form"
          >
            <FormGroup className="bill-search-form-group">
              <Input
                required
                placeholder="Nhập mã hóa đơn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button color="warning" type="submit">
                Tìm
              </Button>
            </FormGroup>
          </Form>
          <CustomTable
            tableClassName="bill-table"
            tableData={bills}
            tableColumns={tableColumns}
          >
            {loading ? (
              <span>Đang tìm kiếm...</span>
            ) : (
              <span>
                {bills.length
                  ? `${bills.length} kết quả`
                  : "Không có kết quả nào trùng khớp"}
              </span>
            )}
          </CustomTable>
        </Col>
      </Row>
      <BillHistoryModal
        show={Boolean(view.id)}
        toggle={() => setView({})}
        bill={view}
      />
    </>
  );
};

export default BillSearch;
