import  axiosRequest from "./axiosRequest.js";
const { SHOP, ACCESS_TOKEN } = process.env;

/**
 * Post request to shopify
 *
 * @param   {String}  query     The request object for shopify
 * @param   {Object}  variables variables to pass into the query params
 * @param   {Number}  delay     Amount of time in milliseconds before resolving
 * @returns {Promise}           Promise object represents the post body
 */

const buildAxiosQuery = (query, variables, delay) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        url: `https://${SHOP}.myshopify.com/admin/api/2020-04/graphql.json`,
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ACCESS_TOKEN
        },
        method: "POST",
        data: {
          query: query,
          variables: variables
        }
      };
      const {
        data,
        extensions: { cost }
      } = await axiosRequest(options, delay);
      
      const {
        throttleStatus: { currentlyAvailable }
      } = cost;
      
      if (currentlyAvailable < 1000) {
        setTimeout(() => {
          resolve(data);
        }, 2000);
      } else {
        resolve(data);
      }

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = buildAxiosQuery;
