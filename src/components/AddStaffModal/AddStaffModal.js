import React, { useState, useEffect } from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";

import roleApi from "../../api/roleApi";
import staffApi from "../../api/staffApi";
import { toastError, toastSuccess } from "../../utils/toastUtils";

const INITIAL_FEEDBACK = {
  username: "",
  password: "",
  confirmPassword: "",
  fullname: "",
  phoneNumber: "",
  role: "",
  salaryPerShift: "",
};

const AddStaffModal = ({ show, toggle, addStaff }) => {
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    phoneNumber: "",
    role: "",
    salaryPerShift: 0,
  });

  const [feedBack, setFeedBack] = useState(INITIAL_FEEDBACK);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await roleApi.getAll();
        setRoles(res.data);
      } catch (ex) {
        console.log(ex);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      setFeedBack({
        ...feedBack,
        confirmPassword: "Mật khẩu xác nhận không khớp",
      });
      return;
    }
    setFeedBack(INITIAL_FEEDBACK);

    const staffData = mapStaffData(data, roles);
    console.log(staffData);
    try {
      const res = await staffApi.create(staffData);
      addStaff(res.data);
      toastSuccess("Thêm nhân viên thành công");
      toggle();
    } catch (ex) {
      setFeedBack({ ...feedBack, ...ex.response.data });
      toastError("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  return (
    <Modal isOpen={show} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader>Thêm nhân viên</ModalHeader>
        <ModalBody className="bg-white">
          <FormGroup>
            <Label for="username">Tên tài khoản</Label>
            <Input
              required
              onChange={handleChange}
              name="username"
              value={data.username}
              invalid={feedBack.username !== ""}
            />
            <FormFeedback>{feedBack.username}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="password">Mật khẩu</Label>
            <Input
              required
              onChange={handleChange}
              name="password"
              type="password"
              value={data.password}
              invalid={feedBack.password !== ""}
            />
            <FormFeedback>{feedBack.password}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              required
              onChange={handleChange}
              name="confirmPassword"
              type="password"
              value={data.confirmPassword}
              invalid={feedBack.confirmPassword !== ""}
            />
            <FormFeedback>{feedBack.confirmPassword}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="fullname">Họ và tên</Label>
            <Input
              required
              onChange={handleChange}
              name="fullname"
              value={data.fullname}
              invalid={feedBack.fullname !== ""}
            />
            <FormFeedback>{feedBack.fullname}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="phoneNumber">Số điện thoại</Label>
            <Input
              required
              onChange={handleChange}
              name="phoneNumber"
              value={data.phoneNumber}
              invalid={feedBack.phoneNumber !== ""}
            />
            <FormFeedback>{feedBack.phoneNumber}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="role">Chức vụ</Label>
            <Input
              required
              type="select"
              onChange={handleChange}
              name="role"
              value={data.role}
              invalid={feedBack.role !== ""}
            >
              <option disabled value="">
                --- Chọn chức vụ ---
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Input>
            <FormFeedback>{feedBack.role}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="salaryPerShift">Lương/Ca</Label>
            <Input
              required
              onChange={handleChange}
              type="number"
              name="salaryPerShift"
              min="0"
              max="20000000"
              value={data.salaryPerShift}
              invalid={feedBack.salaryPerShift !== ""}
            />
            <FormFeedback>{feedBack.salaryPerShift}</FormFeedback>
          </FormGroup>
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
