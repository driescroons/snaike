import * as constants from "../constants";

export const setStatistics = statistics => dispatch => dispatch({ type: constants.SET_STATISTICS, payload: statistics });

export const setStart = () => dispatch => dispatch({ type: constants.SET_START });

export const clear = () => dispatch => dispatch({ type: constants.CLEAR });
