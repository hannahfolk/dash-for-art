import SubmissionActionTypes from "./submissions.types";

/**
 * The detailed information about the artwork
 * @typedef {{
 *   artistName:String
 *   title:String,
 *   description:String,
 *   artFile:String,
 *   previewArt:String,
 *   status:String,
 * }} SubmissionDetails
 *
 * Error response, Status is https status code
 * @typedef {{
 *   status:Number,
 *   messages:String,
 * }} ErrorMsg
 *
 */

export const clearAllSubmissionsDetails = () => ({
  type: SubmissionActionTypes.CLEAR_ALL_SUBMISSIONS_DETAILS,
});

/**
 * @param {SubmissionDetails[]} submissionsDetailsArr
 */
export const setAllSubmissionsDetails = (submissionsDetailsArr) => ({
  type: SubmissionActionTypes.SET_ALL_SUBMISSION_DETAILS,
  payload: submissionsDetailsArr,
});

/**
 * @param {FormData}  formData             form data object.
 * @param {String}    formData.artistName  Artist Name associated to the artwork
 * @param {String }   formData.title       Title of the art piece
 * @param {String}    formData.description Art work description
 * @param {InputFile} formData.previewArt  The preview artwork in jpg or png
 * @param {InputFile} formData.artFile     The psd file of the artwork
 */
export const submissionCreateStart = (formData) => ({
  type: SubmissionActionTypes.SUBMISSION_CREATE_START,
  payload: formData,
});

/**
 * @param {FormData}  formData             form data object.
 * @param {String}    formData.id          Id of the submission to edit
 * @param {String}    formData.artistName  Artist Name associated to the artwork
 * @param {String }   formData.title       Title of the art piece
 * @param {String}    formData.description Art work description
 * @param {InputFile} formData.previewArt  The preview artwork in jpg or png
 * @param {InputFile} formData.artFile     The psd file of the artwork
 */
export const submissionsEditStart = (formData) => ({
  type: SubmissionActionTypes.SUBMISSIONS_EDIT_START,
  payload: formData,
});

/**
 * @param {SubmissionDetails} submissionDetails
 */
export const submissionSuccess = (submissionDetails) => ({
  type: SubmissionActionTypes.SUBMISSION_SUCCESS,
  payload: submissionDetails,
});

/**
 * Add submissions into submissions array.
 * @param {SubmissionDetails} submissionDetails
 */
export const submissionAdd = (submissionDetails) => ({
  type: SubmissionActionTypes.SUBMISSION_ADD,
  payload: submissionDetails,
});

/**
 * @param {ErrorMsg} error
 */
export const submissionFailed = (error) => ({
  type: SubmissionActionTypes.SUBMISSION_FAILURE,
  payload: error,
});

/**
 * @param {String} successMsg
 */
export const submissionSuccessAlert = (successMsg) => ({
  type: SubmissionActionTypes.SUBMISSIONS_SUCCESS_ALERT,
  payload: successMsg,
});

export const submissionSuccessAlertClear = () => ({
  type: SubmissionActionTypes.SUBMISSIONS_SUCCESS_ALERT_CLEAR,
});

/**
 * @param {String} failureMsg
 */
export const submissionErrorAlert = (failureMsg) => ({
  type: SubmissionActionTypes.SUBMISSIONS_ERROR_ALERT,
  payload: failureMsg,
});

export const submissionErrorAlertClear = () => ({
  type: SubmissionActionTypes.SUBMISSIONS_ERROR_ALERT_CLEAR,
});

export const submissionsGetAllStart = () => ({
  type: SubmissionActionTypes.SUBMISSIONS_GET_ALL_START,
});

/**
 * @param {SubmissionDetails[]} submissionsDetailsArr
 */
export const submissionsGetAllSuccess = (submissionsDetailsArr) => ({
  type: SubmissionActionTypes.SUBMISSIONS_GET_ALL_SUCCESS,
  payload: submissionsDetailsArr,
});

/**
 * @param {ErrorMsg} error
 */
export const submissionsGetAllFailure = (error) => ({
  type: SubmissionActionTypes.SUBMISSIONS_GET_ALL_FAILURE,
  payload: error,
});

/**
 * @param {SubmissionDetails[]} submissionsDetailsArr
 */
export const submissionsCreateBlobStart = (submissionsDetailsArr) => ({
  type: SubmissionActionTypes.SUBMISSIONS_CREATE_BLOB_START,
  payload: submissionsDetailsArr,
});

/**
 * @param {SubmissionDetails[]} submissionsDetailsArr
 */
export const submissionsCreateBlobSuccess = (submissionsDetailsArr) => ({
  type: SubmissionActionTypes.SUBMISSIONS_CREATE_BLOB_SUCCESS,
  payload: submissionsDetailsArr,
});
