import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import * as serviceWorker from "./serviceWorker";

import App from "./components/App";
import reducers from "./reducers";
import axios from "axios";

const initialState = {};
const middleware = [thunk];

let store;

const ReactReduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

if (window.navigator.userAgent.includes("Chrome") && ReactReduxDevTools) {
  store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(...middleware), ReactReduxDevTools)
  );
} else {
  store = createStore(
    reducers,
    initialState,
    compose(applyMiddleware(...middleware))
  );
}

// TODO: remove after finish setup security
axios.defaults.headers.common["Authorization"] =
  "Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJzdGFmZklkIjoiMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MTkwNTgxNTIsImV4cCI6MTYxOTg4ODQwMH0.Ve_KdMw5E0kouRL5nhqqffP3k7yiqiB282J3rP9gFvm4WwBLn8Kb-UwWVglk1rgNVDdSh-gV08JTjpc6D-dUAA";

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
