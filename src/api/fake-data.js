export let STAFF_DATA = [
  {
    id: 21,
    username: "Cleo123",
    fullname: "Cleo Fry",
    phoneNumber: "0716283089",
    role: {
      id: 2,
      name: "Thu ngân",
      code: "CASHIER",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 23,
    username: "Kathryn123",
    fullname: "Kathryn Hancock",
    phoneNumber: "0395216671",
    role: {
      id: 6,
      name: "Giữ xe",
      code: "CASHIER",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 24,
    username: "Rojas123",
    fullname: "Rojas Colon",
    phoneNumber: "0202771330",
    role: {
      id: 1,
      name: "Quản trị viên",
      code: "ADMIN",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 37,
    username: "Padilla123",
    fullname: "Padilla Clemons",
    phoneNumber: "0123959288",
    role: {
      id: 1,
      name: "Quản trị viên",
      code: "ADMIN",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 2,
    username: "Leigh123",
    fullname: "Leigh Bates",
    phoneNumber: "0753880040",
    role: {
      id: 6,
      name: "Giữ xe",
      code: "CHEF",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 29,
    username: "Megan123",
    fullname: "Megan Dennis",
    phoneNumber: "0754732276",
    role: {
      id: 3,
      name: "Đầu bếp",
      code: "CHEF",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 27,
    username: "Ana123",
    fullname: "Ana Jenkins",
    phoneNumber: "0554463583",
    role: {
      id: 6,
      name: "Giữ xe",
      code: "CHEF",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 13,
    username: "Dina123",
    fullname: "Dina Mcgowan",
    phoneNumber: "096577857",
    role: {
      id: 2,
      name: "Thu ngân",
      code: "CASHIER",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 45,
    username: "Chaney123",
    fullname: "Chaney Glenn",
    phoneNumber: "0890719528",
    role: {
      id: 2,
      name: "Thu ngân",
      code: "CASHIER",
      deleted: false,
    },
    deleted: false,
  },
  {
    id: 45,
    username: "Garner123",
    fullname: "Garner Franklin",
    phoneNumber: "0503677080",
    role: {
      id: 3,
      name: "Đầu bếp",
      code: "CHEF",
      deleted: false,
    },
    deleted: false,
  },
];

export let ROLE_DATA = [
  {
    id: 1,
    name: "Quản trị viên",
    code: "ADMIN",
    deleted: false,
  },
  {
    id: 2,
    name: "Thu ngân",
    code: "CASHIER",
    deleted: false,
  },
  {
    id: 3,
    name: "Đầu bếp",
    code: "CHEF",
    deleted: false,
  },
  {
    id: 6,
    name: "Giữ xe",
    code: "CASHIER",
    deleted: false,
  },
];

export const getStaffById = (id) => STAFF_DATA.find((staff) => staff.id === id);

export const updateStaff = (data) => {
  STAFF_DATA = STAFF_DATA.map((staff) => (staff.id === data.id ? data : staff));
  return data;
};

export const deleteStaff = (id) => {
  STAFF_DATA = STAFF_DATA.map((staff) =>
    staff.id !== id ? staff : { ...staff, deleted: true }
  );
};

export const restoreStaff = (id) => {
  STAFF_DATA = STAFF_DATA.map((staff) =>
    staff.id !== id ? staff : { ...staff, deleted: false }
  );
};

export const addStaff = (data) => {
  STAFF_DATA.push(data);
};

export const getRoleById = (id) => ROLE_DATA.find((role) => role.id === id);

export const updateRole = (data) => {
  ROLE_DATA = ROLE_DATA.map((role) => (role.id === data.id ? data : role));
  return data;
};

export const deleteRole = (id) => {
  ROLE_DATA.map((role) => (role.id !== id ? role : { ...role, deleted: true }));
};

export const restoreRole = (id) => {
  ROLE_DATA.map((role) =>
    role.id !== id ? role : { ...role, deleted: false }
  );
};

export const addRole = (data) => {
  ROLE_DATA.push(data);
};
