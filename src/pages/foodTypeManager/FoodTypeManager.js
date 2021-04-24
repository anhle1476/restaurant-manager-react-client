import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table } from "reactstrap";

import foodTypeApi from "../../api/foodTypeApi";
import AddFoodTypeModal from "../../components/FoodType/AddFoodTypeModal/AddFoodTypeModal";
import EditFoodTypeModal from "../../components/FoodType/EditFoodTypeModal/EditFoodTypeModal";
import RestoreFoodTypeModal from "../../components/FoodType/RestoreFoodTypeModal/RestoreFoodTypeModal";

import { toastError } from "../../utils/toastUtils";

const FoodTypeManager = () => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [editFoodType, setEditFoodType] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await foodTypeApi.getAll();
        setFoodTypes(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      }
    }
    fetchData();
  }, []);

  const toggleEditFoodType = (foodType) => {
    setEditFoodType(foodType?.id ? foodType : {});
  };

  const handleUpdateFoodType = (updated) => {
    setFoodTypes(
      foodTypes.map((foodType) =>
        foodType.id === updated.id ? updated : foodType
      )
    );
  };

  const handleDeleteFoodType = (id) => {
    setFoodTypes(foodTypes.filter((foodType) => foodType.id !== id));
  };

  const toggleAdd = () => setShowAdd(!showAdd);

  const toggleRestore = () => setShowRestore(!showRestore);

  const handlePushNewFoodType = (newFoodType) =>
    setFoodTypes([...foodTypes, newFoodType]);

  return (
    <>
      <Row>
        <Col>
          <h2>Quản lý loại món</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button color="warning" onClick={toggleAdd}>
            Thêm loại món
          </Button>
          <Table className="my-2" bordered>
            <thead>
              <tr>
                <th>Tên loại món</th>
                <th>Được trả món</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {foodTypes.map((type) => (
                <tr key={type.id}>
                  <td>{type.name}</td>
                  <td>{type.refundable ? "Có" : "Không"}</td>
                  <td className="d-flex justify-content-end">
                    <Button
                      color="warning"
                      onClick={() => toggleEditFoodType(type)}
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
        Loại món đã khóa
      </Button>

      <AddFoodTypeModal
        show={showAdd}
        toggle={toggleAdd}
        handleAddFoodType={handlePushNewFoodType}
      />
      <EditFoodTypeModal
        show={Boolean(editFoodType?.id)}
        toggle={toggleEditFoodType}
        foodType={editFoodType}
        handleUpdateFoodType={handleUpdateFoodType}
        handleDeleteFoodType={handleDeleteFoodType}
      />
      <RestoreFoodTypeModal
        show={showRestore}
        toggle={toggleRestore}
        handleRestoreFoodType={handlePushNewFoodType}
      />
    </>
  );
};

export default FoodTypeManager;
