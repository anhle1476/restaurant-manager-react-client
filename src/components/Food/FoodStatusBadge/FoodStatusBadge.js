import React from "react";
import { Badge } from "reactstrap";

const FoodStatusBadge = ({ status }) => {
  return status ? (
    <Badge color="success"> Có sẵn </Badge>
  ) : (
    <Badge color="danger"> Hết hàng </Badge>
  );
};

export default FoodStatusBadge;
