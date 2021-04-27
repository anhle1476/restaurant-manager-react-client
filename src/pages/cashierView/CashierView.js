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
import TableAndArea from "../../components/Cashier/TableAndArea/TableAndArea";
import MenuView from "../../components/Cashier/MenuView/MenuView";

const CashierView = () => {
  const [activeTab, setActiveTab] = useState("1");

  const [tables, setTables] = useState([]);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    Promise.all([tableApi.getAll(), foodApi.getAll()]).then(
      ([tableRes, foodRes]) => {
        setTables(tableRes.data);
        setFoods(foodRes.data);
      }
    );
  }, []);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleAddTable = (newTable) => {
    setTables([...tables, newTable]);
  };

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
                table
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => toggleTab("2")}
              >
                menu
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => toggleTab("3")}
              >
                reserving
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "4" })}
                onClick={() => toggleTab("4")}
              >
                bills
              </NavLink>
            </NavItem>
          </Nav>
          {/* TABLE */}
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col>
                  <TableAndArea
                    handleAddTable={handleAddTable}
                    tables={tables}
                  />
                </Col>
              </Row>
            </TabPane>

            {/* MENU */}
            <TabPane tabId="2">
              <Row>
                <Col>
                  <MenuView foods={foods} />
                </Col>
              </Row>
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
          <div className="bg-white order-container">order details</div>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(CashierView);
