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

import violationApi from "../../../api/violationApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

import s from "./RestoreViolationModal.module.scss";

const RestoreViolationModal = ({ show, toggle, handleRestoreViolation }) => {
  const [deleted, setDeleted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      const res = await violationApi.getAllDeleted();
      setDeleted(res.data);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    }
  };

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  const searchFilter = ({ name }) =>
    name.toLowerCase().indexOf(search.toLowerCase()) !== -1;

  const handleSubmitRestore = async (id) => {
    try {
      await violationApi.restore(id);
      const restored = deleted.find((d) => d.id === id);
      setDeleted(deleted.filter((d) => d.id !== id));
      restored.deleted = false;
      handleRestoreViolation(restored);
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
      <ModalCustomHeader toggle={toggle}>Vi phạm đã khóa</ModalCustomHeader>
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
              <th>Tên chức vụ</th>
              <th>Mức phạt theo ca</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deleted.filter(searchFilter).map((d) => (
              <tr key={d.id}>
                <th>
                  <p className={s.tableRow}>{d.name}</p>
                </th>
                <th>
                  <p className={s.tableRow}>{d.finesPercent}%</p>
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
          <p className="text-center">Không có vi phạm nào bị khóa</p>
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

export default RestoreViolationModal;
