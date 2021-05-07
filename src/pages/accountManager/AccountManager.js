import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Col, Form, Row } from "reactstrap";
import CustomInputGroup from "../../components/CustomInputGroup/CustomInputGroup";

import accountApi from "../../api/accountApi";
import staffApi from "../../api/staffApi";
import { toastError, toastSuccess } from "../../utils/toastUtils";

const ACCOUNT_INFO_SCHEMA = {
  username: "",
  fullname: "",
  phoneNumber: "",
};

const UPDATE_PASSWORD_SCHEMA = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const AccountManager = ({ accountId }) => {
  const [data, setData] = useState(ACCOUNT_INFO_SCHEMA);
  const [dataFeedback, setDataFeedback] = useState({});
  const [updatePassword, setUpdatePassword] = useState(UPDATE_PASSWORD_SCHEMA);
  const [updatePasswordFeedback, setUpdatePasswordFeedback] = useState({});

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const res = await staffApi.getById(accountId);
        setData(res.data);
      } catch (ex) {
        toastError(
          "Lấy thông tin tài khoản thất bại: " + ex.response?.data?.message
        );
      }
    };
    fetchAccountData();
  }, [accountId]);

  const handleChangeData = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmitUpdateInfo = async (e) => {
    e.preventDefault();
    setDataFeedback({});
    try {
      const dataForm = {
        fullname: data.fullname,
        phoneNumber: data.phoneNumber,
      };
      const res = await accountApi.updateInfo(dataForm);
      setData(res.data);
      toastSuccess("Cập nhật thông tin thành công");
    } catch (ex) {
      const feedback = ex.response.data;
      if (feedback) setDataFeedback(feedback);
      toastError("Cập nhật thông tin tài khoản thất bại");
    }
  };

  const handleChangePassword = ({ target }) => {
    setUpdatePassword({ ...updatePassword, [target.name]: target.value });
  };

  const handleSubmitUpdatePassword = async (e) => {
    e.preventDefault();
    if (updatePassword.newPassword !== updatePassword.confirmPassword) {
      setUpdatePasswordFeedback({
        confirmPassword: "Mật khẩu không trùng khớp",
      });
      return;
    }
    try {
      const { confirmPassword, ...dataForm } = updatePassword;
      await accountApi.updatePassword(dataForm);
      setUpdatePassword(UPDATE_PASSWORD_SCHEMA);
      setUpdatePasswordFeedback({});
      toastSuccess("Cập nhật mật khẩu thành công");
    } catch (ex) {
      const feedback = ex.response.data;
      setUpdatePasswordFeedback(
        feedback?.message ? { currentPassword: feedback.message } : feedback
      );
      console.log(feedback);
      toastError("Cập nhật mật khẩu thất bại");
    }
  };

  return (
    <Row>
      <Col md="6">
        <Form onSubmit={handleSubmitUpdateInfo}>
          <h4>Thông tin cá nhân</h4>
          <CustomInputGroup
            required
            disabled
            label="Tên tài khoản"
            name="username"
            defaultValue={data.username}
          />
          <CustomInputGroup
            required
            onChange={handleChangeData}
            label="Họ và tên"
            name="fullname"
            value={data.fullname}
            feedback={dataFeedback.fullname}
          />
          <CustomInputGroup
            required
            onChange={handleChangeData}
            label="Số điện thoại"
            name="phoneNumber"
            value={data.phoneNumber}
            feedback={dataFeedback.phoneNumber}
          />
          <Button type="submit" color="warning" block>
            Cập nhật thông tin
          </Button>
        </Form>
      </Col>
      <Col md="6">
        <Form onSubmit={handleSubmitUpdatePassword}>
          <h4>Đổi mật khẩu</h4>
          <CustomInputGroup
            required
            type="password"
            onChange={handleChangePassword}
            label="Mật khẩu hiện tại:"
            name="currentPassword"
            value={updatePassword.currentPassword}
            feedback={updatePasswordFeedback.currentPassword}
          />
          <CustomInputGroup
            required
            type="password"
            onChange={handleChangePassword}
            label="Mật khẩu mới:"
            name="newPassword"
            value={updatePassword.newPassword}
            feedback={updatePasswordFeedback.newPassword}
          />
          <CustomInputGroup
            required
            type="password"
            onChange={handleChangePassword}
            label="Nhập lại mật khẩu mới:"
            name="confirmPassword"
            value={updatePassword.confirmPassword}
            feedback={updatePasswordFeedback.confirmPassword}
          />
          <Button type="submit" color="danger" block>
            Đổi mật khẩu
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => ({
  accountId: state.auth.staffId,
});

export default connect(mapStateToProps)(AccountManager);
