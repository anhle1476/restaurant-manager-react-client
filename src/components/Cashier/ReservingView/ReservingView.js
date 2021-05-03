import React, { useState, useEffect } from "react";
import { Button, Form, Input, Label, Table } from "reactstrap";
import DatePicker from "react-datepicker";

import reservingApi from "../../../api/reservingApi";
import {
  formatDateDayFirst,
  formatTime,
  fromToday,
} from "../../../utils/dateUtils";
import { toastErrorLeft, toastSuccessLeft } from "../../../utils/toastUtils";

import "react-datepicker/dist/react-datepicker.css";
import "./ReservingView.scss";
import EditReservingModal from "./EditReservingModal/EditReservingModal";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";

const ReservingView = ({ show, tables, refreshReservingState }) => {
  const [reservingOrders, setReservingOrders] = useState([]);
  const [date, setDate] = useState(new Date());
  const [modal, setModal] = useState("");
  const [edit, setEdit] = useState(undefined);
  const [doneConfirm, setDoneConfirm] = useState({});

  const [search, setSearch] = useState({
    keyword: "",
    state: "",
  });

  useEffect(() => {
    if (!show) return;
    const fetchByDate = async () => {
      try {
        const res = await reservingApi.getAllByDate(date);
        setReservingOrders(res.data);
      } catch (ex) {
        toastErrorLeft(
          "Lấy dữ liệu đặt bàn thất bại: " + ex.response?.data?.message
        );
      }
    };
    fetchByDate();
  }, [date, show]);

  const dayDisplay = formatDateDayFirst(date);

  const daysFromToday = fromToday(date);

  const cancelSubmit = (e) => e.preventDefault();

  const searchFilter = ({
    customerName,
    customerPhoneNumber,
    appTables,
    deleted,
  }) => {
    const stateCheck =
      search.state === ""
        ? true
        : (deleted && search.state === "true") ||
          (!deleted && search.state === "false");
    return (
      stateCheck &&
      (customerName.toLowerCase().indexOf(search.keyword) !== -1 ||
        customerPhoneNumber.indexOf(search.keyword) !== -1 ||
        appTables
          .map((t) => t.name)
          .join(", ")
          .indexOf(search.keyword) !== -1)
    );
  };

  const toggleModal = (modalName) => setModal(modal ? "" : modalName);

  const handleAddReservingOrder = (newOrder) => {
    setReservingOrders([...reservingOrders, newOrder]);
    if (daysFromToday === 0) refreshReservingState();
  };

  const handleEditReservingOrder = (updatedOrder) => {
    setReservingOrders(
      reservingOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    if (daysFromToday === 0) refreshReservingState();
  };

  const handleDoneReservingOrder = async () => {
    try {
      await reservingApi.softDelete(doneConfirm.id);
      handleEditReservingOrder({
        ...doneConfirm,
        deleted: true,
      });
      setDoneConfirm({});
      toastSuccessLeft("Thay đổi trạng thái đơn đặt bàn thành công");
    } catch (ex) {
      toastErrorLeft(
        "Thay đổi trạng thái đơn đặt bàn thất bại: " +
          ex.response?.data?.message
      );
    }
  };

  const handleToggleEdit = (order = {}) => {
    setEdit(order);
    toggleModal("EDIT");
  };

  const handleToggleDone = (order) => {
    setDoneConfirm(order);
    toggleModal("DONE_CONFIRM");
  };

  return (
    <>
      <div className="flex-container">
        <div className="flex-header">
          <Form className="form-flex" onSubmit={cancelSubmit}>
            <Label className="mr-2">Ngày đặt: </Label>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              className="custom-date-picker form-control"
              selected={date}
              onChange={setDate}
              closeOnScroll={true}
              todayButton="Today"
            />
          </Form>
          <Form className="form-flex filter-form" onSubmit={cancelSubmit}>
            <Input
              type="search"
              value={search.keyword}
              onChange={(e) =>
                setSearch({ ...search, keyword: e.target.value.toLowerCase() })
              }
              placeholder="Tìm kiếm..."
            />
            <Input
              id="status-filter"
              type="select"
              value={search.state}
              onChange={(e) => setSearch({ ...search, state: e.target.value })}
            >
              <option value="">Tất cả</option>
              <option value="true">Còn đặt</option>
              <option value="false">Xong</option>
            </Input>
          </Form>
        </div>
        <div className="flex-body">
          <div className="flex-scrollable">
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th>Giờ</th>
                    <th>Khách đặt</th>
                    <th>Số điện thoại</th>
                    <th>Bàn</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reservingOrders.length ? (
                    reservingOrders.filter(searchFilter).map((order) => (
                      <tr key={order.id}>
                        <td>{formatTime(order.reservingTime)}</td>
                        <td>{order.customerName}</td>
                        <td>{order.customerPhoneNumber}</td>
                        <td>
                          {order.appTables
                            .map((table) => table.name)
                            .join(", ")}
                        </td>
                        <td>{order.deleted ? "Xong" : "Còn đặt"}</td>
                        <td>
                          {!order.deleted && (
                            <>
                              <Button
                                size="sm"
                                className="mr-1"
                                title="Chỉnh sửa"
                                color="warning"
                                onClick={() => handleToggleEdit(order)}
                              >
                                <i className="fas fa-pen"></i>
                              </Button>
                              <Button
                                size="sm"
                                title="Đánh dấu đã xong (Hệ thống sẽ tự đánh dấu nếu quá giờ đặt 2 tiếng)"
                                color="primary"
                                onClick={() => handleToggleDone(order)}
                              >
                                <i className="fas fa-check"></i>
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Không có bàn nào được đặt
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <div className="flex-footer">
          <Button
            block
            onClick={() => handleToggleEdit()}
            disabled={daysFromToday > 0}
            color="warning"
          >
            Đặt bàn ngày {dayDisplay}
          </Button>
        </div>
      </div>

      <EditReservingModal
        show={modal === "EDIT"}
        toggle={() => handleToggleEdit()}
        currentOrders={reservingOrders}
        tables={tables}
        date={date}
        reserving={edit}
        handleAdd={handleAddReservingOrder}
        handleEdit={handleEditReservingOrder}
      />
      <ConfirmModal
        show={modal === "DONE_CONFIRM"}
        toggle={() => handleToggleDone()}
        confirm={String(doneConfirm?.id)}
        onAccept={handleDoneReservingOrder}
        title="Xác nhận xong đơn đặt bàn"
      />
    </>
  );
};

export default ReservingView;
