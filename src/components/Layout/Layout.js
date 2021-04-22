import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";
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
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications/Notifications";
import Icons from "../../pages/icons";
import Tables from "../../pages/tables";
import Charts from "../../pages/charts";
import StaffManager from "../../pages/staffManager/StaffManager";
import RoleManager from "../../pages/roleManager/RoleManager";
import Schedule from "../../pages/schedule/Schedule";
import ViolationManager from "../../pages/violationManager/ViolationManager";

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
              <TransitionGroup>
                <CSSTransition
                  key={this.props.location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <Switch>
                    <Route
                      path="/app/main"
                      exact
                      render={() => <Redirect to="/app/main/dashboard" />}
                    />
                    <Route
                      path="/app/main/dashboard"
                      exact
                      component={Dashboard}
                    />
                    <Route path={"/app/hr/staffs"} component={StaffManager} />
                    <Route path={"/app/hr/roles"} component={RoleManager} />
                    <Route
                      path={"/app/hr/violations"}
                      component={ViolationManager}
                    />
                    <Route path={"/app/schedule"} component={Schedule} />
                    <Route path={"/app/typography"} component={Typography} />
                    <Route path={"/app/tables"} component={Tables} />
                    <Route
                      path={"/app/ui/notifications"}
                      component={Notifications}
                    />
                    <Route path={"/app/ui/icons"} component={Icons} />
                    <Route path={"/app/ui/charts"} component={Charts} />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
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
