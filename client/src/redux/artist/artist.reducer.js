import ArtistActionTypes from "./artist.types";

const INITIAL_STATE = {
  artistProfile: null,
  artistSuccessAlert: "",
  artistErrorAlert: "",
  error: null,
};

const artistReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ArtistActionTypes.SET_ARTIST_PROFILE:
      return {
        ...state,
        artistProfile: action.payload,
        error: null,
      };
    case ArtistActionTypes.ARTIST_PROFILE_FAILURE:
    case ArtistActionTypes.ARTWORK_SUBMIT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case ArtistActionTypes.ARTIST_SUCCESS_ALERT:
      return {
        ...state,
        artistSuccessAlert: action.payload,
      };
    case ArtistActionTypes.ARTIST_SUCCESS_ALERT_CLEAR:
      return {
        ...state,
        artistSuccessAlert: "",
      };
    case ArtistActionTypes.ARTIST_ERROR_ALERT:
      return {
        ...state,
        artistErrorAlert: action.payload,
      };
    case ArtistActionTypes.ARTIST_ERROR_ALERT_CLEAR:
      return {
        ...state,
        artistErrorAlert: "",
      };
    case ArtistActionTypes.CLEAR_ARTIST_ERROR:
      return {
        ...state,
        error: null,
      };
    case ArtistActionTypes.CLEAR_ALL_ARTIST_DETAILS:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default artistReducer;
