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
import TableAndArea from "../../components/Cashier/TableAndArea/TableAndArea";
import MenuView from "../../components/Cashier/MenuView/MenuView";
import OrderView from "../../components/Cashier/OrderView/OrderView";

const BILL_SCHEMA = {
  startTime: undefined,
  appTable: {},
  billDetails: [],
  surcharge: 0,
  discount: 0,
  discountDescription: "",
  lastPrice: 0,
};

const BILL_DETAILS_SCHEMA = {
  food: {},
  quantity: 0,
  doneQuantity: 0,
};

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
    const updatedBill = changeBillDetailsPlusAmount(
      billOfTable,
      food,
      amount,
      currentTable
    );
    setBillsByTable({ ...billsByTable, [currentTable.id]: updatedBill });
  };

  const handleTypeOrderAmount = (food, amount) => {
    const billOfTable = billsByTable[currentTable.id];
    const updatedBill = changeBillDetailsToAmount(billOfTable, food, amount);
    setBillsByTable({ ...billsByTable, [currentTable.id]: updatedBill });
  };

  const handleDeleteOrderDetail = (foodId) => {
    const billOfTable = billsByTable[currentTable.id];
    const updatedBill = changeBillDetailsByRemoveFood(billOfTable, foodId);
    setBillsByTable({ ...billsByTable, [currentTable.id]: updatedBill });
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
          />
        </Col>
      </Row>
    </div>
  );
};

function sortTables(tables) {
  return tables.sort((t1, t2) => t1.name.localeCompare(t2.name));
}

function createNewBillDetail(food, amount) {
  return { ...BILL_DETAILS_SCHEMA, food: food, quantity: amount };
}

function changeBillDetailsPlusAmount(
  bill = { ...BILL_SCHEMA },
  food,
  amount,
  table
) {
  // if bill is a new bill or don't have any food -> add food and return
  if (bill.billDetails.length === 0)
    return {
      ...bill,
      appTable: table,
      billDetails: [createNewBillDetail(food, amount)],
    };
  let foodNotExist = true;
  const billDetailsLength = bill.billDetails.length;
  for (let i = 0; i < billDetailsLength; i++) {
    const currentDetail = bill.billDetails[i];
    if (currentDetail.food.id !== food.id) continue;
    const resultAmount = currentDetail.quantity + amount;
    bill.billDetails[i] = updateDetailsWithAmount(currentDetail, resultAmount);
    foodNotExist = false;
    break;
  }
  if (foodNotExist) bill.billDetails.push(createNewBillDetail(food, amount));
  return bill;
}

function changeBillDetailsToAmount(bill, food, amount) {
  return {
    ...bill,
    billDetails: bill.billDetails.map((detail) =>
      detail.food.id === food.id
        ? updateDetailsWithAmount(detail, amount)
        : detail
    ),
  };
}

function changeBillDetailsByRemoveFood(bill, foodId) {
  return {
    ...bill,
    billDetails: bill.billDetails.filter((detail) => detail.food.id !== foodId),
  };
}

function updateDetailsWithAmount(detail, newAmount) {
  return {
    ...detail,
    quantity: limitValue(newAmount, detail.doneQuantity),
  };
}

function limitValue(amount, min) {
  return amount < min ? min : amount > 2000 ? 2000 : amount;
}

export default withRouter(CashierView);
