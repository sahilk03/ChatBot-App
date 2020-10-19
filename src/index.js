import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";

function rootReducer(state = {}, action) {
  switch (action.type) {
    case "currentTab":
      return {
        ...state,
        currentTab: action.res,
      };
    case "currentCode":
      return {
        ...state,
        currentCode: action.res,
      };
    default:
      return state;
  }
}

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
