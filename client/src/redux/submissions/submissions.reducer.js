import SubmissionActionTypes from "./submissions.types";

const INITIAL_STATE = {
  allSubmissions: [],
  submissionSuccessAlert: "",
  submissionErrorAlert: "",
  error: null,
};

const submissionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SubmissionActionTypes.CLEAR_ALL_SUBMISSIONS_DETAILS:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    case SubmissionActionTypes.SUBMISSION_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case SubmissionActionTypes.SUBMISSION_ADD:
      return {
        ...state,
        allSubmissions: [action.payload, ...state.submissions],
      };
    case SubmissionActionTypes.SUBMISSIONS_SUCCESS_ALERT:
      return {
        ...state,
        submissionSuccessAlert: action.payload,
      };
    case SubmissionActionTypes.SUBMISSIONS_SUCCESS_ALERT_CLEAR:
      return {
        ...state,
        submissionSuccessAlert: "",
      };
    case SubmissionActionTypes.SUBMISSIONS_ERROR_ALERT:
      return {
        ...state,
        submissionErrorAlert: action.payload,
      };
    case SubmissionActionTypes.SUBMISSIONS_ERROR_ALERT_CLEAR:
      return {
        ...state,
        submissionErrorAlert: "",
      };
    case SubmissionActionTypes.SUBMISSIONS_CREATE_BLOB_SUCCESS:
    case SubmissionActionTypes.SUBMISSIONS_GET_ALL_SUCCESS:
      return {
        ...state,
        error: null,
        allSubmissions: [...action.payload],
      };
    case SubmissionActionTypes.SUBMISSIONS_GET_ALL_FAILURE:
      return {
        ...state,
        error: action.payload,
        allSubmissions: [],
      };
    default:
      return state;
  }
};

export default submissionReducer;
