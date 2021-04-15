import React, { useState, useEffect } from "react";

import {
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Button,
  Table,
} from "reactstrap";

import staffApi from "../../../api/staffApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

import s from "./RestoreStaffModal.module.scss";

const RestoreStaffModal = ({ show, toggle, handleRestoreStaff }) => {
  const [deleted, setDeleted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      const res = await staffApi.getAllDeleted();
      setDeleted(res.data);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    }
  };

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  const searchFilter = ({ username, fullname, phoneNumber, role }) => {
    const keyword = search.toLowerCase();
    return (
      username.toLowerCase().indexOf(keyword) !== -1 ||
      fullname.toLowerCase().indexOf(keyword) !== -1 ||
      phoneNumber.toLowerCase().indexOf(keyword) !== -1 ||
      role.name.toLowerCase().indexOf(keyword) !== -1
    );
  };

  const handleSubmitRestore = async (id) => {
    try {
      await staffApi.restore(id);
      const restored = deleted.find((d) => d.id === id);
      setDeleted(deleted.filter((d) => d.id !== id));
      restored.deleted = false;
      handleRestoreStaff(restored);
      toastSuccess("Khôi phục thành công");
    } catch (ex) {
      toastError("Khôi phục thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal
      className="modal-lg modal-dialog-scrollable"
      isOpen={show}
      toggle={toggle}
    >
      <ModalCustomHeader toggle={toggle}>Nhân viên đã khóa</ModalCustomHeader>
      <ModalBody className="bg-white">
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Input
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder="Tìm kiếm..."
            />
          </FormGroup>
        </Form>
        <Table className={s.restoreTable}>
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Họ và tên</th>
              <th>Số điện thoại</th>
              <th>Chức vụ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deleted.filter(searchFilter).map((d) => (
              <tr key={d.id}>
                <th>
                  <p className={s.tableRow}>{d.username}</p>
                </th>
                <th>
                  <p className={s.tableRow}>{d.fullname}</p>
                </th>
                <th>
                  <p className={s.tableRow}>{d.phoneNumber}</p>
                </th>
                <th>
                  <p className={s.tableRow}>{d.role.name}</p>
                </th>
                <th>
                  <Button
                    size="sm"
                    color="warning"
                    title="Khôi phục"
                    onClick={() => handleSubmitRestore(d.id)}
                  >
                    <i className="fa fa-undo"></i>
                  </Button>
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
        {deleted.length === 0 && (
          <p className="text-center">Không có nhân viên nào bị khóa</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={toggle}>
          Thoát
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RestoreStaffModal;
