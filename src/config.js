const hostApi =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "https://superpig-restaurant.herokuapp.com";
const portApi = process.env.NODE_ENV === "development" ? 8080 : "";
const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}`;
