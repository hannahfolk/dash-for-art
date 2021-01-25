/***
 * Date references to
 * Notes on dates
 *
 */

let date = new Date("2020-05-13T05:08:59Z");

// request a weekday along with a long date
let options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  timeZone: "America/New_York",
};

// console.log(date.toLocaleString('de-DE', options));
// → "Donnerstag, 20. Dezember 2012"

// an application may want to use UTC and make that visible
// options.timeZone = 'UTC';
// options.timeZoneName = 'short';

// console.log(date.toLocaleString("en-US", options));
// → "Thursday, December 20, 2012, GMT"

// sometimes even the US needs 24-hour time
console.log(
  date.toLocaleString("en-US", { hour12: false, timeZone: "America/New_York" })
);
// → "12/19/2012, 19:00:00"

const cleanDateAndTime = (shopifyDate) => {
  const newYorkTime = new Date(shopifyDate).toLocaleString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const [date, time] = newYorkTime.split(", ");
  const [month, day, year] = date.split("/");
  const mariaDBDate = [year, month, day].join("-");
  return [mariaDBDate, time].join(" ");
};

const cleanDatePerviousDay = (dateInput) => {
  const dateNow = new Date(dateInput);
  dateNow.setDate(dateNow.getDate() - 1);
  const newYorkTime = dateNow.toLocaleString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const [date, time] = newYorkTime.split(", ");
  const [month, day, year] = date.split("/");
  return [year, month, day].join("-");
};

// console.log(cleanDatePerviousDay(new Date()));

// const now = new Date();
// console.log(now.toLocaleString("en-US", { hour12: false, timeZone: "America/New_York" }) );
// console.log("=====Subtract====");
// now.setHours(now.getHours() - 1);
// console.log(now);
// console.log(now.toLocaleTimeString("en-US", { hour12: false, timeZone: "America/New_York" }) );

const startAndEndTime = (input) => {
  const dateInput = input ? new Date(input) : new Date();
  const endTime = dateInput.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const endDate = dateInput.toLocaleDateString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });

  const [endHour] = endTime.split(":");

  dateInput.setHours(dateInput.getHours() - 1);

  const startTime = dateInput.toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });
  const startDate = dateInput.toLocaleDateString("en-US", {
    hour12: false,
    timeZone: "America/New_York",
  });

  const [startHour] = startTime.split(":");

  return {
    startDate,
    endDate,
    startHour,
    endHour,
  };
};

console.log(startAndEndTime("2020-05-22T05:37:22.509Z"));
