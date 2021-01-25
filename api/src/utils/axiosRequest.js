import axios from "axios";

/**
 * Post request to shopify
 *
 * @param   {Object}  query Request body
 * @param   {Number}  delay Delay of request for rapid request
 * @returns {Promise}       Promise object represents the post body
 */

const postShopifyGraphQL = (query, delay = 500) => {
  return new Promise((resolve, reject) => {
    axios(query)
      .then(({ data }) => {
        if(data.errors) {
          reject(data);
        } 
        else {
          setTimeout(() => {
            resolve(data);
          }, delay);
        }
      }).catch(error => {
        reject(error)
      });
  });
};

export default postShopifyGraphQL;
