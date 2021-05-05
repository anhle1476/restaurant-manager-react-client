import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import store from "./store";

import App from "./components/App";

// TODO: remove after finish setup security
// axios.defaults.headers.common["Authorization"] =
//   "Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJzdGFmZklkIjoiMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MTk4ODg0NzksImV4cCI6MTYyMDc1MjQwMH0.EQB6szK2J7cni0UIMXpyIE7Ck-PRZD_oSoq84U3NcnfR4oqUXHWnWWVtnjMdqjK5brf4beM2rvWptQWCSLykdg";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
