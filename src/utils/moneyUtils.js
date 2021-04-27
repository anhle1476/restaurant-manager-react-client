const FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const formatVnd = (money) => FORMATTER.format(money);
