import moment from "moment";

export const formatDateStr = (str) => {
  return str ? str.split("-").reverse().join("/") : "";
};

export const isBeforeThisMonth = (date) => {
  return moment().startOf("month").isAfter(date);
};

export const formatMonthStr = (str) => {
  return moment(new Date(str)).format("MM/YYYY");
};

export const formatDateYearFirst = (str) =>
  moment(new Date(str)).format("YYYY-MM-DD");

export const formatDateDayFirst = (str) =>
  moment(new Date(str)).format("DD/MM/YYYY");

export const formatDateTime = (str) =>
  moment(new Date(str)).format("HH:mm DD/MM");

export const formatFullDateTime = (str) =>
  moment(new Date(str)).format("HH:mm DD/MM/YYYY");

export const formatCurrentFullDateTime = () =>
  moment().format("HH:mm DD/MM/YYYY");

export const formatTime = (str) => moment(new Date(str)).format("HH:mm");

export const getMinuteDifference = (str) => {
  return moment().diff(new Date(str), "minutes");
};

export const isPastDay = (date) => {
  return fromToday(date) > 0;
};

export const fromToday = (date) => {
  return moment().startOf("day").diff(moment(date).startOf("day"), "days");
};
