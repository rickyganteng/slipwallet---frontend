import { combineReducers } from "redux";

import auth from "./auth";
import counter from "./counter";
import user from "./user";

export default combineReducers({
  counter,
  user,
  auth,
});
