import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "reactstrap";

import staffApi from "../../api/staffApi";

//import s from "./StaffManager.module.scss";

import CustomTable from "../../components/CustomTable/CustomTable";
import AddStaffModal from "../../components/AddStaffModal/AddStaffModal";
import EditStaffModal from "../../components/EditStaffModal/EditStaffModal";

const STAFF_SCHEMA = {
  id: 0,
  username: "",
  fullname: "",
  phoneNumber: "",
  salaryPerShift: 0,
  role: {},
  deleted: false,
};

const StaffManager = () => {
  const [staffs, setStaffs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStaff, setEditStaff] = useState(STAFF_SCHEMA);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await staffApi.getAll();
        setStaffs(res.data);
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
        <Button color="warning" onClick={() => toggleEditModal(value)}>
          <i className="fa fa-eye"></i>
        </Button>
      ),
    },
  ];

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const addStaff = (newStaff) => {
    setStaffs([...staffs, newStaff]);
  };

  const toggleEditModal = (id) => {
    let editing = id ? staffs.find((s) => s.id === id) : undefined;
    setEditStaff(editing ? editing : STAFF_SCHEMA);
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

      <AddStaffModal
        show={showAddModal}
        toggle={toggleAddModal}
        addStaff={addStaff}
      />
      <EditStaffModal
        show={Boolean(editStaff.id)}
        toggle={toggleEditModal}
        staff={editStaff}
      />
    </>
  );
};

export default StaffManager;
