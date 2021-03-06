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
import eccomerceLight from "../../images/icons/E-commerce_outlined.svg";
import documentationLight from "../../images/icons/Documentation_outlined.svg";
import formsLight from "../../images/icons/Forms_outlined.svg";
import gridLight from "../../images/icons/Grid_outlined.svg";
import packLight from "../../images/icons/Package_outlined.svg";
import logo from "../../images/logo.svg";
import logoutIcon from "../../images/logout.svg";
import accountIcon from "../../images/account.svg";

class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    role: PropTypes.string,
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
    const { role } = this.props;

    const adminLink = role === "ADMIN";
    const adminAndCashierLink = adminLink || role === "CASHIER";
    const adminAndChefLink = adminLink || role === "CHEF";

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
              style={{ width: 67 }}
              className={s.logoStyle}
            />
            <div>
              <small>Nh?? h??ng</small>
              <span>Super Pig</span>
            </div>
          </header>
          <div className={s.navItems}>
            <ul className={s.nav}>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="Dashboard"
                isHeader
                link="/app/dashboard"
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
                header="L???ch l??m vi???c"
                isHeader
                link="/app/schedule"
                index="main"
              >
                <img
                  src={lightTables}
                  alt="lightTables"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="Ti???n l????ng"
                isHeader
                link="/app/salaries"
                index="main"
              >
                <img
                  src={formsLight}
                  alt="formsLight"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
            </ul>
            {adminLink && (
              <>
                <h5 className={s.navTitle}>QU???N L?? NH?? H??NG</h5>
                <ul className={s.nav}>
                  <LinksGroup
                    onActiveSidebarItemChange={
                      this.handleActiveSidebarItemChange
                    }
                    activeItem={this.props.activeItem}
                    header="Nh??n s???"
                    isHeader
                    link="/app/hr"
                    index="hr"
                    exact={false}
                    childrenLinks={[
                      {
                        header: "Nh??n vi??n",
                        link: "/app/hr/staffs",
                      },
                      {
                        header: "Ch???c v???",
                        link: "/app/hr/roles",
                      },
                      {
                        header: "Vi ph???m",
                        link: "/app/hr/violations",
                      },
                    ]}
                  >
                    <img
                      src={lightUI}
                      alt="lightDashboard"
                      className={s.sidebarIcon}
                    />
                  </LinksGroup>
                  <LinksGroup
                    onActiveSidebarItemChange={
                      this.handleActiveSidebarItemChange
                    }
                    activeItem={this.props.activeItem}
                    header="Menu"
                    isHeader
                    link="/app/menu"
                    index="menu"
                    exact={false}
                    childrenLinks={[
                      {
                        header: "Lo???i m??n",
                        link: "/app/menu/food-types",
                      },
                      {
                        header: "M??n ??n",
                        link: "/app/menu/foods",
                      },
                    ]}
                  >
                    <img
                      src={packLight}
                      alt="packLight"
                      className={s.sidebarIcon}
                    />
                  </LinksGroup>
                </ul>
              </>
            )}
            {adminAndCashierLink && (
              <>
                <h5 className={s.navTitle}>THU NG??N</h5>
                <ul className={s.nav}>
                  <LinksGroup
                    onActiveSidebarItemChange={
                      this.handleActiveSidebarItemChange
                    }
                    activeItem={this.props.activeItem}
                    header="M??n h??nh thu ng??n"
                    isHeader
                    link="/app/cashier-view"
                    index="main"
                  >
                    <img
                      src={eccomerceLight}
                      alt="eccomerceLight"
                      className={s.sidebarIcon}
                    />
                  </LinksGroup>
                  <LinksGroup
                    onActiveSidebarItemChange={
                      this.handleActiveSidebarItemChange
                    }
                    activeItem={this.props.activeItem}
                    header="H??a ????n"
                    isHeader
                    link="/app/bills"
                    index="bills"
                    exact={false}
                    childrenLinks={[
                      {
                        header: "L???ch s??? h??a ????n",
                        link: "/app/bills/history",
                      },
                      {
                        header: "T??m ki???m",
                        link: "/app/bills/search",
                      },
                    ]}
                  >
                    <img
                      src={documentationLight}
                      alt="documentationLight"
                      className={s.sidebarIcon}
                    />
                  </LinksGroup>
                </ul>
              </>
            )}
            {adminAndChefLink && (
              <>
                <h5 className={s.navTitle}>?????U B???P</h5>
                <ul className={s.nav}>
                  <LinksGroup
                    onActiveSidebarItemChange={
                      this.handleActiveSidebarItemChange
                    }
                    activeItem={this.props.activeItem}
                    header="M??n h??nh b???p"
                    isHeader
                    link="/app/chef-view"
                    index="main"
                  >
                    <img
                      src={gridLight}
                      alt="gridLight"
                      className={s.sidebarIcon}
                    />
                  </LinksGroup>
                </ul>
              </>
            )}
            <ul className={s.nav}>
              <hr />
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                activeItem={this.props.activeItem}
                header="T??i kho???n"
                isHeader
                link="/app/account"
                index="main"
              >
                <img
                  src={accountIcon}
                  alt="lightDashboard"
                  className={s.sidebarIcon}
                />
              </LinksGroup>
              <LinksGroup
                onActiveSidebarItemChange={this.handleActiveSidebarItemChange}
                header="????ng xu???t"
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
    role: store.auth.role,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
