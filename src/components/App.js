import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/* eslint-disable */
import ErrorPage from "../pages/error";
/* eslint-enable */

import LayoutComponent from "../components/Layout";
import Login from "../pages/login";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import ErrorFallback from "./ErrorFallback/ErrorFallback";
import "../styles/theme.scss";
import "./App.scss";

const CloseButton = ({ closeToast }) => (
  <i onClick={closeToast} className="la la-close notifications-close" />
);

class App extends React.PureComponent {
  render() {
    const { initApp, shouldRetry } = this.props;

    if (initApp) return <ErrorFallback message={"Đang tải..."} />;

    if (shouldRetry)
      return (
        <ErrorFallback message={"Sự cố kết nối với máy chủ..."}>
          <span>
            Hệ thống sẽ thử kết nối lại sau 30s hoặc vui lòng bấm F5 để tải lại
            trang
          </span>
        </ErrorFallback>
      );

    return (
      <div>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          closeButton={<CloseButton />}
        />
        <HashRouter>
          <Switch>
            <Route
              path="/"
              exact
              render={() => <Redirect to="/app/dashboard" />}
            />
            <Route
              path="/app"
              exact
              render={() => <Redirect to="/app/dashboard" />}
            />
            <PrivateRoute path="/app" component={LayoutComponent} />
            <Route path="/sign-in" exact component={Login} />
            <Route path="/error" exact component={ErrorPage} />
            <Route component={ErrorPage} />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  initApp: state.auth.initApp,
  shouldRetry: state.auth.shouldRetry,
});

export default connect(mapStateToProps)(App);
