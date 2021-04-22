import React from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Button, Label, Input, FormGroup } from "reactstrap";
import Widget from "../../components/Widget";
import { loginUser } from "../../actions/user";
import s from "./Login.module.scss";
import logo from "../../images/logo.svg";

class Login extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  static isAuthenticated(token) {
    if (token) return true;
  }

  constructor(props) {
    super(props);

    this.state = {
      username: "admin@flatlogic.com",
      password: "password",
    };
  }

  doLogin = (e) => {
    e.preventDefault();
    this.props.dispatch(
      loginUser({ email: this.state.username, password: this.state.password })
    );
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/app" },
    }; // eslint-disable-line

    // cant access login page while logged in
    if (
      Login.isAuthenticated(JSON.parse(localStorage.getItem("authenticated")))
    ) {
      return <Redirect to={from} />;
    }

    return (
      <div className="auth-page">
        <div className={s.bgLogo}>
          <img src={logo} alt="signin" className="login-logo" />
        </div>
        <Widget
          className={`widget-auth my-auto ${s.authForm}`}
          title={
            <h3 className="mt-0 mb-2" style={{ fontSize: 40 }}>
              Đăng nhập
            </h3>
          }
        >
          <p className="widget-auth-info">
            Nhập tài khoản và mật khẩu để đăng nhập vào hệ thống
          </p>
          <form className="mt" onSubmit={this.doLogin}>
            {this.props.errorMessage && (
              <Alert className="alert-sm" color="danger">
                {this.props.errorMessage}
              </Alert>
            )}
            <div className="form-group">
              <Label for="search-input1">Tài khoản</Label>
              <input
                className="form-control"
                defaultValue={"admin"}
                onChange={this.handleChange}
                required
                name="username"
                placeholder="Nhập tài khoản"
              />
            </div>
            <div className="form-group mb-2">
              <Label for="search-input1">Mật khẩu</Label>
              <input
                className="form-control"
                defaultValue={"123123"}
                onChange={this.handleChange}
                type="password"
                required
                name="password"
                placeholder="Nhập mật khẩu"
              />
            </div>
            <Button
              type="submit"
              color="warning"
              className="auth-btn my-3"
              size="sm"
            >
              {this.props.isFetching ? "Đang tải..." : "Đang nhập"}
            </Button>

            <footer className={s.footer}>
              {new Date().getFullYear()} © One React - React Admin Dashboard
              Template Made by &nbsp;
              <a
                href="https://flatlogic.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Flatlogic LLC
              </a>
            </footer>
          </form>
        </Widget>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(Login));
