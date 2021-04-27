import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Button, Table } from "reactstrap";

import areaApi from "../../../../api/areaApi";
import { toastError, toastSuccess } from "../../../../utils/toastUtils";
import ModalCustomHeader from "../../../ModalCustomHeader/ModalCustomHeader";
import InlineSearch from "../../../InlineSearch/InlineSearch";

import s from "./RestoreAreaModal.module.scss";

const RestoreAreaModal = ({ show, toggle, handleRestoreArea }) => {
  const [deleted, setDeleted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      const res = await areaApi.getAllDeleted();
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
      await areaApi.restore(id);
      const restored = deleted.find((d) => d.id === id);
      setDeleted(deleted.filter((d) => d.id !== id));
      handleRestoreArea({ ...restored, deleted: false });
      toastSuccess("Khôi phục thành công");
    } catch (ex) {
      toastError("Khôi phục thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal className="modal-dialog-scrollable" isOpen={show} toggle={toggle}>
      <ModalCustomHeader toggle={toggle}>Khu vực đã khóa</ModalCustomHeader>
      <ModalBody className="bg-white">
        <InlineSearch
          value={search}
          onChange={handleSearch}
          placeholder="Tìm khu vực..."
        />
        <Table className={s.restoreTable}>
          <thead>
            <tr>
              <th>Tên khu vực</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deleted.filter(searchFilter).map((d) => (
              <tr key={d.id}>
                <th>
                  <p className={s.tableRow}>{d.name}</p>
                </th>
                <th className="d-flex justify-content-end">
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
          <p className="text-center">Không có khu vực nào bị khóa</p>
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

export default RestoreAreaModal;
