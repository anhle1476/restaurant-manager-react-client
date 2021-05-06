import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter } from "react-router";
import Hammer from "rc-hammerjs";

import Dashboard from "../../pages/dashboard";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  openSidebar,
  closeSidebar,
  toggleSidebar,
} from "../../actions/navigation";
import s from "./Layout.module.scss";

// pages
import Charts from "../../pages/charts";
import StaffManager from "../../pages/staffManager/StaffManager";
import RoleManager from "../../pages/roleManager/RoleManager";
import Schedule from "../../pages/schedule/Schedule";
import ViolationManager from "../../pages/violationManager/ViolationManager";
import Salary from "../../pages/salary/Salary";
import FoodTypeManager from "../../pages/foodTypeManager/FoodTypeManager";
import FoodManager from "../../pages/foodManager/FoodManager";
import CashierView from "../../pages/cashierView/CashierView";
import ChefView from "../../pages/chefView/ChefView";
import BillHistory from "../../pages/billHistory/BillHistory";
import BillSearch from "../../pages/billSearch/BillSearch";
import RoleRestrictRoute from "../PrivateRoute/RoleRestrictRoute/RoleRestrictRoute";

const AdminOnlyRoute = ({ ...props }) => (
  <RoleRestrictRoute permittedRoles={["ADMIN"]} {...props} />
);

const CashierRoute = ({ ...props }) => (
  <RoleRestrictRoute permittedRoles={["ADMIN", "CASHIER"]} {...props} />
);

const ChefRoute = ({ ...props }) => (
  <RoleRestrictRoute permittedRoles={["ADMIN", "CHEF"]} {...props} />
);

class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: true,
    sidebarOpened: true,
  };

  constructor(props) {
    super(props);

    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleCloseSidebar = this.handleCloseSidebar.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    if (window.innerWidth <= 768) {
      this.props.dispatch(toggleSidebar());
    } else if (window.innerWidth >= 768) {
      this.props.dispatch(openSidebar());
    }
  }

  handleCloseSidebar(e) {
    if (
      e.target.closest("#sidebar-drawer") == null &&
      this.props.sidebarOpened &&
      window.innerWidth <= 768
    ) {
      this.props.dispatch(toggleSidebar());
    }
  }

  handleSwipe(e) {
    if ("ontouchstart" in window) {
      if (e.direction === 4) {
        this.props.dispatch(openSidebar());
        return;
      }

      if (e.direction === 2 && this.props.sidebarOpened) {
        this.props.dispatch(closeSidebar());
        return;
      }
    }
  }

  render() {
    const pathname = this.props.location.pathname;
    if (pathname === "/app/cashier-view")
      return <CashierRoute path="/app/cashier-view" component={CashierView} />;
    if (pathname === "/app/chef-view")
      return <ChefRoute path="/app/chef-view" component={ChefView} />;
    return (
      <div
        className={[
          s.root,
          !this.props.sidebarOpened ? s.sidebarClose : "",
          "flatlogic-one",
          "dashboard-light",
        ].join(" ")}
        onClick={(e) => this.handleCloseSidebar(e)}
      >
        <Sidebar />
        <div className={s.wrap}>
          <Header />

          <Hammer onSwipe={this.handleSwipe}>
            <main className={s.content}>
              <Switch>
                <Route path="/app/dashboard" component={Dashboard} />
                <Route path={"/app/schedule"} component={Schedule} />
                <Route path="/app/salaries" component={Salary} />

                <AdminOnlyRoute
                  path={"/app/hr/staffs"}
                  component={StaffManager}
                />
                <AdminOnlyRoute
                  path={"/app/hr/roles"}
                  component={RoleManager}
                />
                <AdminOnlyRoute
                  path={"/app/hr/violations"}
                  component={ViolationManager}
                />
                <AdminOnlyRoute
                  path={"/app/menu/food-types"}
                  component={FoodTypeManager}
                />
                <AdminOnlyRoute
                  path={"/app/menu/foods"}
                  component={FoodManager}
                />
                <CashierRoute
                  path={"/app/bills/history"}
                  component={BillHistory}
                />
                <CashierRoute
                  path={"/app/bills/search"}
                  component={BillSearch}
                />
                <Route path={"/app/ui/charts"} component={Charts} />
              </Switch>
            </main>
          </Hammer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
