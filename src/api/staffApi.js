import {
  STAFF_DATA,
  getStaffById,
  updateStaff,
  deleteStaff,
  addStaff,
  restoreStaff,
} from "./fake-data";

const create = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(addStaff(data));
    }, 100);
  });
};

const getAll = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(STAFF_DATA.filter((staff) => !staff.deleted));
    }, 100);
  });
};

const getById = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStaffById(id));
    }, 100);
  });
};

const update = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(updateStaff(data));
    }, 100);
  });
};

const softDelete = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(deleteStaff(id));
    }, 100);
  });
};

const restore = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(restoreStaff(id));
    }, 100);
  });
};

export default {
  getAll,
  getById,
  update,
  softDelete,
  create,
  restore,
};
