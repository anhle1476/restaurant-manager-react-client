import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import classnames from "classnames";
import {
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

import "./CashierView.scss";
import tableApi from "../../api/tableApi";
import foodApi from "../../api/foodApi";
import billApi from "../../api/billApi";
import { deleteBillActions, changeBillActions } from "./billUpdate";
import TableAndArea from "../../components/Cashier/TableAndArea/TableAndArea";
import MenuView from "../../components/Cashier/MenuView/MenuView";
import OrderView from "../../components/Cashier/OrderView/OrderView";
import { toastErrorLeft, toastSuccessLeft } from "../../utils/toastUtils";
import { separateTable } from "./tableUpdate";

const CashierView = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [currentTable, setCurrentTable] = useState({});

  const [tables, setTables] = useState([]);
  const [foods, setFoods] = useState([]);
  const [billsByTable, setBillsByTable] = useState({});

  const handleSelectTable = (table) => {
    setCurrentTable(!table.parent ? table : table.parent);
  };

  useEffect(() => {
    Promise.all([
      tableApi.getAll(),
      foodApi.getAll(),
      billApi.getCurrentBillsByTable(),
    ]).then(([tableRes, foodRes, billRes]) => {
      const tableData = tableRes.data;
      if (tableData.length) {
        sortTables(tableData);
        setTables(tableData);
        handleSelectTable(tableData[0]);
      }
      setFoods(foodRes.data);
      setBillsByTable(billRes.data);
    });
  }, []);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const sortAndSetTables = (data) => {
    setTables(sortTables(data));
  };

  const handlePushTable = (newTable) => {
    sortAndSetTables([...tables, newTable]);
  };

  const handleUpdateTable = (updated) => {
    sortAndSetTables(
      tables.map((table) => (table.id === updated.id ? updated : table))
    );
    setCurrentTable(updated);
  };

  const handleDeleteTable = (id) => {
    setTables(tables.filter((table) => table.id !== id));
    handleSelectTable(tables.length ? tables[0] : {});
  };

  const handleSelectFood = (food, amount = 1) => {
    const billOfTable = billsByTable[currentTable.id];
    const updatedBill = changeBillActions.plusAmount(
      billOfTable,
      food,
      amount,
      currentTable
    );
    setBillsByTable({ ...billsByTable, [currentTable.id]: updatedBill });
  };

  const handleTypeOrderAmount = (food, amount) => {
    const billOfTable = billsByTable[currentTable.id];
    const updatedBill = changeBillActions.toAmount(billOfTable, food, amount);
    setBillsByTable({ ...billsByTable, [currentTable.id]: updatedBill });
  };

  const handleDeleteOrderDetail = (foodId) => {
    const billOfTable = billsByTable[currentTable.id];
    const updatedBill = changeBillActions.removeFood(billOfTable, foodId);
    setBillsByTable({ ...billsByTable, [currentTable.id]: updatedBill });
  };

  const handleSaveBill = async () => {
    try {
      const res = await billApi.saveOrUpdate(billsByTable[currentTable.id]);
      setBillsByTable({ ...billsByTable, [currentTable.id]: res.data });
      toastSuccessLeft("Lưu hóa đơn thành công");
    } catch (ex) {
      toastErrorLeft("Lưu hóa đơn thất bại: " + ex.response?.data?.message);
    }
  };

  const handleDeleteBill = async () => {
    try {
      await billApi.hardDelete(billsByTable[currentTable.id].id);
      const newBillsByTable = deleteBillActions.updateBillByTable(
        billsByTable,
        currentTable.id
      );
      setBillsByTable(newBillsByTable);
      setTables(separateTable(tables, currentTable.id));
      toastSuccessLeft("Xóa hóa đơn thành công");
    } catch (ex) {
      toastErrorLeft("Xóa hóa đơn thất bại: " + ex.response?.data?.message);
    }
  };

  return (
    <div className="px-3 view-container">
      <Row className="view-header py-2">
        <Col className="d-flex justify-content-between align-items-center">
          <Link to="/app/dashboard">
            ❮ <strong> Trở về</strong>
          </Link>
          <h4 className="mb-0">Màn hình thu ngân</h4>
        </Col>
      </Row>
      <Row className="view-content">
        <Col md="7">
          <Nav tabs className="bg-light">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => toggleTab("1")}
              >
                Bàn ({currentTable.name})
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => toggleTab("2")}
              >
                Menu
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => toggleTab("3")}
              >
                Đặt bàn
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "4" })}
                onClick={() => toggleTab("4")}
              >
                Hóa đơn
              </NavLink>
            </NavItem>
          </Nav>
          {/* TABLE */}
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <TableAndArea
                currentTable={currentTable}
                handleSelectTable={handleSelectTable}
                handleAddTable={handlePushTable}
                handleUpdateTable={handleUpdateTable}
                handleDeleteTable={handleDeleteTable}
                handleRestoreTable={handlePushTable}
                tables={tables}
                billMap={billsByTable}
              />
            </TabPane>

            {/* MENU */}
            <TabPane tabId="2">
              <MenuView foods={foods} handleSelectFood={handleSelectFood} />
            </TabPane>
            {/* RESERVING ORDERS */}
            <TabPane tabId="3">
              <Row>
                <Col>
                  <h2>reserving</h2>
                </Col>
              </Row>
            </TabPane>
            {/* BILLS */}
            <TabPane tabId="4">
              <Row>
                <Col>
                  <h2>bills</h2>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Col>

        {/* ORDER DETAILS */}
        <Col md="5">
          <OrderView
            table={currentTable}
            bill={billsByTable[currentTable.id]}
            handleClickOrderAmount={handleSelectFood}
            handleTypeOrderAmount={handleTypeOrderAmount}
            handleDeleteOrderDetail={handleDeleteOrderDetail}
            handleSaveBill={handleSaveBill}
            handleDeleteBill={handleDeleteBill}
          />
        </Col>
      </Row>
    </div>
  );
};

function sortTables(tables) {
  return tables.sort((t1, t2) => t1.name.localeCompare(t2.name));
}

export default withRouter(CashierView);
