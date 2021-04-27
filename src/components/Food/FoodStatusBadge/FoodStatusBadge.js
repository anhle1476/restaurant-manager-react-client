import React from "react";
import { Badge } from "reactstrap";

const FoodStatusBadge = ({ status }) => {
  return status ? (
    <Badge className="food-status" color="success">
      Có sẵn
    </Badge>
  ) : (
    <Badge className="food-status" color="danger">
      Hết hàng
    </Badge>
  );
};

export default FoodStatusBadge;
