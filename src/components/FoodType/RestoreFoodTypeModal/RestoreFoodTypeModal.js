import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Button, Table } from "reactstrap";

import foodTypeApi from "../../../api/foodTypeApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import InlineSearch from "../../InlineSearch/InlineSearch";
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";

import s from "./RestoreFoodTypeModal.module.scss";

const RestoreFoodTypeModal = ({ show, toggle, handleRestoreFoodType }) => {
  const [deleted, setDeleted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      const res = await foodTypeApi.getAllDeleted();
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
      await foodTypeApi.restore(id);
      const restored = deleted.find((d) => d.id === id);
      setDeleted(deleted.filter((d) => d.id !== id));
      restored.deleted = false;
      handleRestoreFoodType(restored);
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
        Loại món đã khóa
      </ModalHeaderWithCloseBtn>
      <ModalBody className="bg-white">
        <InlineSearch
          value={search}
          onChange={handleSearch}
          placeholder="Tìm loại món..."
        />
        <Table className={s.restoreTable}>
          <thead>
            <tr>
              <th>Tên loại món</th>
              <th>Được trả món</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deleted.filter(searchFilter).map((foodType) => (
              <tr key={foodType.id}>
                <th>
                  <p className={s.tableRow}>{foodType.name}</p>
                </th>
                <th>
                  <p className={s.tableRow}>
                    {foodType.refundable ? "Có" : "Không"}
                  </p>
                </th>
                <th>
                  <Button
                    size="sm"
                    color="warning"
                    title="Khôi phục"
                    onClick={() => handleSubmitRestore(foodType.id)}
                  >
                    <i className="fa fa-undo"></i>
                  </Button>
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
        {deleted.length === 0 && (
          <p className="text-center">Không có loại món nào bị khóa</p>
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

export default RestoreFoodTypeModal;
