import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const RoleRestrictRoute = ({
  component: Component,
  role,
  permittedRoles,
  ...otherProps
}) => {
  if (permittedRoles.indexOf(role) === -1)
    return <Redirect to="/app/dashboard" />;

  return <Route {...otherProps} render={(props) => <Component {...props} />} />;
};

RoleRestrictRoute.propTypes = {
  role: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  role: state.auth.role,
});

export default connect(mapStateToProps)(RoleRestrictRoute);
