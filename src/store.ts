import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import statistics from "./reducers/statistics";

const store = createStore(
  combineReducers({
    statistics
  }),
  applyMiddleware(thunk)
);

export default store;
