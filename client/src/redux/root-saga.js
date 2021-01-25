import { all, call } from "redux-saga/effects";

import { userSaga } from "./user/user.sagas";
import { artistSaga } from "./artist/artist.sagas";
import { submissionsSaga } from "./submissions/submissions.sagas";

export default function* rootSaga() {
  yield all([call(userSaga), call(artistSaga), call(submissionsSaga)]);
}
