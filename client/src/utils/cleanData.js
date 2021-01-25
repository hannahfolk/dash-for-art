/**
 * @description Remove some special characters, replace space to underscore and make everything lowercase
 * @param  {String} str Input string
 * @return {String} Cleaned up string
 * @example
 * cleanArtistFileName("Screen Shot 2019-11-08.png")
 * // screen_shot_2019-11-08.png
 */
export const cleanFileName = (str) => {
  return str
    .replace(/[&/\\#,+()$~%'":*?<>{}]/g, "")
    .replace(/ /g, "_")
    .toLowerCase();
};

/**
 * @description Convert Mariadb time into English readable time
 * @param  {String} str Time from mariadb
 * @return {String} Cleaned up string
 * @example
 * convertTime("2020-05-01T00:07:20.000Z")
 * // '5/1/2020, 12:07:00 AM'
 */

export const convertTime = (time) => {
  const spiltTime = time.split(":");
  spiltTime.pop();
  const timeString = spiltTime.join(":");
  const americaTime = new Date(timeString).toLocaleString("en-US");
  return americaTime;
}

/**
 * @description Convert Mariadb time into English readable time
 * @param  {String} str Time from mariadb
 * @return {String} Cleaned up string
 * @example
 * convertTime("2020-05-01T00:07:20.000Z")
 * // '5/1/2020,'
 */

export const justDate = (time) => {
  const spiltTime = time.split(":");
  spiltTime.pop();
  const timeString = spiltTime.join(":");
  const americaTime = new Date(timeString).toLocaleDateString("en-US");
  return americaTime;
}
