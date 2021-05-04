import { BASE_URL } from "./constant";
import axios from "axios";
import { formatDateYearFirst } from "../utils/dateUtils";

const BILLS_URL = `${BASE_URL}/bills`;

const create = (data) => {
  return axios.post(BILLS_URL, data);
};

const getCurrentBills = () => {
  return axios.get(BILLS_URL);
};

const getBillsByDate = (date) => {
  return axios.get(`${BILLS_URL}?date=${formatDateYearFirst(date)}`);
};

const searchById = (id) => {
  return axios.get(`${BILLS_URL}?search=${id}`);
};

const getCurrentBillsByTable = () => {
  return axios.get(`${BILLS_URL}/by-table`);
};

const getById = (id) => {
  return axios.get(`${BILLS_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${BILLS_URL}/${data.id}`, data);
};

const hardDelete = (id) => {
  return axios.delete(`${BILLS_URL}/${id}`);
};

const preparePayment = (data) => {
  return axios.post(`${BILLS_URL}/${data.id}/prepare-payment`, data);
};

const doPayment = (billId) => {
  return axios.post(`${BILLS_URL}/${billId}/payment`);
};

const changeTable = (billId, tableId) => {
  return axios.post(`${BILLS_URL}/${billId}/moving-to/${tableId}`);
};

const saveOrUpdate = (bill) => {
  return bill.id ? update(bill) : create(bill);
};

const processFood = (data) => {
  return axios.post(`${BILLS_URL}/${data.billId}/process-food`, data);
};

export default {
  getCurrentBills,
  getCurrentBillsByTable,
  getBillsByDate,
  getById,
  searchById,
  hardDelete,
  preparePayment,
  doPayment,
  changeTable,
  saveOrUpdate,
  processFood,
};
