import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table } from "reactstrap";

import violationApi from "../../api/violationApi";
import AddViolationModal from "../../components/Violation/AddViolationModal/AddViolationModal";
import EditViolationModal from "../../components/Violation/EditViolationModal/EditViolationModal";
import RestoreViolationModal from "../../components/Violation/RestoreViolationModal/RestoreViolationModal";

import { toastError } from "../../utils/toastUtils";

const ViolationManager = () => {
  const [violations, setViolations] = useState([]);
  const [editViolation, setEditViolation] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await violationApi.getAll();
        setViolations(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      }
    }
    fetchData();
  }, []);

  const toggleEditViolation = (violation) => {
    setEditViolation(violation?.id ? violation : {});
  };

  const handleUpdateViolation = (updated) => {
    setViolations(violations.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleDeleteViolation = (id) => {
    setViolations(violations.filter((v) => v.id !== id));
  };

  const toggleAdd = () => setShowAdd(!showAdd);

  const toggleRestore = () => setShowRestore(!showRestore);

  const handlePushNewViolation = (newViolation) =>
    setViolations([...violations, newViolation]);

  return (
    <>
      <Row>
        <Col>
          <h2>Quản lý vi phạm</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button color="warning" onClick={toggleAdd}>
            Thêm vi phạm
          </Button>
          <Table className="my-2" bordered>
            <thead>
              <tr>
                <th>Tên vi phạm</th>
                <th>Mức phạt theo ca</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {violations.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.finesPercent}%</td>
                  <td className="d-flex justify-content-end">
                    <Button
                      color="warning"
                      onClick={() => toggleEditViolation(v)}
                    >
                      <i className="fa fa-eye"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Button color="primary" onClick={toggleRestore}>
        Vi phạm đã khóa
      </Button>

      <AddViolationModal
        show={showAdd}
        toggle={toggleAdd}
        handleAddViolation={handlePushNewViolation}
      />
      <EditViolationModal
        show={Boolean(editViolation?.id)}
        toggle={toggleEditViolation}
        violation={editViolation}
        handleUpdateViolation={handleUpdateViolation}
        handleDeleteViolation={handleDeleteViolation}
      />
      <RestoreViolationModal
        show={showRestore}
        toggle={toggleRestore}
        handleRestoreViolation={handlePushNewViolation}
      />
    </>
  );
};

export default ViolationManager;
