import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";
import { logoutRequest } from "../../actions/user";

const PrivateRoute = ({
  isAuthenticated,
  logoutRequest,
  dispatch,
  component,
  ...rest
}) => {
  if (!isAuthenticated) {
    logoutRequest();
    return <Redirect to="/sign-in" />;
  } else {
    return (
      // eslint-disable-line
      <Route
        {...rest}
        render={(props) => React.createElement(component, props)}
      />
    );
  }
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logoutRequest })(PrivateRoute);
