import { combineReducers } from "redux";
import userReducer from "./userReducer";
import tradeReducer from "./tradeReducer";

const rootReducer = combineReducers({
  user: userReducer,
  trade: tradeReducer,
  // add more reducers here
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
