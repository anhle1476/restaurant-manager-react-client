import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";

import { logoutUser } from "../../../actions/user";

import s from "./ListGroup.module.scss";

import logoutIcon from "../../../images/logout.svg";
import accountIcon from "../../../images/account.svg";
import { withRouter } from "react-router";
import { connect } from "react-redux";

class MessagesDemo extends React.Component {
  constructor(props) {
    super(props);
    this.doLogout = this.doLogout.bind(this);
  }
  doLogout() {
    this.props.dispatch(logoutUser());
  }
  render() {
    return (
      <ListGroup className={[s.listGroupAccount, "thin-scroll"].join(" ")}>
        <p className={`${s.listGroupTitleAccount}`}>{this.props.username}</p>
        <p className={`${s.listGroupSubtitleAccount}`}>{this.props.role}</p>
        <ListGroupItem
          onClick={() => this.props.history.push("/app/account")}
          className={`${s.listGroupItemAccount} mt-2`}
        >
          <img src={accountIcon} alt="settings" className={"mr-2"} /> Tài khoản
        </ListGroupItem>
        <ListGroupItem
          className={`${s.listGroupItemAccount} mt-2 mb-3`}
          onClick={this.doLogout}
        >
          <img src={logoutIcon} alt="settings" className={"mr-2"} /> Đăng xuất
        </ListGroupItem>
      </ListGroup>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    username: store.auth.username,
    role: store.auth.role,
  };
}

export default withRouter(connect(mapStateToProps)(MessagesDemo));
