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
