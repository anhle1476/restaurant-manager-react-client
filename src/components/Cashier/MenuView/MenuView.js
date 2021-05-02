import React, { useState, useEffect } from "react";
import { Button, Col, Form, FormGroup, Input, Row } from "reactstrap";

import FoodDisplay from "./FoodDisplay/FoodDisplay";

import foodTypeApi from "../../../api/foodTypeApi";

import "./MenuView.scss";

const MenuView = ({ foods, handleSelectFood, handleToggleAvailable }) => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodSearch, setFoodSearch] = useState({ name: "", type: "" });
  const [availableMarking, setAvailableMarking] = useState(false);

  useEffect(() => {
    const doFetch = async () => {
      const res = await foodTypeApi.getAll();
      setFoodTypes(res.data);
    };
    doFetch();
  }, []);

  const handleFoodSearch = ({ target }) => {
    setFoodSearch({ ...foodSearch, [target.name]: target.value });
  };

  const handleSelectOrToggle = (e) => {
    if (availableMarking) handleToggleAvailable(e);
    else handleSelectFood(e);
  };

  const displayingFoods = foods.filter(
    ({ name, foodType }) =>
      name.toLowerCase().indexOf(foodSearch.name.toLowerCase()) !== -1 &&
      (!foodSearch.type || foodType.id === Number(foodSearch.type))
  );

  const notAvailableCount = foods.reduce(
    (sum, food) => (sum += food.available ? 0 : 1),
    0
  );

  return (
    <div className={`flex-container ${availableMarking ? "marking-mode" : ""}`}>
      <div className="flex-header">
        <h4>Menu</h4>
        <Form
          className="menu-search-form"
          inline
          onSubmit={(e) => e.preventDefault()}
        >
          <FormGroup>
            <Input
              name="name"
              onChange={handleFoodSearch}
              value={foodSearch.name}
              placeholder="Tên món..."
            />
            <Input
              name="type"
              onChange={handleFoodSearch}
              defaultValue={foodSearch.type}
              type="select"
            >
              <option value="">Tất cả</option>
              {foodTypes.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
      </div>
      <div className="flex-body">
        <div className="flex-scrollable food-container">
          {displayingFoods.map((food) => (
            <FoodDisplay
              handleSelectFood={handleSelectOrToggle}
              key={food.id}
              food={food}
            />
          ))}
        </div>
      </div>
      <div className="flex-footer">
        <Row className="m-0">
          <Col sm="5" xs="12" className="px-3">
            <p>
              {displayingFoods.length}/{foods.length} món ({notAvailableCount}{" "}
              hết)
            </p>
          </Col>
          <Col sm="7" xs="12" className="px-3">
            <Button
              block
              onClick={() => setAvailableMarking(!availableMarking)}
              color={availableMarking ? "danger" : "warning"}
              className="font-weight-bold mx-2"
            >
              {availableMarking ? "Thoát đánh dấu món" : "Đánh dấu hết món"}
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MenuView;
