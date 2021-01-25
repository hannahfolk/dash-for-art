import buildAxiosQuery from "../utils/buildAxiosQuery";

/**
 * @summary  Get all orders from shopify to upload onto database 1 time
 * @param   {String} cursor     Shopify's graphQLs cursor
 * @param   {String} startDate  Date: 2020-05-13
 * @param   {String} startHour  Start of the hour
 * @param   {String} endDate    End of the hour
 * @param   {String} endHour    End of the hour
 * @returns {Promise<>}
 */

const getOrdersFromShopify = (
  cursor = "",
  startDate,
  startHour,
  endDate,
  endHour
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `
        query ordersFulfilled($first: Int!, $query: String, $cursor: String) {
          orders(first: $first, query: $query, after: $cursor) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                createdAt
                name
                tags
                lineItems(first: 30) {
                  edges {
                    node {
                      title
                      sku
                      vendor
                      quantity
                      product {
                        productType
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        first: 5,
      };

      if (cursor) {
        variables.cursor = cursor;
      } else {
        variables.query = `created_at:>='${startDate}T${startHour}:00:00-04:00' AND created_at:<='${endDate}T${endHour}:00:00-04:00'`;
      }

      const response = await buildAxiosQuery(query, variables);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export default getOrdersFromShopify;
