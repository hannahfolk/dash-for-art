import UserActionTypes from "./user.types";

/**
 * Pre Authenticated user, Only clients sends over.
 * @typedef {{ 
 *   contactEmail?:String,
 *   password?:String, 
 * }} ToAuthenticateUser
 * 
 * Only the server sends over
 * @typedef {{
 *   contactEmail:String,
 *   isAdmin:Boolean,
 * }} UserAccount
 *
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
 * Complete user profile with token
 * @typedef {{
 *   userAccount:UserAccount,
 *   artistProfile:ArtistProfile,
 *   token:String,
 * }} UserProfile
 *
 */


/**
 * @param {UserAccount} user
 */
export const setUserAccount = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});

/**
 * @param {String} JWTToken Signed jwt token
 */
export const setUserJWTToken = (JWTToken) => ({
  type: UserActionTypes.SET_USER_JWT_TOKEN,
  payload: JWTToken,
});

/**
 * @param {ToAuthenticateUser} contactEmailAndPassword
 */
export const signInStart = (contactEmailAndPassword) => ({
  type: UserActionTypes.SIGN_IN_START,
  payload: contactEmailAndPassword,
});

/**
 * @param {ToAuthenticateUser} contactEmailAndPassword
 */
export const signUpStart = (contactEmailAndPassword) => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: contactEmailAndPassword,
});

/**
 * Setting User Profile from scratch
 * @param {UserProfile} userProfile Whole user profile
 */
export const authorizedSuccess = (userProfile) => ({
  type: UserActionTypes.AUTHORIZED_SUCCESS,
  payload: userProfile,
});

export const authorizedFailure = (error) => ({
  type: UserActionTypes.AUTHORIZED_FAILURE,
  payload: error,
});

/** 
 * Password or email, or both can be sent to the server.
 * @param {Object} reqBody
 * @param {String} [reqBody.contactEmail] Contact email
 * @param {String} [reqBody.password]     Password
 */
export const updateUserStart = (reqBody) => ({
  type: UserActionTypes.UPDATE_USER_ACC_START,
  payload: reqBody,
});

/**
 * Both the userAccount and Artist Profile gets sent back
 * Contact Email lives in both tables. Sending it back to update
 *
 * @param {Object}        userProfile                Whole user profile
 * @param {String}        userProfile.token          JWTToken User changed credentials
 * @param {UserAccount}   userProfile.userAccount    Account information
 * @param {ArtistProfile} userProfile.artistProfile  Artist Profile information
 */
export const updateUserSuccess = (userProfile) => ({
  type: UserActionTypes.UPDATE_USER_ACC_SUCCESS,
  payload: userProfile,
});

/**
 * @param {Number}   [status]   HTTP error status
 * @param {String[]} messages Error message in an array
 */
export const updateUserFailure = ({ status, messages }) => ({
  type: UserActionTypes.UPDATE_USER_ACC_FAILURE,
  payload: { status, messages },
});

/**
 * @param {String} JWTToken Signed jwt token
 */
export const deleteUserStart = (JWTToken) => ({
  type: UserActionTypes.DELETE_USER_START,
  payload: JWTToken,
});

export const deleteUserSuccess = () => ({
  type: UserActionTypes.DELETE_USER_SUCCESS,
});

export const clearUserError = () => ({
  type: UserActionTypes.ClEAR_USER_ERROR,
});

export const logoutStart = () => ({
  type: UserActionTypes.LOGOUT_START,
});

export const clearAllUserDetails = () => ({
  type: UserActionTypes.CLEAR_ALL_USER_DETAILS,
});
