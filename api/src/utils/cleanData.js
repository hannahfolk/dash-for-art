/**
 * Clean title or vendor string to search in shopify
 *
 * @param  {String} str  Any string to be cleaned
 * @return {String}      The same string minus special characters
 */

export const cleanStringShopify = function (str) {
  let tempStr = str
    // Remove all special characters
    .replace(/\*\*/gi, "-")
    .replace(/!/gi, "")
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .replace(/'/g, "")
    .replace(/"/g, "")
    .replace(/\#/g, "")
    .replace(/\$/g, "")
    .replace(/\%/g, "")
    .replace(/\&/g, "")
    .replace(/\?/g, "")
    .replace(/\)/g, "")
    .replace(/\(/g, "")
    .replace(/\+/g, "")
    .replace(/\//g, "")
    .replace(/\,/g, "")
    .replace(/\~/g, "")
    .replace(/\{/g, "")
    .replace(/\}/g, "")
    .replace(/\|/g, "")
    .replace(/\}/g, "")
    .replace(/\\/g, "")
    .replace(/\:/g, "")
    .replace(/\*/g, "-")
    .replace(/\@/g, "-")
    // Remove all double spaces
    .replace(/\.\.\./g, "")
    .replace(/  /g, " ")
    // Replace some characters with dashes instead
    .replace(/ /g, "-")
    .replace(/\./g, "-")
    .replace(/\^/g, "-")

    // replace one or more hyphens with a single hyphen, globally
    .replace(/-+/g, "-")

    // replace all hyphens at beginning and end of string.
    .replace(/^-+|-+$/g, "")

    .toLowerCase();

  return tempStr;
};

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
    .replace(/[&\/\\#,+()$~%'":*?<>{}]/g, "")
    .replace(/ /g, "_")
    .toLowerCase();
};

/**
 * @description  Return clean id from shopify's GID
 * @param  {String} gid Input string
 * @return {Number} ID
 * @example
 * cleanIDGraphql("gid://shopify/Order/2201702137922")
 * // 2201702137922
 */
export const cleanIDGraphql = (gid) => {
  const splitString = gid.split("/");
  return parseInt(splitString[splitString.length - 1], 10);
};

/**
 * @description Clean shopify date for database and shift time zone for east coast
 * @param  {String} shopifyDate Input string
 * @return {String} Valid date data type for MariaDb
 * @example
 * cleanDateAndTime("2020-05-13T05:08:59Z")
 * // 2020-5-13 00:10:02
 */
export const cleanDateAndTime = (shopifyDate) => {
  const newYorkTime = new Date(shopifyDate).toLocaleString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const [date, time] = newYorkTime.split(", ");
  const [month, day, year] = date.split("/");
  const mariaDBDate = [year, month, day].join("-");
  return [mariaDBDate, time].join(" ");
};

/**
 * @description East coast date for graphql
 * @param  {String} [input] Input date string
 * @return {String} The current date
 * @example
 * cleanDate("2020-05-20T22:39:33.858Z");
 * // 2020-05-20
 * cleanDate();
 * // 2020-5-13
 */
export const cleanDate = (input) => {
  const dateInput = input ? new Date(input) : new Date();
  const newYorkTime = dateInput.toLocaleString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const [date, time] = newYorkTime.split(", ");
  const [month, day, year] = date.split("/");
  return [year, month, day].join("-");
};

/**
 * @description Get Yesterday date
 * @param  {String} [input] Input date string
 * @return {String} The current date
 * @example
 * cleanDatePerviousDay("2020-05-18T16:01:33.618Z")
 * // 2020-5-17
 */
export const cleanDatePerviousDay = (input) => {
  const dateInput = input ? new Date(input) : new Date();
  dateInput.setDate(dateInput.getDate() - 1);
  const newYorkTime = dateInput.toLocaleString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const [date, time] = newYorkTime.split(", ");
  const [month, day, year] = date.split("/");
  return [year, month, day].join("-");
};

/**
 * @description The the start and end of the hours
 * @param  {String} [input] Input date string
 * @return {{ startDate:String, endDate:String, startHour:String, endHour:string }} The date starting and ending time
 * @example
 * //
 * // 2020-05-22T00:51:53.701Z
 * // '5/21/2020, 9:51:53' - New York time
 * startAndEndTime(); 
 * // {
 * //   startDate: '2020-5-21',
 * //   endDate: '2020-5-21',
 * //   startHour: '19',
 * //   endHour: '20'
 * // }
 * //
 * // 2020-05-22T04:51:06.954Z
 * // '5/21/2020, 9:51:53' - New York time
 * startAndEndTime(); 
 * // {
 * //   startDate: '2020-5-21',
 * //   startHour: '23',
 * //   endDate: '2020-5-22',
 * //   endHour: '00'
 * // }
 */
export const startAndEndTime = (input) => {
  const dateInput = input ? new Date(input) : new Date();
  const endTime = dateInput.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const [endHour] = endTime.split(":");
  const endDate = dateInput.toLocaleDateString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });

  dateInput.setHours(dateInput.getHours() - 1);

  const startTime = dateInput.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const [startHour] = startTime.split(":");
  const startDate = dateInput.toLocaleDateString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });

  return {
    startDate: cleanDate(startDate),
    endDate: cleanDate(endDate),
    startHour,
    endHour,
  };
};
