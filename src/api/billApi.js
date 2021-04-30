import { BASE_URL } from "./constant";
import axios from "axios";

const BILLS_URL = `${BASE_URL}/bills`;

const create = (data) => {
  return axios.post(BILLS_URL, data);
};

const getCurrentBills = () => {
  return axios.get(BILLS_URL);
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

const doPayment = (data) => {
  return axios.post(`${BILLS_URL}/${data.id}/payment`, data);
};

const changeTable = ({ billId, tableId }) => {
  return axios.post(`${BILLS_URL}/${billId}/moving-to/${tableId}`);
};

const saveOrUpdate = (bill) => {
  return bill.id ? update(bill) : create(bill);
};

export default {
  getCurrentBills,
  getCurrentBillsByTable,
  getById,
  hardDelete,
  doPayment,
  changeTable,
  saveOrUpdate,
};
