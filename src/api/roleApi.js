import {
  ROLE_DATA,
  getRoleById,
  updateRole,
  deleteRole,
  addRole,
  restoreRole,
} from "./fake-data";

const create = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(addRole(data));
    }, 100);
  });
};

const getAll = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ROLE_DATA.filter((staff) => !staff.deleted));
    }, 100);
  });
};

const getById = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getRoleById(id));
    }, 100);
  });
};

const update = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(updateRole(data));
    }, 100);
  });
};

const softDelete = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(deleteRole(id));
    }, 100);
  });
};

const restore = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(restoreRole(id));
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
