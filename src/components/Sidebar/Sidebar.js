import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { dismissAlert } from "../../actions/alerts";
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup";
import { changeActiveSidebarItem } from "../../actions/navigation";
import { logoutUser } from "../../actions/user";

import lightDashboardIcon from "../../images/light-dashboard.svg";
import lightTables from "../../images/tables.svg";
import lightUI from "../../images/ui-elements.svg";
import lightTypography from "../../images/Typography.svg";
import logo from "../../images/main-logo.svg";
import logoutIcon from "../../images/logout.svg";
import accountIcon from "../../images/account.svg";

class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    sidebarStatic: true,
    sidebarOpened: true,
    activeItem: "",
  };

  constructor(props) {
    super(props);

    this.doLogout = this.doLogout.bind(this);
  }

  dismissAlert = (id) => {
    this.props.dispatch(dismissAlert(id));
  };

  doLogout = () => {
    this.props.dispatch(logoutUser());
  };

  handleActiveSidebarItemChange = (activeItem) =>
    this.props.dispatch(changeActiveSidebarItem(activeItem));

  render() {
    return (
      <div
        className={`${
          !this.props.sidebarOpened && !this.props.sidebarStatic
            ? s.sidebarClose
            : ""
        } ${s.sidebarWrapper}`}
        id={"sidebar-drawer"}
      >
        <nav className={s.root}>
          <header className={s.logo}>
            <img
              src={logo}
              alt="logo"
              style={{ width: 50 }}
              className={s.logoStyle}
            />
            <div>
              <span>Fat Man</span>
              <small> Restaurant</small>
            </div>
          </header>
          <div className={s.navItems}>
            <h5 className={s.navTitle}>QUẢN LÝ NHÀ HÀNG</h5>
            <ul className={s.nav}>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="Dashboard"
                isHeader
                link="/app/main/dashboard"
                index="main"
              >
                <img
                  src={lightDashboardIcon}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="Lịch làm việc"
                isHeader
                link="/app/schedule"
                index="main"
              >
                <img
                  src={lightDashboardIcon}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>

              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="Nhân sự"
                isHeader
                link="/app/manager"
                index="manager"
                exact={false}
                childrenLinks={[
                  {
                    header: "Nhân viên",
                    link: "/app/manager/staffs",
                  },
                  {
                    header: "Chức vụ",
                    link: "/app/manager/roles",
                  },
                ]}
              >
                <img
                  src={lightUI}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
            </ul>
            <h5 className={s.navTitle}>TEMPLATE</h5>
            <ul className={s.nav}>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="Typography"
                isHeader
                link="/app/typography"
                index="main"
              >
                <img
                  src={lightTypography}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="Tables"
                isHeader
                link="/app/tables"
                index="main"
              >
                <img
                  src={lightTables}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="UI Elements"
                isHeader
                link="/app/ui"
                index="ui"
                exact={false}
                childrenLinks={[
                  {
                    header: "Notifications",
                    link: "/app/ui/notifications",
                  },
                  {
                    header: "Charts",
                    link: "/app/ui/charts",
                  },
                  {
                    header: "Icons",
                    link: "/app/ui/icons",
                  },
                  {
                    header: "Maps",
                    link: "/app/ui/maps",
                  },
                ]}
              >
                <img
                  src={lightUI}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
            </ul>
            <ul className={s.downNav}>
              <hr />
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                header="Account"
                isHeader
              >
                <img
                  src={accountIcon}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                header="Logout"
                isHeader
                onClick={() => this.doLogout()}
              >
                <img
                  src={logoutIcon}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    alertsList: store.alerts.alertsList,
    activeItem: store.navigation.activeItem,
    navbarType: store.navigation.navbarType,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
