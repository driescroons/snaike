import { fromJS } from "immutable";

import * as constants from "../constants";

const initialState = fromJS({
  generation: 0,
  longestSnake: 0,
  highscore: 0,
  start: Date.now()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.SET_STATISTICS:
      return state.withMutations(newState => {
        newState.set("generation", action.payload.generation);
        newState.set("longestSnake", action.payload.longestSnake);
        newState.set("highscore", action.payload.highscore);
      });
    case constants.SET_START:
      return state.withMutations(newState => {
        newState.set("start", Date.now());
      });
    case constants.CLEAR:
      return initialState;
    default:
      return state;
  }
};
