import React from "react";

import FoodStatusBadge from "../../../Food/FoodStatusBadge/FoodStatusBadge";

import "./FoodDisplay.scss";

const FoodDisplay = ({ food: { name, imageUrl, available, price } }) => {
  const displayName = name.length > 15 ? name.slice(0, 15) + "..." : name;

  return (
    <div className="food-display">
      <div
        className="food-image"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      >
        <span className="food-price">{price}₫</span>
        <FoodStatusBadge status={available} />
      </div>
      <div className="food-name">
        <p title={name}>{displayName}</p>
      </div>
    </div>
  );
};

export default FoodDisplay;
