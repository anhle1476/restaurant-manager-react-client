import moment from "moment";

export const formatDateStr = (str) => {
  return str ? str.split("-").reverse().join("-") : "";
};

export const isBeforeThisMonth = (date) => {
  return moment().startOf("month").isAfter(date);
};

export const formatMonthStr = (str) => {
  if (!str) return "";
  const [year, month] = str.split("-");
  return month + "/" + year;
};

export const formatDateTime = (str) =>
  moment(new Date(str)).format("DD/MM hh:mm");

export const getMinuteDifference = (str) => {
  let diff = (new Date().getTime() - new Date(str).getTime()) / 1000;
  return Math.abs(Math.round(diff / 60));
};
