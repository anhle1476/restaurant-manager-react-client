import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "reactstrap";

import staffApi from "../../api/staffApi";

import CustomTable from "../../components/Table/CustomTable/CustomTable";
import AddStaffModal from "../../components/Staff/AddStaffModal/AddStaffModal";
import EditStaffModal from "../../components/Staff/EditStaffModal/EditStaffModal";
import RestoreStaffModal from "../../components/Staff/RestoreStaffModal/RestoreStaffModal";

import { toastError } from "../../utils/toastUtils";

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
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [editStaff, setEditStaff] = useState(STAFF_SCHEMA);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await staffApi.getAll();
        setStaffs(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
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

  const toggleRestoreModal = () => {
    setShowRestoreModal(!showRestoreModal);
  };

  const handleAddStaff = (newStaff) => {
    setStaffs([...staffs, newStaff]);
  };

  const toggleEditModal = (id) => {
    let editing = id ? staffs.find((s) => s.id === id) : undefined;
    setEditStaff(editing ? editing : STAFF_SCHEMA);
  };

  const handleEditStaff = (edited) => {
    setStaffs(staffs.map((s) => (s.id === edited.id ? edited : s)));
  };

  const handleDeleteStaff = (id) => {
    setStaffs(staffs.filter((s) => s.id !== id));
  };

  const handleRestoreStaff = (restored) => {
    setStaffs([...staffs, restored]);
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
      <Button color="primary" onClick={toggleRestoreModal}>
        Nhân viên đã khóa
      </Button>

      <AddStaffModal
        show={showAddModal}
        toggle={toggleAddModal}
        handleAddStaff={handleAddStaff}
      />
      <EditStaffModal
        show={Boolean(editStaff.id)}
        toggle={toggleEditModal}
        staff={editStaff}
        handleEditStaff={handleEditStaff}
        handleDeleteStaff={handleDeleteStaff}
      />
      <RestoreStaffModal
        show={showRestoreModal}
        toggle={toggleRestoreModal}
        handleRestoreStaff={handleRestoreStaff}
      ></RestoreStaffModal>
    </>
  );
};

export default StaffManager;
