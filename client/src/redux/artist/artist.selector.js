import { createSelector } from "reselect";

const selectArtist = (state) => state.artist;

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
 */

/**
 * @return {ArtistProfile}
 */
export const selectArtistProfile = createSelector(
  [selectArtist],
  (artist) => artist.artistProfile
);

/**
 * @return {Object<{status:Number, messages:Array}>}
 */
export const selectArtistError = createSelector(
  [selectArtist],
  (artist) => artist.error
);

/**
 * @returns {String}
 */
export const selectArtistSuccessAlert = createSelector(
  [selectArtist],
  (artist) => artist.artistSuccessAlert
);

/**
 * @return {String}
 */
export const selectArtistErrorAlert = createSelector(
  [selectArtist],
  (artist) => artist.artistErrorAlert
);
