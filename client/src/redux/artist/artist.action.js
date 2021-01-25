import ArtistActionTypes from "./artist.types";

/**
 * Complete Artist Profile
 * @typedef {{
 *    artistName:String,
 *    firstName:String,
 *    lastName:String,
 *    contactEmail:String,
 *    paypalEmail:String,
 *    phoneNumber:String,
 *    social_facebook:String,
 *    social_instagram:String,
 *    social_twitter:String,
 *    isInternational:Boolean,
 *  }} ArtistProfile
 *
 * DOM file input structure
 * @typedef {{
 *    lastModified:Number,
 *    lastModifiedDate:Date
 *    name:String,
 *    size:Number,
 *    type:String,
 * }} InputFile
 *
 * Error message parsed by saga sent to reducer
 * @typedef {{
 *  status?:Number,
 *  messages:Sting[],
 *}} ErrorMsg
 *
 */

/**
 * @param {ArtistProfile} artistProfile Detailed user account information
 */
export const setArtistProfile = (artistProfile) => ({
  type: ArtistActionTypes.SET_ARTIST_PROFILE,
  payload: artistProfile,
});

export const clearAllArtistDetails = () => ({
  type: ArtistActionTypes.CLEAR_ALL_ARTIST_DETAILS,
});

export const getArtistProfileStart = () => ({
  type: ArtistActionTypes.GET_ARTIST_PROFILE_START,
});

export const getArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.GET_ARTIST_PROFILE_SUCCESS,
  payload: artistProfile,
});

/**
 * @param {ArtistProfile} reqBody Request body object containing artist profile
 */
export const createArtistProfileStart = (reqBody) => ({
  type: ArtistActionTypes.CREATE_ARTIST_PROFILE_START,
  payload: reqBody,
});

export const createArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.CREATE_ARTIST_PROFILE_SUCCESS,
  payload: artistProfile,
});

export const updateArtistProfileStart = (reqBody) => ({
  type: ArtistActionTypes.UPDATE_ARTIST_PROFILE_START,
  payload: reqBody,
});

export const updateArtistProfileSuccess = (artistProfile) => ({
  type: ArtistActionTypes.UPDATE_ARTIST_PROFILE_SUCCESS,
  payload: artistProfile,
});

/**
 * @param {Number}   [status]   HTTP error status
 * @param {String[]} messages Error message in an array
 */
export const artistProfileFailure = ({ status, messages }) => ({
  type: ArtistActionTypes.ARTIST_PROFILE_FAILURE,
  payload: { status, messages },
});

export const clearArtistErrors = () => ({
  type: ArtistActionTypes.CLEAR_ARTIST_ERROR,
});

/**
 * @param {String} successMsg
 */
export const artistSuccessAlert = (successMsg) => ({
  type: ArtistActionTypes.ARTIST_SUCCESS_ALERT,
  payload: successMsg,
});

export const artistSuccessAlertClear = () => ({
  type: ArtistActionTypes.ARTIST_ERROR_ALERT_CLEAR,
});

/**
 * @param {String} failureMsg
 */
export const artistErrorAlert = (failureMsg) => ({
  type: ArtistActionTypes.ARTIST_ERROR_ALERT,
  payload: failureMsg,
});

export const artistErrorAlertClear = () => ({
  type: ArtistActionTypes.ARTIST_ERROR_ALERT_CLEAR,
});
