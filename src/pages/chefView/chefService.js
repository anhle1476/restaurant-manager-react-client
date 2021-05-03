export const parseBillsToOrders = (bills) => {
  return bills
    .map(({ id, appTable, billDetails }) =>
      billDetails
        .filter(({ quantity, doneQuantity }) => doneQuantity < quantity)
        .map((detail) => ({
          ...detail,
          billId: id,
          table: appTable.name,
        }))
    )
    .flat()
    .sort((o1, o2) => new Date(o1.lastOrderTime) - new Date(o2.lastOrderTime));
};

export const parseFoodsToOptions = (foods) => {
  const optionMap = foods.reduce((obj, food) => {
    const type = food.foodType.name;
    const currentOptions = obj[type] ? obj[type] : [];
    currentOptions.push({ value: food.id, label: food.name });
    obj[type] = currentOptions;
    return obj;
  }, {});

  console.log(optionMap);

  const options = [];
  for (const type in optionMap) {
    options.push({
      label: type,
      options: optionMap[type],
    });
  }
  return options;
};
