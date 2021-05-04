import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "reactstrap";
import DatePicker from "react-datepicker";

import CustomTable from "../../components/Table/CustomTable/CustomTable";

import billApi from "../../api/billApi";

import { toastError } from "../../utils/toastUtils";
import { formatMoney } from "../../utils/moneyUtils";
import { formatDateTime } from "../../utils/dateUtils";

import "react-datepicker/dist/react-datepicker.css";
import "./BillHistory.scss";
import BillHistoryModal from "../../components/BillHistoryModal/BillHistoryModal";

const BillHistory = () => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [bills, setBills] = useState([]);
  const [view, setView] = useState({});

  useEffect(() => {
    fetchBills(date);
  }, [date]);

  async function fetchBills(date) {
    try {
      setLoading(true);
      const res = await billApi.getBillsByDate(date);
      setBills(res.data);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  const formatTimeCell = ({ value }) => formatDateTime(value);

  const formatMoneyCell = ({ value }) => formatMoney(value);

  const handleShowModal = (id) => {
    const showView = bills.find((bill) => bill.id === id);
    setView(showView ? showView : {});
  };

  const tableData = bills.map((bill) => ({
    ...bill,
    total: bill.lastPrice + bill.discount - bill.surcharge,
    billId: bill.id,
  }));

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
      Cell: ({ value }) => value.name,
    },
    {
      Header: "Thu ngân",
      accessor: "staff",
      Cell: ({ value }) => value.fullname,
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
          <h2>Lịch sử hóa đơn</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomTable
            tableClassName="bill-table"
            tableData={tableData}
            tableColumns={tableColumns}
          >
            <Form onSubmit={(e) => e.preventDefault()}>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                className="custom-date-picker form-control"
                selected={date}
                onChange={setDate}
                closeOnScroll={true}
                todayButton="Today"
              />
              {loading ? (
                <span className="text-center ml-2">Đang tải...</span>
              ) : !bills.length ? (
                <span className="text-center ml-2">
                  Không có hóa đơn nào trong ngày này
                </span>
              ) : null}
            </Form>
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

export default BillHistory;
