const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const MONEY_FORMATTER = new Intl.NumberFormat("vi-VN");

export const formatVnd = (money) => VND_FORMATTER.format(money);

export const formatMoney = (money) => MONEY_FORMATTER.format(money);

export const getBillRawCost = (bill) =>
  bill.billDetails?.length
    ? bill.billDetails.reduce(
        (sum, { food, quantity }) => sum + food.price * quantity,
        0
      )
    : 0;
