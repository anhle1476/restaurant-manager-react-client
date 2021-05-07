import {
  LOGIN_SUCCESS,
  LOGIN_REFRESH,
  LOGIN_FAILURE,
  LOGIN_RETRY,
  LOGOUT_SUCCESS,
} from "../actions/user";
import jwt_decode from "jwt-decode";
import axios from "axios";
import store from "../store";
import { refresh, logout } from "../api/accountApi";

const INITIAL_STATE = {
  isAuthenticated: false,
  role: "",
  staffId: "",
  username: "",
  initApp: true,
  shouldRetry: false,
};

const setAxiosHeader = (token) => {
  axios.defaults.headers.common["Authorization"] = token;
};

const tryRefreshToken = async () => {
  try {
    const res = await refresh();
    store.dispatch({
      type: LOGIN_REFRESH,
      payload: res.data.token,
    });
  } catch (ex) {
    console.log("Làm mới đăng nhập thất bại");
    const status = ex.response?.status;
    const shouldRetry = status !== 400 && status !== 401;
    store.dispatch({
      type: shouldRetry ? LOGIN_RETRY : LOGIN_FAILURE,
    });
  }
};

const destroyToken = () => {
  delete axios.defaults.headers.common["Authorization"];
  return { ...INITIAL_STATE, initApp: false };
};

const processToken = (token) => {
  const tokenData = jwt_decode(token);
  setAxiosHeader(token);
  return {
    isAuthenticated: true,
    username: tokenData.username,
    role: tokenData.role,
    staffId: tokenData.staffId,
    initApp: false,
    shouldRetry: false,
  };
};

let refreshTimeout = null;

const clearCurrentTimeout = () => {
  if (refreshTimeout) clearTimeout(refreshTimeout);
};

const startNewRefreshTimeout = (seconds) => {
  clearCurrentTimeout();
  refreshTimeout = setTimeout(() => {
    tryRefreshToken();
  }, seconds * 1000);
};

tryRefreshToken();

export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case LOGIN_REFRESH:
      startNewRefreshTimeout(9 * 60);
      return processToken(action.payload);
    case LOGIN_RETRY:
      startNewRefreshTimeout(30);
      return {
        ...state,
        initApp: false,
        shouldRetry: true,
      };
    case LOGIN_FAILURE:
    case LOGOUT_SUCCESS:
      logout();
      clearCurrentTimeout();
      return destroyToken();
    default:
      return state;
  }
}
