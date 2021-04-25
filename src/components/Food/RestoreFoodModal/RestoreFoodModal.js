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

import foodApi from "../../../api/foodApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalCustomHeader from "../../ModalCustomHeader/ModalCustomHeader";

import s from "./RestoreFoodModal.module.scss";

const RestoreFoodModal = ({ show, toggle, handleRestoreFood }) => {
  const [deleted, setDeleted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) fetchData();
  }, [show]);

  const fetchData = async () => {
    try {
      const res = await foodApi.getAllDeleted();
      setDeleted(res.data);
    } catch (ex) {
      toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
    }
  };

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  const searchFilter = ({ name, foodType }) => {
    const keyword = search.toLowerCase();
    return (
      name.toLowerCase().indexOf(keyword) !== -1 ||
      foodType.name.toLowerCase().indexOf(keyword) !== -1
    );
  };

  const handleSubmitRestore = async (id) => {
    try {
      await foodApi.restore(id);
      const restored = deleted.find((d) => d.id === id);
      setDeleted(deleted.filter((d) => d.id !== id));
      restored.deleted = false;
      handleRestoreFood(restored);
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
      <ModalCustomHeader toggle={toggle}>Món ăn đã khóa</ModalCustomHeader>
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
              <th></th>
              <th>Tên</th>
              <th>Loại món</th>
              <th>Giá</th>
              <th>Đơn vị</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deleted.filter(searchFilter).map((food) => (
              <tr key={food.id}>
                <th>
                  <p className="d-flex justify-content-center">
                    <img src={food.imageUrl} alt="deleted food" height="50" />
                  </p>
                </th>
                <th>
                  <p className={s.tableRow}>{food.name}</p>
                </th>
                <th>
                  <p className={s.tableRow}>
                    {food.foodType.name}{" "}
                    {food.foodType.deleted && <i>(Đã khóa)</i>}
                  </p>
                </th>
                <th>
                  <p className={s.tableRow}>{food.price}</p>
                </th>
                <th>
                  <p className={s.tableRow}>{food.unit}</p>
                </th>
                <th>
                  <Button
                    disabled={food.foodType.deleted}
                    size="sm"
                    color="warning"
                    title="Khôi phục"
                    onClick={() => handleSubmitRestore(food.id)}
                  >
                    <i className="fa fa-undo"></i>
                  </Button>
                </th>
              </tr>
            ))}
          </tbody>
        </Table>
        {deleted.length === 0 && (
          <p className="text-center">Không có món nào bị khóa</p>
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

export default RestoreFoodModal;
