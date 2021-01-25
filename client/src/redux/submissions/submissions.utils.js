
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
  */

/**
 * Create a single blob of image
 * @param {String} previewArt Preview art image from database
 * @param {String} token      JWT token to authenticate user
 */
export const createSingleBlob = async (previewArt, token) => {
  return fetch(previewArt, { headers: { Authorization: `JWT ${token}` } })
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};

/**
 * When user is signed in and no submission data is available
 * @param {SubmissionDetails} submissionsDetailsArr Preview art image from database
 * @param {String}            token                 JWT token to authenticate user
 */
export const createAllBlobs = async (submissionsDetailsArr, token) => {
  const submissionsPromiseArray = await submissionsDetailsArr.map(
    async (submission) => {
      const { previewArt, ...otherDetails } = submission;
      const imageSrc = await createSingleBlob(previewArt, token);
      return {
        ...otherDetails,
        imageSrc,
        previewArt,
      };
    }
  );

  const submissionsWithBlob = await Promise.all(submissionsPromiseArray);
  return submissionsWithBlob;
};


/**
 * Comparing redux submissions with database submissions, only creating new blobs
 * @param {SubmissionDetails} submissionsDetailsArr Preview art image from database
 * @param {String}            token                 JWT token to authenticate user
 */
export const createOnlyNewBlobs = async (
  currentSubmission,
  newSubmissions,
  token
) => {
  let i = 0;
  const updatedSubmissions = await newSubmissions.map(async (sub) => {
    if (sub.id !== currentSubmission[i].id) {
      const imageSrc = await createSingleBlob(sub.previewArt, token);
      return {
        ...sub,
        imageSrc,
      };
    } else {
      return {
        ...currentSubmission[i++],
        status: sub.status,
      };
    }
  });
  const submissionsWithBlob = await Promise.all(updatedSubmissions);
  return submissionsWithBlob;
};
