import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Button, Label, Input, FormGroup } from "reactstrap";
import Widget from "../../components/Widget";
import s from "./Login.module.scss";
import logo from "../../images/logo.svg";
import { loginSuccess } from "../../actions/user";
import { login } from "../../api/accountApi";

const DEFAULT_STATE = {
  isFetching: false,
  username: "",
  password: "",
  errorMessage: "",
};

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;
  }

  doLogin = async (e) => {
    e.preventDefault();
    this.setState({ isFetching: true });
    try {
      const { isFetching, errorMessage, ...loginForm } = this.state;
      const res = await login(loginForm);
      this.props.loginSuccess(res.data.token);
    } catch (ex) {
      this.setState({
        errorMessage: "Tài khoản hoặc mật khẩu không chính xác",
        isFetching: false,
      });
    }
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  render() {
    if (this.props.isAuthenticated) return <Redirect to={"/app"} />;

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
            {this.state.errorMessage && (
              <Alert className="alert-sm" color="danger">
                {this.state.errorMessage}
              </Alert>
            )}
            <FormGroup>
              <Label for="search-input1">Tài khoản</Label>
              <Input
                value={this.state.username}
                onChange={this.handleChange}
                required
                name="username"
                placeholder="Nhập tài khoản"
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="search-input1">Mật khẩu</Label>
              <Input
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
                required
                name="password"
                placeholder="Nhập mật khẩu"
              />
            </FormGroup>
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
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps, { loginSuccess })(Login));
