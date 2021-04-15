import { confirm } from "react-confirm-box";

const confirmOptions = {
  labels: {
    confirmable: "Confirm",
    cancellable: "Cancel",
  },
};

export const doConfirm = (message) => confirm(message, confirmOptions);
