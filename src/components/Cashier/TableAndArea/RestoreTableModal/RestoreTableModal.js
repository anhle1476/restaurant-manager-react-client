import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Button, Table } from "reactstrap";

import tableApi from "../../../../api/tableApi";
import { toastError, toastSuccess } from "../../../../utils/toastUtils";
import InlineSearch from "../../../InlineSearch/InlineSearch";
import ModalHeaderWithCloseBtn from "../../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

import s from "./RestoreTableModal.module.scss";

const RestoreTableModal = ({ show, toggle, handleRestoreTable }) => {
  const [deleted, setDeleted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      const res = await tableApi.getAllDeleted();
      setDeleted(res.data);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    }
  };

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  const searchFilter = ({ name, area }) => {
    const keyword = search.toLowerCase();
    return (
      name.toLowerCase().indexOf(keyword) !== -1 ||
      area.name.toLowerCase().indexOf(keyword) !== -1
    );
  };

  const handleSubmitRestore = async (id) => {
    try {
      await tableApi.restore(id);
      const restored = deleted.find((d) => d.id === id);
      setDeleted(deleted.filter((d) => d.id !== id));
      handleRestoreTable({ ...restored, deleted: false });
      toastSuccess("Khôi phục thành công");
    } catch (ex) {
      toastError("Khôi phục thất bại: " + ex?.response?.data?.message);
      console.log(ex.response.data);
    }
  };

  return (
    <Modal className="modal-dialog-scrollable" isOpen={show} toggle={toggle}>
      <ModalHeaderWithCloseBtn toggle={toggle}>
        Bàn đã khóa
      </ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white">
        <InlineSearch
          value={search}
          onChange={handleSearch}
          placeholder="Tìm bàn..."
        />
        <Table className={s.restoreTable}>
          <thead>
            <tr>
              <th>Tên bàn</th>
              <th>Khu vực</th>
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
                  <p className={s.tableRow}>
                    {d.area.name}
                    {d.area.deleted && <i>(Đã khóa)</i>}
                  </p>
                </th>
                <th className="d-flex justify-content-end">
                  <Button
                    disabled={d.area.deleted}
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
          <p className="text-center">Không có bàn nào bị khóa</p>
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

export default RestoreTableModal;
