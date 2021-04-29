const BILL_SCHEMA = {
  startTime: undefined,
  appTable: {},
  billDetails: [],
  surcharge: 0,
  discount: 0,
  discountDescription: "",
  lastPrice: 0,
};

const BILL_DETAILS_SCHEMA = {
  food: {},
  quantity: 0,
  doneQuantity: 0,
};

/* CHANGE BILL FUNCTIONS */

export const changeBillActions = {
  plusAmount: function (bill = { ...BILL_SCHEMA }, food, amount, table) {
    // if bill is a new bill or don't have any food -> add food and return
    if (bill.billDetails.length === 0)
      return {
        ...bill,
        appTable: table,
        billDetails: [this.createNewBillDetail(food, amount)],
      };
    let foodNotExist = true;
    const billDetailsLength = bill.billDetails.length;
    for (let i = 0; i < billDetailsLength; i++) {
      const currentDetail = bill.billDetails[i];
      if (currentDetail.food.id !== food.id) continue;
      const resultAmount = currentDetail.quantity + amount;
      bill.billDetails[i] = this.updateDetailWithAmount(
        currentDetail,
        resultAmount
      );
      foodNotExist = false;
      break;
    }
    if (foodNotExist)
      bill.billDetails.push(this.createNewBillDetail(food, amount));
    bill.changed = true;
    return bill;
  },
  toAmount: function (bill, food, amount) {
    return {
      ...bill,
      billDetails: bill.billDetails.map((detail) =>
        detail.food.id === food.id
          ? this.updateDetailWithAmount(detail, amount)
          : detail
      ),
      changed: true,
    };
  },
  removeFood: function (bill, foodId) {
    return {
      ...bill,
      billDetails: bill.billDetails.filter(
        (detail) => detail.food.id !== foodId
      ),
      changed: true,
    };
  },
  createNewBillDetail: function (food, amount) {
    return { ...BILL_DETAILS_SCHEMA, food: food, quantity: amount };
  },
  updateDetailWithAmount: function (detail, newAmount) {
    return {
      ...detail,
      quantity: this.limitValue(newAmount, detail.doneQuantity),
    };
  },
  limitValue: function (amount, min) {
    return amount < min ? min : amount > 2000 ? 2000 : amount;
  },
};

export const deleteBillActions = {
  updateBillByTable: function (currentBillMap, tableId) {
    const newBillsByTable = { ...currentBillMap };
    delete newBillsByTable[tableId];
    return newBillsByTable;
  },
};
