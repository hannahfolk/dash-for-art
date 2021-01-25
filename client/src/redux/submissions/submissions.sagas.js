import { all, call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import SubmissionActionTypes from "./submissions.types";

import { selectAllSubmissions } from "./submissions.selector";
import {
  submissionSuccess,
  // submissionAdd,
  submissionFailed,
  submissionErrorAlert,
  submissionSuccessAlert,
  submissionsGetAllSuccess,
  submissionsGetAllFailure,
  // submissionsCreateBlobStart,
  submissionsCreateBlobSuccess,
} from "./submissions.action";
import { selectUserJWTToken } from "../user/user.selector";
import { createOnlyNewBlobs, createAllBlobs } from "./submissions.utils";

export function* submissionCreateStart({ payload: { formData } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { submissionDetails },
    } = yield axios.post("/api/artist/submit-artwork", formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `JWT ${token}`,
      },
    });
    yield put(submissionSuccess({ submissionDetails }));
  } catch ({ response }) {
    const { status, data } = response;
    const { message } = data;
    yield put(submissionFailed({ status, message }));
    yield put(submissionErrorAlert(message));
  }
}

export function* submissionEditStart({ payload: { formData } }) {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { submissionDetails },
    } = yield axios.put(`/api/artist/submissions/edit/${formData.get("id")}`, formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `JWT ${token}`,
      },
    });
    yield put(submissionSuccess({ submissionDetails }));
  } catch ({ response }) {
    const { status, data } = response;
    const { message } = data;
    yield put(submissionFailed({ status, message }));
    yield put(submissionErrorAlert(message));
  }

}

// start and stop spinners
export function* submissionComplete({ payload: { submissionDetails } }) {
  // yield put(submissionAdd(submissionDetails));
  yield put(
    submissionSuccessAlert("YAY your master piece has been added. Thank you!")
  );
}

export function* getAllSubmissions() {
  try {
    const token = yield select(selectUserJWTToken);
    const {
      data: { submissionsDetailsArr },
    } = yield axios.get("/api/artist/submissions", {
      headers: { Authorization: `JWT ${token}` },
    });

    yield put(submissionsGetAllSuccess(submissionsDetailsArr));
    // yield put(submissionsCreateBlobStart({ submissionsDetailsArr }));
  } catch ({ response }) {
    const { status, data } = response;
    const { message } = data;
    yield put(submissionsGetAllFailure({ status, message }));
  }
}

/**
 * Attempted to create blobs and storing them in redux
 * However when the blobs are called later the images are undefined.
 */
export function* createBlobStart({ payload: { submissionsDetailsArr } }) {
  const currentSubmissions = yield select(selectAllSubmissions);
  const token = yield select(selectUserJWTToken);

  let submissionsWithBlobs = null;
  if (!currentSubmissions) {
    submissionsWithBlobs = yield createAllBlobs(submissionsDetailsArr, token);
  } else {
    submissionsWithBlobs = yield createOnlyNewBlobs(
      currentSubmissions,
      submissionsDetailsArr,
      token
    );
  }

  yield put(submissionsCreateBlobSuccess(submissionsWithBlobs));
}

export function* onSubmissionsCreateStart() {
  yield takeLatest(SubmissionActionTypes.SUBMISSION_CREATE_START, submissionCreateStart);
}

export function* onSubmissionEditStart() {
  yield takeLatest(SubmissionActionTypes.SUBMISSIONS_EDIT_START, submissionEditStart)
}

export function* onSubmissionsSuccess() {
  yield takeLatest(
    SubmissionActionTypes.SUBMISSION_SUCCESS,
    submissionComplete
  );
}

export function* onSubmissionsGetAllStart() {
  yield takeLatest(
    SubmissionActionTypes.SUBMISSIONS_GET_ALL_START,
    getAllSubmissions
  );
}

export function* onSubmissionsCreateBlobStart() {
  yield takeLatest(
    SubmissionActionTypes.SUBMISSIONS_CREATE_BLOB_START,
    createBlobStart
  );
}

export function* submissionsSaga() {
  yield all([
    call(onSubmissionsCreateStart),
    call(onSubmissionEditStart),
    call(onSubmissionsSuccess),
    call(onSubmissionsGetAllStart),
    call(onSubmissionsCreateBlobStart),
  ]);
}
