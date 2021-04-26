import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Row, Col } from "reactstrap";

import foodTypeApi from "../../../api/foodTypeApi";

import "./MenuView.scss";

const MenuView = ({ foods }) => {
  const [foodTypes, setFoodTypes] = useState([]);

  useEffect(() => {
    const doFetch = async () => {
      const res = await foodTypeApi.getAll();
      setFoodTypes(res.data);
    };
    doFetch();
  }, []);

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
                <Input placeholder="Tên món..." />
                <Input type="select">
                  <option value="">Tất cả loại món</option>
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
        {/* <div className="food-container"> */}
        {foods.map((food, i) => (
          <div
            className="food-display"
            key={i}
            style={{ backgroundImage: `url("${food.imageUrl}")` }}
          >
            {food.name}
          </div>
        ))}
        {/* </div> */}
      </div>
    </div>
  );
};

export default MenuView;
