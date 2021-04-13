import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "reactstrap";

import staffApi from "../../api/staffApi";

import s from "./StaffManager.module.scss";

import CustomTable from "../../components/CustomTable/CustomTable";
import AddStaffModal from "../../components/AddStaffModal/AddStaffModal";

const StaffManager = () => {
  const [staffs, setStaffs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const tableData = staffs.map((staff) => ({
    ...staff,
    role: staff.role.name,
  }));

  const tableColumns = [
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
    {
      Header: "Lương/Ca",
      accessor: "salaryPerShift",
    },
    {
      Header: "",
      accessor: "id",
      Cell: ({ value }) => (
        <Button color="warning" onClick={() => console.log(value)}>
          <i className="fa fa-eye"></i>
        </Button>
      ),
    },
  ];

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  return (
    <>
      <Row>
        <Col>
          <h2>Quản lý nhân viên</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomTable tableData={tableData} tableColumns={tableColumns}>
            <Button color="warning" onClick={toggleAddModal}>
              Thêm nhân viên
            </Button>
          </CustomTable>
        </Col>
      </Row>

      <AddStaffModal show={showAddModal} toggle={toggleAddModal} />
    </>
  );
};

export default StaffManager;
