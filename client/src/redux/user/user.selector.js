import { createSelector } from "reselect";

const selectUser = (state) => state.user;

export const selectUserAccount = createSelector(
  [selectUser],
  (user) => user.userAccount
);

export const selectUserJWTToken = createSelector(
  [selectUser],
  (user) => user.JWTToken
);

export const selectUserError = createSelector(
  [selectUser],
  (user) => user.error
);
