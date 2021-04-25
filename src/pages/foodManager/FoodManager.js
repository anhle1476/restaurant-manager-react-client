import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "reactstrap";

import foodApi from "../../api/foodApi";
import AddFoodModal from "../../components/Food/AddFoodModal/AddFoodModal";
import EditFoodModal from "../../components/Food/EditFoodModal/EditFoodModal";
import RestoreFoodModal from "../../components/Food/RestoreFoodModal/RestoreFoodModal";
import FoodStatusBadge from "../../components/Food/FoodStatusBadge/FoodStatusBadge";

import CustomTable from "../../components/Table/CustomTable/CustomTable";

import { toastError } from "../../utils/toastUtils";

const FOOD_SCHEMA = {
  id: 0,
  name: "",
  price: 0,
  unit: "",
  foodType: {},
  imageUrl: "",
  available: false,
};

const FoodManager = () => {
  const [foods, setFoods] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [editFood, setEditFood] = useState(FOOD_SCHEMA);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await foodApi.getAll();
        setFoods(res.data);
      } catch (ex) {
        toastError("Lấy dữ liệu thất bại, vui lòng thử lại");
      }
    }
    fetchData();
  }, []);

  const tableData = foods.map((food) => ({
    ...food,
    foodTypeName: food.foodType.name,
  }));

  const tableColumns = [
    {
      Header: "",
      accessor: "imageUrl",
      Cell: ({ value }) => <img src={value} alt="food" height="50" />,
    },
    {
      Header: "Tên món",
      accessor: "name",
    },
    {
      Header: "Loại món",
      accessor: "foodTypeName",
    },
    {
      Header: "Giá (₫)",
      accessor: "price",
    },
    {
      Header: "Đơn vị",
      accessor: "unit",
    },
    {
      Header: "Trạng thái",
      accessor: "available",
      Cell: ({ value }) => <FoodStatusBadge status={value} />,
    },
    {
      Header: "",
      accessor: "id",
      Cell: ({ value }) => (
        <Button color="warning" onClick={() => toggleEditModal(value)}>
          <i className="fa fa-eye"></i>
        </Button>
      ),
    },
  ];

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleRestoreModal = () => {
    setShowRestoreModal(!showRestoreModal);
  };

  const handleAddFood = (newFood) => {
    setFoods([...foods, newFood]);
  };

  const toggleEditModal = (id) => {
    let editing = id ? foods.find((s) => s.id === id) : undefined;
    setEditFood(editing ? editing : FOOD_SCHEMA);
  };

  const handleEditFood = (edited) => {
    setFoods(foods.map((food) => (food.id === edited.id ? edited : food)));
  };

  const handleDeleteFood = (id) => {
    setFoods(foods.filter((food) => food.id !== id));
  };

  const handleRestoreFood = (restored) => {
    setFoods([...foods, restored]);
  };

  return (
    <>
      <Row>
        <Col>
          <h2>Quản lý món</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <CustomTable tableData={tableData} tableColumns={tableColumns}>
            <Button color="warning" onClick={toggleAddModal}>
              Thêm món
            </Button>
          </CustomTable>
        </Col>
      </Row>
      <Button color="primary" onClick={toggleRestoreModal}>
        Món đã khóa
      </Button>

      <AddFoodModal
        show={showAddModal}
        toggle={toggleAddModal}
        handleAddFood={handleAddFood}
      />
      <EditFoodModal
        show={Boolean(editFood.id)}
        toggle={toggleEditModal}
        food={editFood}
        handleEditFood={handleEditFood}
        handleDeleteFood={handleDeleteFood}
      />
      <RestoreFoodModal
        show={showRestoreModal}
        toggle={toggleRestoreModal}
        handleRestoreFood={handleRestoreFood}
      ></RestoreFoodModal>
    </>
  );
};

export default FoodManager;
