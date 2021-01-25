import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/user.reducer";
import artistReducer from "./artist/artist.reducer";
import submissionsReducer from "./submissions/submissions.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "artist", "submissions"],
};

const rootReducer = combineReducers({
  user: userReducer,
  artist: artistReducer,
  submissions: submissionsReducer,
});

export default persistReducer(persistConfig, rootReducer);
