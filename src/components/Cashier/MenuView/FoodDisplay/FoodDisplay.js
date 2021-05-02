import React from "react";

import FoodStatusBadge from "../../../Food/FoodStatusBadge/FoodStatusBadge";

import "./FoodDisplay.scss";
import { formatVnd } from "../../../../utils/moneyUtils";

const FoodDisplay = ({ food, handleSelectFood }) => {
  const { name, imageUrl, available, price } = food;

  const displayName = name.length > 15 ? name.slice(0, 15) + "..." : name;

  const priceDisplay = formatVnd(price);

  const title = `${name} (${priceDisplay})`;

  return (
    <div
      className={`food-display ${!available ? "food-disabled" : ""}`}
      title={title}
      onClick={() => handleSelectFood(food)}
    >
      <div
        className="food-image"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      >
        <span className="food-price">{priceDisplay}</span>
        <FoodStatusBadge status={available} />
      </div>
      <div className="food-name">
        <p>{displayName}</p>
      </div>
    </div>
  );
};

export default FoodDisplay;
