import { logout } from "../api/accountApi";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_REFRESH = "LOGIN_REFRESH";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGIN_RETRY = "LOGIN_RETRY";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const logoutRequest = () => (dispatch) => {
  logout();
  dispatch({
    type: LOGOUT_SUCCESS,
  });
};

export const loginSuccess = (token) => (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: token,
  });
};

export const loginRefresh = () => (dispatch) => {
  dispatch({
    type: LOGIN_REFRESH,
  });
};

export const logoutUser = () => {
  console.log("logout");
};
