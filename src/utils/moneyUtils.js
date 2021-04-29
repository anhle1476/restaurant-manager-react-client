const FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const formatVnd = (money) => FORMATTER.format(money);

export const getBillRawCost = (bill) =>
  bill.billDetails?.length
    ? bill.billDetails.reduce(
        (sum, { food, quantity }) => sum + food.price * quantity,
        0
      )
    : 0;
