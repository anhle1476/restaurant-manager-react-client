import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Button, Table } from "reactstrap";

import roleApi from "../../../api/roleApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import InlineSearch from "../../InlineSearch/InlineSearch";
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

import s from "./RestoreRoleModal.module.scss";

const RestoreRoleModal = ({ show, toggle, handleRestoreRole }) => {
  const [deleted, setDeleted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      const res = await roleApi.getAllDeleted();
      setDeleted(res.data);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    }
  };

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  const searchFilter = ({ name, code }) => {
    const keyword = search.toLowerCase();
    return (
      name.toLowerCase().indexOf(keyword) !== -1 ||
      code.toLowerCase().indexOf(keyword) !== -1
    );
  };

  const handleSubmitRestore = async (id) => {
    try {
      await roleApi.restore(id);
      const restored = deleted.find((d) => d.id === id);
      setDeleted(deleted.filter((d) => d.id !== id));
      restored.deleted = false;
      handleRestoreRole(restored);
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
      <ModalHeaderWithCloseBtn toggle={toggle}>
        Chức vụ đã khóa
      </ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white">
        <InlineSearch
          value={search}
          onChange={handleSearch}
          placeholder="Tìm chức vụ..."
        />
        <Table className={s.restoreTable}>
          <thead>
            <tr>
              <th>Tên chức vụ</th>
              <th>Mã</th>
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
                  <p className={s.tableRow}>{d.code}</p>
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
          <p className="text-center">Không có chức vụ nào bị khóa</p>
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

export default RestoreRoleModal;
