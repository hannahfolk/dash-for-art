import { createSelector } from "reselect";

/**
 * The detailed information about the artwork
 * @typedef {{
 *   id:Number,
 *   artistName:String
 *   title:String,
 *   description:String,
 *   artFile:String,
 *   previewArt:String,
 *   status:String,
 * }} SubmissionDetails
 */

const selectSubmissions = (state) => state.submissions;

/**
 * @returns {SubmissionDetails[]}
 */
export const selectAllSubmissions = createSelector(
  [selectSubmissions],
  (submissions) => submissions.allSubmissions
);

/**
 * @return {String}
 */
export const selectSubmissionsSuccessAlert = createSelector(
  [selectSubmissions],
  (submissions) => submissions.submissionSuccessAlert
);

/**
 * @return {String}
 */
export const selectSubmissionsErrorAlert = createSelector(
  [selectSubmissions],
  (submissions) => submissions.submissionErrorAlert
);

/**
 * @return {Object<{status:Number, messages:Array}>}
 */
export const selectSubmissionsError = createSelector(
  [selectSubmissions],
  (submissions) => submissions.error
);
