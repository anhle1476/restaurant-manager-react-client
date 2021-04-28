import React, { useState, useEffect } from "react";

import { Modal, ModalBody, ModalFooter, Form, Button } from "reactstrap";

import roleApi from "../../../api/roleApi";
import staffApi from "../../../api/staffApi";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import ModalHeaderWithCloseBtn from "../../ModalHeaderWithCloseBtn/ModalHeaderWithCloseBtn";
import CustomInputGroup from "../../CustomInputGroup/CustomInputGroup";

const INITIAL_FEEDBACK = {
  username: "",
  password: "",
  confirmPassword: "",
  fullname: "",
  phoneNumber: "",
  role: "",
  salaryPerShift: "",
};

const ADD_SCHEMA = {
  username: "",
  password: "",
  confirmPassword: "",
  fullname: "",
  phoneNumber: "",
  role: "",
  salaryPerShift: 0,
};

const AddStaffModal = ({ show, toggle, handleAddStaff }) => {
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState(ADD_SCHEMA);

  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await roleApi.getAll();
        setRoles(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      setFeedback({
        ...feedback,
        confirmPassword: "Mật khẩu xác nhận không khớp",
      });
      return;
    }
    setFeedback(INITIAL_FEEDBACK);

    const staffData = mapStaffData(data, roles);
    console.log(staffData);
    try {
      const res = await staffApi.create(staffData);
      handleAddStaff(res.data);
      toastSuccess("Thêm nhân viên thành công");
      toggle();
      setData(ADD_SCHEMA);
    } catch (ex) {
      setFeedback({ ...feedback, ...ex.response.data });
      toastError("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalHeaderWithCloseBtn toggle={toggle}>
          Thêm nhân viên
        </ModalHeaderWithCloseBtn>
        <ModalBody className="bg-white">
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Tên tài khoản"
            name="username"
            value={data.username}
            feedback={feedback.username}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Mật khẩu"
            type="password"
            name="password"
            value={data.password}
            feedback={feedback.password}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={data.confirmPassword}
            feedback={feedback.confirmPassword}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Họ và tên"
            name="fullname"
            value={data.fullname}
            feedback={feedback.fullname}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Số điện thoại"
            name="phoneNumber"
            value={data.phoneNumber}
            feedback={feedback.phoneNumber}
          />
          <CustomInputGroup
            required
            onChange={handleChange}
            label="Chức vụ"
            type="select"
            name="role"
            value={data.role}
            feedback={feedback.role}
          >
            <option disabled value="">
              --- Chọn chức vụ ---
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </CustomInputGroup>
          {data.role === "1" && (
            <p className="text-danger">* Chức vụ này có quyền ADMIN</p>
          )}
          <CustomInputGroup
            required
            onChange={handleChange}
            type="number"
            label="Lương/Ca"
            name="salaryPerShift"
            min="0"
            max="20000000"
            value={data.salaryPerShift}
            feedback={feedback.salaryPerShift}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggle}>
            Hủy
          </Button>{" "}
          <Button color="warning" type="submit">
            Lưu
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

const mapStaffData = (data, roles) => ({
  username: data.username,
  password: data.password,
  fullname: data.fullname,
  phoneNumber: data.phoneNumber,
  role: roles.find((r) => r.id === Number(data.role)),
  salaryPerShift: Number(data.salaryPerShift),
});

export default AddStaffModal;
