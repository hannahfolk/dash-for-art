import UserActionTypes from "./user.types";

const INITIAL_STATE = {
  userAccount: null,
  JWTToken: null,
  error: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        userAccount: action.payload,
        error: null,
      };
    case UserActionTypes.SET_USER_JWT_TOKEN:
      return {
        ...state,
        JWTToken: action.payload,
        error: null,
      };
    case UserActionTypes.AUTHORIZED_FAILURE:
      return {
        ...state,
        userAccount: null,
        JWTToken: null,
        error: action.payload,
      };
    case UserActionTypes.ClEAR_USER_ERROR:
      return {
        ...state,
        error: null,
      };
    case UserActionTypes.UPDATE_USER_ACC_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UserActionTypes.CLEAR_ALL_USER_DETAILS:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default userReducer;
