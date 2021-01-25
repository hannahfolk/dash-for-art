import { all, call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import ArtistActionTypes from "./artist.types";

import {
  setArtistProfile,
  artistProfileFailure,
  createArtistProfileSuccess,
  getArtistProfileSuccess,
  updateArtistProfileSuccess,
} from "./artist.action";
import { selectUserJWTToken } from "../user/user.selector";
import { setUserJWTToken } from "../user/user.action";

export function* setArtistProfileWithDetails({ payload: { artistProfile } }) {
  yield put(setArtistProfile(artistProfile));
}

export function* createArtistProfile({ payload: { reqBody } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { artistProfile, token: newToken },
    } = yield axios.post("/api/artist/profile", reqBody, {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(createArtistProfileSuccess({ artistProfile }));
    yield put(setUserJWTToken(newToken));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artistProfileFailure({ status, messages: [message] }));
  }
}

export function* getArtistProfile() {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { artistProfile },
    } = yield axios.get("/api/artist/profile", {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(getArtistProfileSuccess({ artistProfile }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artistProfileFailure({ status, messages: [message] }));
  }
}

export function* updateArtistProfile({ payload: { reqBody } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { artistProfile },
    } = yield axios.put("/api/artist/profile", reqBody, {
      headers: { Authorization: `JWT ${token}` },
    });
    yield put(updateArtistProfileSuccess({ artistProfile }));
  } catch (error) {
    const { status, message } = error.response.data;
    yield put(artistProfileFailure({ status, messages: [message] }));
  }
}

export function* onCreateProfileStart() {
  yield takeLatest(
    ArtistActionTypes.CREATE_ARTIST_PROFILE_START,
    createArtistProfile
  );
}

export function* onCreateProfileSuccess() {
  yield takeLatest(
    ArtistActionTypes.CREATE_ARTIST_PROFILE_SUCCESS,
    setArtistProfileWithDetails
  );
}

export function* onGetArtistProfileStart() {
  yield takeLatest(
    ArtistActionTypes.GET_ARTIST_PROFILE_START,
    getArtistProfile
  );
}

export function* onGetArtistProfileSuccess() {
  yield takeLatest(
    ArtistActionTypes.GET_ARTIST_PROFILE_SUCCESS,
    setArtistProfileWithDetails
  );
}

export function* onUpdateArtistProfileStart() {
  yield takeLatest(
    ArtistActionTypes.UPDATE_ARTIST_PROFILE_START,
    updateArtistProfile
  );
}

export function* onUpdateArtistProfileSuccess() {
  yield takeLatest(
    ArtistActionTypes.UPDATE_ARTIST_PROFILE_SUCCESS,
    setArtistProfileWithDetails
  );
}

export function* artistSaga() {
  yield all([
    call(onCreateProfileStart),
    call(onCreateProfileSuccess),
    call(onGetArtistProfileStart),
    call(onGetArtistProfileSuccess),
    call(onUpdateArtistProfileStart),
    call(onUpdateArtistProfileSuccess),
  ]);
}
