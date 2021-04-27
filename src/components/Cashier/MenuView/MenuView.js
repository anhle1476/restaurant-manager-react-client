import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Row, Col } from "reactstrap";

import FoodDisplay from "./FoodDisplay/FoodDisplay";

import foodTypeApi from "../../../api/foodTypeApi";

import "./MenuView.scss";

const MenuView = ({ foods }) => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodSearch, setFoodSearch] = useState({ name: "", type: "" });

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

  const foodSearchFilter = (food) => {
    return (
      food.name.toLowerCase().indexOf(foodSearch.name.toLowerCase()) !== -1 &&
      (!foodSearch.type || food.foodType.id === Number(foodSearch.type))
    );
  };

  return (
    <div className="flex-container">
      <div className="flex-header">
        <Row className="menu-header">
          <Col xs="2" sm="3">
            <h4>Menu</h4>
          </Col>
          <Col xs="10" sm="9">
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
                  value={foodSearch.type}
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
          </Col>
        </Row>
      </div>
      <div className="flex-scrollable food-container">
        {foods.filter(foodSearchFilter).map((food) => (
          <FoodDisplay key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default MenuView;
