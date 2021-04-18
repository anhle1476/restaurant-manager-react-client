import moment from "moment";

export const formatDateStr = (str) => {
  return str ? str.split("-").reverse().join("-") : "";
};

export const isBeforeThisMonth = (date) => {
  return moment().startOf("month").isAfter(date);
};
