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

const CashierView = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [currentTable, setCurrentTable] = useState({});

  const [tables, setTables] = useState([]);
  const [foods, setFoods] = useState([]);
  const [bills, setBills] = useState([]);

  const handleSelectTable = (table) => {
    setCurrentTable(!table.parent ? table : table.parent);
  };

  useEffect(() => {
    Promise.all([
      tableApi.getAll(),
      foodApi.getAll(),
      billApi.getCurrentBills(),
    ]).then(([tableRes, foodRes, billRes]) => {
      const tableData = tableRes.data;
      if (tableData.length) {
        setTables(tableData);
        handleSelectTable(tableData[0]);
      }
      setFoods(foodRes.data);
      setBills(billRes.data);
    });
  }, []);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handlePushTable = (newTable) => {
    const newData = [...tables, newTable].sort((t1, t2) =>
      t1.name.localeCompare(t2.name)
    );
    setTables(newData);
  };

  const handleUpdateTable = (updated) => {
    setTables(
      tables.map((table) => (table.id === updated.id ? updated : table))
    );
    setCurrentTable(updated);
  };

  const handleDeleteTable = (id) => {
    setTables(tables.filter((table) => table.id !== id));
  };

  const billByTable = bills.reduce(
    (billMap, bill) => ({ ...billMap, [bill.appTable.id]: bill }),
    {}
  );

  return (
    <div className="px-3 view-container">
      <Row className="py-2">
        <Col className="d-flex justify-content-between">
          <Link to="/app/dashboard">❮ Trở về</Link>
          <h4>Màn hình thu ngân</h4>
        </Col>
      </Row>
      <Row className="main-view">
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
                billMap={billByTable}
              />
            </TabPane>

            {/* MENU */}
            <TabPane tabId="2">
              <MenuView foods={foods} />
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
          <OrderView table={currentTable} bill={billByTable[currentTable.id]} />
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(CashierView);
