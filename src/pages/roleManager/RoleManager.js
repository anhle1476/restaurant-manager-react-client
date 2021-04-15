import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table } from "reactstrap";

import roleApi from "../../api/roleApi";

import { toastError } from "../../utils/toastUtils";

const RoleManager = () => {
  const [roles, setRoles] = useState([]);

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

  return (
    <>
      <Row>
        <Col>
          <h2>Quản lý chức vụ</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Chức vụ chính</h4>
          <p>Các chức vụ tham gia vận hành hệ thống</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th>Tên chức vụ</th>
                <th>Mã</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {roles
                .filter((r) => r.code !== "MISC")
                .map(({ id, name, code }) => (
                  <tr key={id}>
                    <th>{name}</th>
                    <th>{code}</th>
                    <th className="d-flex justify-content-end">
                      <Button color="warning">
                        <i className="fa fa-eye"></i>
                      </Button>
                    </th>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md="8">
          <h4>Chức vụ phụ</h4>
          <p>Các chức vụ không trực tiếp tham gia vận hành hệ thống</p>
        </Col>
        <Col
          sm="12"
          md="4"
          className="d-flex justify-content-md-end align-items-center"
        >
          <Button color="warning">Thêm chức vụ</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th>Tên chức vụ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {roles
                .filter((r) => r.code === "MISC")
                .map(({ id, name }) => (
                  <tr key={id}>
                    <th>{name}</th>
                    <th className="d-flex justify-content-end">
                      <Button color="warning">
                        <i className="fa fa-eye"></i>
                      </Button>
                    </th>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Button color="primary">Chức vụ đã khóa</Button>
    </>
  );
};

export default RoleManager;
