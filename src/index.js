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
  "Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJzdGFmZklkIjoiMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MTgxOTcwOTcsImV4cCI6MTYxOTAyNDQwMH0.-zJa0bntu7eZ8sOb9Sf99wrKtLHucnpXkUbfnNZ6bg97TkVl2j5hO2636OIDm6svF0J9Xe4_Mh7_Uwa1cLZPZw";

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
