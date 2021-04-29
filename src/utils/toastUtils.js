import { toast } from "react-toastify";

const TOAST_CONFIG = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const TOAST_LEFT_CONFIG = {
  position: "bottom-left",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const TOAST_IMPORTANT_CONFIG = {
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
};

export const toastSuccess = (message) => {
  toast.success(message, TOAST_CONFIG);
};

export const toastError = (message) => {
  toast.error(message, TOAST_CONFIG);
};

export const toastInfo = (message) => {
  toast.info(message, TOAST_CONFIG);
};

export const toastWarning = (message) => {
  toast.warning(message, TOAST_CONFIG);
};

export const toastSuccessLeft = (message) => {
  toast.success(message, TOAST_LEFT_CONFIG);
};

export const toastErrorLeft = (message) => {
  toast.error(message, TOAST_LEFT_CONFIG);
};

export const toastInfoLeft = (message) => {
  toast.info(message, TOAST_LEFT_CONFIG);
};

export const toastWarningLeft = (message) => {
  toast.warning(message, TOAST_LEFT_CONFIG);
};

export const toastImportant = (message) => {
  toast.error(message, TOAST_IMPORTANT_CONFIG);
};
