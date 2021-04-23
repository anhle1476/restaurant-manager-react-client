import { BASE_URL } from "./constant";
import axios from "axios";

const SALARY_URL = `${BASE_URL}/salaries`;

const parseYearMonth = (year, month) =>
  year + "-" + (month.length === 1 ? "0" + month : month);

const getAllStats = () => {
  return axios.get(SALARY_URL);
};

const getAllDetailsByMonth = (year, month) => {
  const yearMonth = parseYearMonth(year, month);
  return axios.get(`${SALARY_URL}/${yearMonth}`);
};

const getDetailsOfStaffByMonth = (year, month, staffId) => {
  const yearMonth = parseYearMonth(year, month);
  return axios.get(`${SALARY_URL}/${yearMonth}/staffs/${staffId}`);
};

export default { getAllStats, getAllDetailsByMonth, getDetailsOfStaffByMonth };
