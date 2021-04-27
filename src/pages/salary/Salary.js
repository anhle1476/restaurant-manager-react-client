import React, { useState, useEffect } from "react";
import { Row, Col, Button, Label, Form, FormGroup, Input } from "reactstrap";

import CustomTable from "../../components/Table/CustomTable/CustomTable";

import salaryApi from "../../api/salaryApi";

import { toastError } from "../../utils/toastUtils";
import SalaryDetailModal from "../../components/Salary/SalaryDetailModal/SalaryDetailModal";
import { formatVnd } from "../../utils/moneyUtils";

const CURRENT_YEAR_MONTH = {
  year: String(new Date().getFullYear()),
  month: String(new Date().getMonth() + 1),
};

const Salary = () => {
  const [loading, setLoading] = useState(false);
  const [yearMonth, setYearMonth] = useState(CURRENT_YEAR_MONTH);
  const [currentYearMonth, setCurrentYearMonth] = useState(CURRENT_YEAR_MONTH);
  const [salaryDetails, setSalaryDetails] = useState([]);
  const [detailsModal, setDetailsModal] = useState({});

  useEffect(() => {
    fetchData(CURRENT_YEAR_MONTH.year, CURRENT_YEAR_MONTH.month);
  }, []);

  const fetchData = async (year, month) => {
    setLoading(true);
    setCurrentYearMonth({ year, month });
    try {
      const res = await salaryApi.getAllDetailsByMonth(year, month);
      setSalaryDetails(mapSalaryDetailsToTable(res.data));
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      console.log(ex.response?.data);
    }
    setLoading(false);
  };

  const tableColumns = [
    {
      Header: "Nhân viên",
      accessor: "staffName",
    },
    {
      Header: "Chức vụ",
      accessor: "staffRole",
    },
    {
      Header: "Số ca",
      accessor: "numberOfShift",
    },
    {
      Header: "Số vi phạm",
      accessor: "numberOfViolations",
    },
    {
      Header: "Lương",
      accessor: "salary",
      Cell: ({ value }) => formatVnd(value),
    },
    {
      Header: "",
      accessor: "id",
      Cell: ({ value }) => (
        <Button
          color="warning"
          title="Chi tiết"
          onClick={() => toggleDetailsModal(value)}
        >
          <i className="fa fa-eye"></i>
        </Button>
      ),
    },
  ];

  const handleChangeYearMonth = ({ target }) => {
    setYearMonth({ ...yearMonth, [target.name]: target.value });
  };

  const handleSubmitFindDetailsByMonth = (e) => {
    e.preventDefault();
    fetchData(yearMonth.year, yearMonth.month);
  };

  const toggleDetailsModal = (id) => {
    setDetailsModal(id ? salaryDetails.find((s) => s.id === id) : {});
  };

  const isShowDetailModal = Boolean(detailsModal.id);

  return (
    <div>
      <Row>
        <Col md="6" sm="12">
          <Form onSubmit={handleSubmitFindDetailsByMonth}>
            <Row>
              <Col className="mx-0 px-0">
                <FormGroup className="mb-0">
                  <Label for="month">Tháng</Label>
                  <Input
                    type="number"
                    name="month"
                    value={yearMonth.month}
                    onChange={handleChangeYearMonth}
                    min="1"
                    max="12"
                  />
                </FormGroup>
              </Col>
              <Col className="mx-0 px-0">
                <FormGroup className="mb-0">
                  <Label for="month">Năm</Label>
                  <Input
                    name="year"
                    type="number"
                    value={yearMonth.year}
                    onChange={handleChangeYearMonth}
                    min="1970"
                    max={CURRENT_YEAR_MONTH.year}
                  />
                </FormGroup>
              </Col>
              <Col className="px-0 d-flex align-items-end">
                <Button color="warning" type="submit">
                  Tìm
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          {loading ? (
            <h3 className="text-center">Đang tải dữ liệu</h3>
          ) : salaryDetails.length ? (
            <CustomTable tableData={salaryDetails} tableColumns={tableColumns}>
              <h3 className="mb-0">
                Lương tháng {currentYearMonth.month}/{currentYearMonth.year}
              </h3>
            </CustomTable>
          ) : (
            <h3 className="text-center">
              Không có thông tin về tháng {currentYearMonth.month}/
              {currentYearMonth.year}
            </h3>
          )}
        </Col>
      </Row>
      <SalaryDetailModal
        show={isShowDetailModal}
        toggle={() => toggleDetailsModal()}
        details={detailsModal}
      />
    </div>
  );
};

function mapSalaryDetailsToTable(salaryDetails) {
  return salaryDetails.map((s) => ({
    ...s,
    staffName: s.staff.fullname,
    staffRole: s.staff.role.name,
    numberOfViolations: s.violationDetails.length,
  }));
}

export default Salary;
