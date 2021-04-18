import { BASE_URL } from "./constant";
import axios from "axios";
import moment from "moment";

const SCHEDULE_URL = `${BASE_URL}/schedules`;

const create = (data) => {
  return axios.post(SCHEDULE_URL, data);
};

const getAll = () => {
  return axios.get(SCHEDULE_URL);
};

const getAllByMonth = (date) => {
  const monthStr = moment(date).format("yyyy-MM");
  return axios.get(`${SCHEDULE_URL}/by-month/${monthStr}`);
};

const getById = (id) => {
  return axios.get(`${SCHEDULE_URL}/${id}`);
};

const update = (data) => {
  return axios.put(`${SCHEDULE_URL}/${data.id}`, data);
};

const deleteSchedule = (id) => {
  return axios.delete(`${SCHEDULE_URL}/${id}`);
};

export default {
  getAll,
  getById,
  getAllByMonth,
  update,
  deleteSchedule,
  create,
};
