import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Row, Col, Button } from "reactstrap";
import billApi from "../../api/billApi";
import foodApi from "../../api/foodApi";
import ChefOrderDisplay from "../../components/Chef/ChefOrderDisplay/ChefOrderDisplay";
import { toastErrorLeft, toastSuccessLeft } from "../../utils/toastUtils";
import { parseBillsToOrders, parseFoodsToOptions } from "./chefService";
import { groupBadgeStyles, groupStyles } from "./optionsGroupStyle";

import "./ChefView.scss";

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const ChefView = () => {
  const [orders, setOrders] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    refreshOrders();
    const ordersUpdateInterval = setInterval(refreshOrders, 30000);
    return () => {
      clearInterval(ordersUpdateInterval);
    };
  }, []);

  useEffect(() => {
    fetchOptions();
  }, []);

  async function refreshOrders() {
    try {
      console.log("update bill");
      const res = await billApi.getCurrentBills();
      setOrders(parseBillsToOrders(res.data));
    } catch (ex) {
      toastErrorLeft(
        "Tự động cập nhật dữ liệu hóa đơn thất bại:" +
          ex.response?.data?.message
      );
    }
  }

  async function fetchOptions() {
    try {
      const res = await foodApi.getAll();
      console.log(res.data);
      setOptions(parseFoodsToOptions(res.data));
    } catch (ex) {
      toastErrorLeft(
        "Lấy dữ liệu món ăn thất bại: " + ex.response?.data?.message
      );
    }
  }

  const handleSubmitOrder = async (data) => {
    try {
      await billApi.processFood(data);
      refreshOrders();
      toastSuccessLeft("Xử lý đơn hàng thành công");
    } catch (ex) {
      toastErrorLeft("Xử lý đơn hàng thất bại: " + ex.response?.data?.message);
    }
  };

  const searchPassOrders = orders.filter(
    (order) =>
      !selected.length || selected.some(({ value }) => value === order.food.id)
  );

  return (
    <div className="px-3 chef-container">
      <Row className="chef-header py-2">
        <Col>
          <Link to="/app/dashboard">
            ❮ <strong> Trở về</strong>
          </Link>
          <div className="d-flex justify-content-end align-items-center">
            <Button
              title="Làm mới dữ liệu"
              color="secondary"
              onClick={refreshOrders}
              outline
            >
              <i className="fas fa-sync-alt"></i>
            </Button>
            <h4 className="mb-0"> Màn hình bếp</h4>
          </div>
        </Col>
      </Row>
      <Row className="chef-content">
        <Col>
          <Select
            options={options}
            isMulti
            onChange={setSelected}
            formatGroupLabel={formatGroupLabel}
            placeholder="Tìm theo món..."
          />
          <div className="chef-order-container">
            {searchPassOrders.map((order) => (
              <ChefOrderDisplay
                key={order.id}
                order={order}
                handleSubmit={handleSubmitOrder}
              />
            ))}
          </div>
        </Col>
        {orders.length !== searchPassOrders.length && (
          <div className="search-result">
            Tìm được {searchPassOrders.length}/{orders.length} đơn hàng
          </div>
        )}
      </Row>
    </div>
  );
};

export default ChefView;
