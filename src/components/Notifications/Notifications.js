import React from "react";
import AccountNotification from "./notifications-demo/Account";

import s from "./Notifications.module.scss";

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationsTabSelected: 1,
      newNotifications: null,
      isLoad: false,
    };
  }

  static defaultProps = {
    notificationsTabSelected: 1,
  };

  changeNotificationsTab(tab) {
    this.setState({
      notificationsTabSelected: tab,
      newNotifications: null,
    });
  }

  render() {
    return (
      <section
        className={`${s.notificationsAccount} card navbar-notifications`}
      >
        {this.state.newNotifications || <AccountNotification />}
      </section>
    );
  }
}

export default Notifications;
