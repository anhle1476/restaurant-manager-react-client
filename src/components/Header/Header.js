import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Navbar,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  NavItem,
  NavLink,
} from "reactstrap";
import Notifications from "../Notifications";
import { logoutUser } from "../../actions/user";
import {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  changeActiveSidebarItem,
} from "../../actions/navigation";

import search from "../../images/search.svg";
import notify from "../../images/notify.svg";
import lightNotify from "../../images/light-notify.svg";
import arrowUnactive from "../../images/Arrow 6.svg";
import arrowActive from "../../images/Arrow 5.svg";

import s from "./Header.module.scss"; // eslint-disable-line css-modules/no-unused-class

class Header extends React.Component {
  static propTypes = {
    sidebarOpened: PropTypes.bool.isRequired,
    sidebarStatic: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      notificationsOpen: false,
      accountOpen: false,
      notificationsTabSelected: 1,
      focus: false,
      showNewMessage: false,
      hideMessage: true,
      run: true,
      arrowImg: arrowActive,
    };
  }

  toggleFocus = () => {
    this.setState({ focus: !this.state.focus });
  };

  toggleNotifications = () => {
    this.setState({
      notificationsOpen: !this.state.notificationsOpen,
    });
  };

  toggleAccount = () => {
    this.setState({
      accountOpen: !this.state.accountOpen,
    });
  };

  doLogout = () => {
    this.props.dispatch(logoutUser());
  };

  changeArrowImg = () => {
    this.setState({
      arrowImg: arrowUnactive,
    });
  };

  changeArrowImgOut = () => {
    this.setState({
      arrowImg: arrowActive,
    });
  };

  // collapse/uncolappse
  switchSidebar = () => {
    if (this.props.sidebarOpened) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  };

  // tables/non-tables
  toggleSidebar = () => {
    this.props.dispatch(toggleSidebar());
    if (this.props.sidebarStatic) {
      localStorage.setItem("staticSidebar", "false");
      this.props.dispatch(changeActiveSidebarItem(null));
    } else {
      localStorage.setItem("staticSidebar", "true");
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  };

  toggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };
  render() {
    const { notificationsOpen, accountOpen } = this.state;
    const { openUsersList } = this.props;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const firstUserLetter = (user.name || user.email || "P")[0].toUpperCase();

    return (
      <Navbar
        className={`${s.root} d-print-none`}
        style={{ zIndex: !openUsersList ? 100 : 0, backgroundColor: "#323232" }}
      >
        <NavItem className={`${s.toggleSidebarNav} d-md-none d-flex mr-2`}>
          <NavLink
            className="ml-2 pr-4 pl-3"
            id="toggleSidebar"
            onClick={this.toggleSidebar}
          >
            <i className={`la la-bars`} style={{ color: "#000" }} />
          </NavLink>
        </NavItem>
        <NavItem className={"d-md-down-block d-md-none ml-auto"}>
          <img
            src={search}
            alt="search"
            width="24px"
            height="23px"
            style={{ marginRight: 12 }}
          />
        </NavItem>
        <Nav className="ml-auto">
          <Dropdown
            nav
            isOpen={notificationsOpen}
            toggle={this.toggleNotifications}
            id="basic-nav-dropdown"
            className={`${s.notificationsMenu}`}
          >
            <DropdownToggle
              nav
              className={"text-white"}
              style={{ marginLeft: 20 }}
            >
              {notificationsOpen ? (
                <img
                  src={lightNotify}
                  alt="notify"
                  width="24px"
                  height={"24px"}
                />
              ) : (
                <>
                  <img src={notify} alt="notify" width="24px" height={"24px"} />
                  <i
                    className={`fa fa-circle text-danger mb-2 ${s.circleStyle}`}
                  />
                </>
              )}
            </DropdownToggle>
            <DropdownMenu
              right
              className={`${s.notificationsWrapper} py-0 animated animated-fast fadeInUp`}
            >
              <Notifications />
            </DropdownMenu>
          </Dropdown>
          <Dropdown
            nav
            className={`${s.notificationsMenu}`}
            isOpen={accountOpen}
            toggle={this.toggleAccount}
          >
            <DropdownToggle
              nav
              className={"text-white"}
              style={{ marginLeft: 20 }}
            >
              <span
                className={`${s.avatar} rounded-circle thumb-sm float-left mr-2`}
              >
                {firstUserLetter}
              </span>
            </DropdownToggle>
            <DropdownMenu
              right
              className={`${s.notificationsWrapper} py-0 animated animated-fast fadeInUp`}
            >
              <Notifications notificationsTabSelected={4} />
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(Header));
