//import moment from 'moment';

export const formatDateStr = (str) => {
  return str ? str.split("-").reverse().join("-") : "";
};
