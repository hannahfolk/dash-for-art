import { all, call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import UserActionTypes from "./user.types";

import { selectUserJWTToken } from "./user.selector";
import {
  authorizedSuccess,
  authorizedFailure,
  setUserAccount,
  setUserJWTToken,
  clearAllUserDetails,
  updateUserFailure,
  updateUserSuccess,
} from "./user.action";
import {
  setArtistProfile,
  clearAllArtistDetails,
} from "../artist/artist.action";
import { clearAllSubmissionsDetails } from "../submissions/submissions.action";

export function* unAuthorizedError(response) {
  response.data = {
    status: 401,
    message: "Something went wrong please check back later.",
  };
  yield put(authorizedFailure(response));
  yield put(clearAllUserDetails());
}

export function* signIn({ payload: { contactEmail, password } }) {
  try {
    // const { token, currentUser } = data;
    const { data } = yield axios.post("/api/user/signin", {
      contactEmail,
      password,
    });
    yield put(authorizedSuccess(data));
  } catch (error) {
    yield put(authorizedFailure(error.response));
  }
}

export function* signUp({ payload: { contactEmail, password } }) {
  try {
    const { data } = yield axios.post("/api/user/register", {
      contactEmail,
      password,
    });
    yield put(authorizedSuccess(data));
  } catch (error) {
    yield put(authorizedFailure(error.response));
  }
}

export function* setUserAccountAfterAuth({
  payload: { token, artistProfile, userAccount },
}) {
  yield put(setUserAccount(userAccount));
  yield put(setArtistProfile(artistProfile));
  yield put(setUserJWTToken(token));
}

export function* updateUserAccount({ payload: { reqBody } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { userAccount, artistProfile, token: newToken },
    } = yield axios.put("/api/user/account", reqBody, {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(
      updateUserSuccess({ userAccount, artistProfile, token: newToken })
    );
  } catch (error) {
    yield put(updateUserFailure(error.response));
  }
}

export function* deleteUser() {
  try {
    const token = yield select(selectUserJWTToken);
    yield axios.delete("/api/user/account", {
      headers: { Authorization: `JWT ${token}` },
    });
  } catch (error) {
    const { status } = error.response;
    if (status === 401) {
      yield unAuthorizedError(error.response);
    } else {
      yield put(authorizedFailure(error.response));
    }
  }
  yield put(clearAllUserDetails());
}

export function* logout() {
  yield put(clearAllUserDetails());
  yield put(clearAllArtistDetails());
  yield put(clearAllSubmissionsDetails());
}

export function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onAuthorizedSuccess() {
  yield takeLatest(UserActionTypes.AUTHORIZED_SUCCESS, setUserAccountAfterAuth);
}

export function* onUpdateUserStart() {
  yield takeLatest(UserActionTypes.UPDATE_USER_ACC_START, updateUserAccount);
}

export function* onUpdateUserSuccess() {
  yield takeLatest(
    UserActionTypes.UPDATE_USER_ACC_SUCCESS,
    setUserAccountAfterAuth
  );
}

export function* onDeleteUserStart() {
  yield takeLatest(UserActionTypes.DELETE_USER_START, deleteUser);
}

export function* onLogoutStart() {
  yield takeLatest(UserActionTypes.LOGOUT_START, logout);
}

export function* userSaga() {
  yield all([
    call(onSignInStart),
    call(onSignUpStart),
    call(onAuthorizedSuccess),
    call(onUpdateUserStart),
    call(onUpdateUserSuccess),
    call(onDeleteUserStart),
    call(onLogoutStart),
  ]);
}
