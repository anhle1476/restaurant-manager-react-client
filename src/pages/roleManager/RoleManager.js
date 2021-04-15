import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table } from "reactstrap";

import roleApi from "../../api/roleApi";
import EditRoleModal from "../../components/EditRoleModal/EditRoleModal";
import RestoreRoleModal from "../../components/RestoreRoleModal/RestoreRoleModal";

import s from "./RoleManager.module.scss";

import { toastError } from "../../utils/toastUtils";
import AddRoleModal from "../../components/AddRoleModal/AddRoleModal";

const RoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [editRole, setEditRole] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

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

  const toggleEditRole = (role) => {
    setEditRole(role?.id ? role : {});
  };

  const handleUpdateRole = (updated) => {
    setRoles(roles.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const toggleAdd = () => setShowAdd(!showAdd);

  const toggleRestore = () => setShowRestore(!showRestore);

  const handlePushNewRole = (newRole) => setRoles([...roles, newRole]);

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
                <th className={s.roleName}>Tên chức vụ</th>
                <th>Mã</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {roles
                .filter((r) => r.code !== "MISC")
                .map((r) => (
                  <tr key={r.id}>
                    <th className={s.roleName}>{r.name}</th>
                    <th>{r.code}</th>
                    <th className="d-flex justify-content-end">
                      <Button color="warning" onClick={() => toggleEditRole(r)}>
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
          <Button color="warning" onClick={toggleAdd}>
            Thêm chức vụ
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th className={s.roleName}>Tên chức vụ</th>
                <th>Mã</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {roles
                .filter((r) => r.code === "MISC")
                .map((r) => (
                  <tr key={r.id}>
                    <th className={s.roleName}>{r.name}</th>
                    <th>{r.code}</th>
                    <th className="d-flex justify-content-end">
                      <Button color="warning" onClick={() => toggleEditRole(r)}>
                        <i className="fa fa-eye"></i>
                      </Button>
                    </th>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Button color="primary" onClick={toggleRestore}>
        Chức vụ đã khóa
      </Button>
      <AddRoleModal
        show={showAdd}
        toggle={toggleAdd}
        handleAddRole={handlePushNewRole}
      />
      <EditRoleModal
        show={Boolean(editRole.id)}
        toggle={toggleEditRole}
        role={editRole}
        handleUpdateRole={handleUpdateRole}
        handleDeleteRole={handleDeleteRole}
      />
      <RestoreRoleModal
        show={showRestore}
        toggle={toggleRestore}
        handleRestoreRole={handlePushNewRole}
      />
    </>
  );
};

export default RoleManager;
