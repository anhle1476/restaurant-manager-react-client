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
  Button,
} from "reactstrap";

import "./CashierView.scss";
import tableApi from "../../api/tableApi";
import foodApi from "../../api/foodApi";
import billApi from "../../api/billApi";
import reservingApi from "../../api/reservingApi";
import {
  deleteBillActions,
  changeBillActions,
  updateRelatedInfo,
} from "./billUpdate";
import TableAndArea from "../../components/Cashier/TableAndArea/TableAndArea";
import MenuView from "../../components/Cashier/MenuView/MenuView";
import OrderView from "../../components/Cashier/OrderView/OrderView";
import {
  toastErrorLeft,
  toastImportant,
  toastSuccessLeft,
} from "../../utils/toastUtils";
import { separateTable } from "./tableUpdate";
import TableGroupingModal from "../../components/Cashier/TableGroupingModal/TableGroupingModal";
import ChangeTableModal from "../../components/Cashier/ChangeTableModal/ChangeTableModal";
import PaymentModal from "../../components/Cashier/PaymentModal/PaymentModal";
import { formatVnd } from "../../utils/moneyUtils";
import ReservingView from "../../components/Cashier/ReservingView/ReservingView";

const CashierView = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [modals, setModals] = useState("");
  const [currentTable, setCurrentTable] = useState({});

  const [tables, setTables] = useState([]);
  const [foods, setFoods] = useState([]);
  const [billsByTable, setBillsByTable] = useState({});
  const [reservingByTable, setReservingByTable] = useState({});

  const handleSelectTable = (table) => {
    setCurrentTable(!table.parent ? table : table.parent);
  };

  useEffect(() => {
    Promise.all([
      tableApi.getAll(),
      foodApi.getAll(),
      billApi.getCurrentBillsByTable(),
    ])
      .then(([tableRes, foodRes, billRes]) => {
        const tableData = tableRes.data;
        if (tableData.length) {
          sortTables(tableData);
          setTables(tableData);
          handleSelectTable(tableData[0]);
        }
        setFoods(foodRes.data);
        setBillsByTable(billRes.data);
      })
      .catch((ex) =>
        toastImportant(
          "L???y d??? li???u th???t b???i, vui l??ng t???i l???i trang:" +
            ex.response?.data?.message
        )
      );
  }, []);

  useEffect(() => {
    // refresh bill each 1 min
    const refreshBillsByTableInterval = setInterval(refreshBillsByTable, 60000);
    // refresh reserving order each 10 min
    const refreshReservingByTableInterval = setInterval(
      refreshReservingByTable,
      600000
    );
    return () => {
      clearInterval(refreshBillsByTableInterval);
      clearInterval(refreshReservingByTableInterval);
    };
  }, []);

  useEffect(() => {
    refreshReservingByTable();
  }, []);

  async function refreshBillsByTable() {
    try {
      console.log("update bill");
      const res = await billApi.getCurrentBills();
      setBillsByTable((prev) =>
        updateRelatedInfo.mergeBillData(prev, res.data)
      );
    } catch (ex) {
      toastErrorLeft(
        "T??? ?????ng c???p nh???t d??? li???u h??a ????n th???t b???i:" +
          ex.response?.data?.message
      );
    }
  }

  async function refreshReservingByTable() {
    try {
      console.log("update reserving orders");
      const res = await reservingApi.getAllToday();
      const reservingData = res.data.reduce((obj, order) => {
        order.appTables.forEach((table) => (obj[table.id] = order));
        return obj;
      }, {});
      setReservingByTable(reservingData);
    } catch (ex) {
      toastErrorLeft(
        `L???y d??? li???u ?????t b??n th???t b???i (${ex.response?.data?.message})`
      );
    }
  }

  async function refreshTables() {
    try {
      console.log("update tables");
      const res = await tableApi.getAll();
      updateTablesState(res.data);
    } catch (ex) {
      toastErrorLeft(
        `L???y d??? li???u b??n th???t b???i (${ex.response?.data?.message})`
      );
    }
  }

  async function refreshFoods() {
    try {
      console.log("update foods");
      const res = await foodApi.getAll();
      setFoods(res.data);
    } catch (ex) {
      toastErrorLeft(
        `L???y d??? li???u m??n ??n th???t b???i (${ex.response?.data?.message})`
      );
    }
  }

  const manualRefreshData = () => {
    refreshTables();
    refreshFoods();
    refreshBillsByTable();
    refreshReservingByTable();
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleModal = (modalName) => {
    setModals((modal) => (modal ? "" : modalName));
  };

  const updateTablesState = (tableData) => {
    sortTables(tableData);
    setTables(tableData);
    setCurrentTable((table) =>
      tableData.find((updated) => updated.id === table.id)
    );
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

  const handleChangeTable = (bill, oldTable, newTable) => {
    const newBillByTable = {
      ...billsByTable,
      [newTable]: bill,
    };
    delete newBillByTable[oldTable];
    setBillsByTable(newBillByTable);
    setCurrentTable(tables.find((table) => table.id === newTable));
  };

  const saveCurrentBill = (bill) => {
    setBillsByTable({ ...billsByTable, [currentTable.id]: bill });
  };

  const handleToggleAvailable = async ({ id, name }) => {
    try {
      const res = await foodApi.toggleAvailability(id);
      setFoods(foods.map((food) => (food.id === id ? res.data : food)));
      setBillsByTable(updateRelatedInfo.changeFoodInfo(billsByTable, res.data));
      toastSuccessLeft("Thay ?????i tr???ng th??i m??n " + name + " th??nh c??ng");
    } catch (ex) {
      toastErrorLeft(
        "Thay ?????i tr???ng th??i m??n " +
          name +
          " th???t b???i:" +
          ex.response?.data?.message
      );
    }
  };

  const handleSelectFood = (food, amount = 1) => {
    const billOfTable = billsByTable[currentTable.id];
    const updatedBill = changeBillActions.plusAmount(
      billOfTable,
      food,
      amount,
      currentTable
    );
    saveCurrentBill(updatedBill);
  };

  const handleTypeOrderAmount = (food, amount) => {
    const billOfTable = billsByTable[currentTable.id];
    const updatedBill = changeBillActions.toAmount(billOfTable, food, amount);
    saveCurrentBill(updatedBill);
  };

  const handleDeleteOrderDetail = (foodId) => {
    const billOfTable = billsByTable[currentTable.id];
    const updatedBill = changeBillActions.removeFood(billOfTable, foodId);
    saveCurrentBill(updatedBill);
  };

  const handleSaveBill = async () => {
    try {
      const res = await billApi.saveOrUpdate(billsByTable[currentTable.id]);
      saveCurrentBill(res.data);
      toastSuccessLeft("L??u h??a ????n th??nh c??ng");
    } catch (ex) {
      toastErrorLeft("L??u h??a ????n th???t b???i: " + ex.response?.data?.message);
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
      toastSuccessLeft("X??a h??a ????n th??nh c??ng");
    } catch (ex) {
      toastErrorLeft("X??a h??a ????n th???t b???i: " + ex.response?.data?.message);
    }
  };

  const handleChangePaymentInfo = ({ name, value }) => {
    saveCurrentBill({
      ...billsByTable[currentTable.id],
      [name]: value,
      unsaved: true,
    });
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await billApi.preparePayment(billsByTable[currentTable.id]);
      saveCurrentBill(res.data);
      toastSuccessLeft("L??u th??ng tin thanh to??n th??nh c??ng");
    } catch (ex) {
      toastErrorLeft(
        "L??u th??ng tin thanh to??n th???t b???i: " + ex.response?.data?.message
      );
    }
  };

  const handleDoPayment = async () => {
    try {
      const currentTableId = currentTable.id;
      const res = await billApi.doPayment(billsByTable[currentTableId].id);
      const { appTable, lastPrice } = res.data;
      const newBillByTable = { ...billsByTable };
      delete newBillByTable[currentTableId];
      setBillsByTable(newBillByTable);
      setTables(
        tables.map((table) =>
          table.parent?.id === currentTableId
            ? {
                ...table,
                parent: null,
              }
            : table
        )
      );
      toggleModal("");
      toastSuccessLeft(
        `Thanh to??n ${appTable.name} b??n c??ng: ${formatVnd(lastPrice)}`
      );
    } catch (ex) {
      toastErrorLeft("Thanh to??n th???t b???i: " + ex.response?.data?.message);
    }
  };

  return (
    <>
      <div className="px-3 view-container">
        <Row className="view-header py-2">
          <Col className="d-flex justify-content-between align-items-center">
            <Link to="/app/dashboard">
              ??? <strong> Tr??? v???</strong>
            </Link>
            <div className="d-flex justify-content-end align-items-center">
              <Button
                title="L??m m???i d??? li???u"
                color="secondary"
                outline
                onClick={manualRefreshData}
              >
                <i className="fas fa-sync-alt"></i>
              </Button>
              <h4 className="mb-0"> M??n h??nh thu ng??n</h4>
            </div>
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
                  B??n ({currentTable.name})
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
                  ?????t b??n
                </NavLink>
              </NavItem>
            </Nav>
            {/* TABLE */}
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <TableAndArea
                  currentTable={currentTable}
                  billsByTable={billsByTable}
                  reservingByTable={reservingByTable}
                  refreshTables={refreshTables}
                  handleSelectTable={handleSelectTable}
                  handleAddTable={handlePushTable}
                  handleUpdateTable={handleUpdateTable}
                  handleDeleteTable={handleDeleteTable}
                  handleRestoreTable={handlePushTable}
                  tables={tables}
                />
              </TabPane>

              {/* MENU */}
              <TabPane tabId="2">
                <MenuView
                  foods={foods}
                  handleSelectFood={handleSelectFood}
                  handleToggleAvailable={handleToggleAvailable}
                />
              </TabPane>
              {/* RESERVING ORDERS */}
              <TabPane tabId="3">
                <Row>
                  <Col>
                    <ReservingView
                      tables={tables}
                      refreshReservingState={refreshReservingByTable}
                      show={activeTab === "3"}
                    />
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
              isGrouping={tables.some(
                (table) => table.parent?.id === currentTable.id
              )}
              handleClickOrderAmount={handleSelectFood}
              handleTypeOrderAmount={handleTypeOrderAmount}
              handleDeleteOrderDetail={handleDeleteOrderDetail}
              handleSaveBill={handleSaveBill}
              handleDeleteBill={handleDeleteBill}
              toggleTableGroupingModal={() => toggleModal("TABLE_GROUPING")}
              toggleTableChangingModal={() => toggleModal("TABLE_CHANGING")}
              togglePaymentModal={() => toggleModal("PAYMENT")}
            />
          </Col>
        </Row>
      </div>
      <TableGroupingModal
        show={modals === "TABLE_GROUPING"}
        toggle={() => toggleModal("TABLE_GROUPING")}
        tables={tables}
        currentTable={currentTable}
        billsByTable={billsByTable}
        updateTablesState={updateTablesState}
      />
      <ChangeTableModal
        show={modals === "TABLE_CHANGING"}
        toggle={() => toggleModal("TABLE_CHANGING")}
        tables={tables}
        currentTable={currentTable}
        billsByTable={billsByTable}
        handleChangeTable={handleChangeTable}
      />
      <PaymentModal
        show={modals === "PAYMENT"}
        toggle={() => toggleModal("PAYMENT")}
        currentTable={currentTable}
        bill={billsByTable[currentTable.id]}
        handleChangePaymentInfo={handleChangePaymentInfo}
        handleSavePayment={handleSavePayment}
        handleDoPayment={handleDoPayment}
      />
    </>
  );
};

function sortTables(tables) {
  return tables.sort((t1, t2) => t1.name.localeCompare(t2.name));
}

export default withRouter(CashierView);
