import axios from "axios";
import Swal from "sweetalert2";
import { justDate } from "./cleanData";

export const fetchComForTable = async (
  reqBody,
  token,
  category,
  checkedExcludeTags
) => {
  const request = {
    ...reqBody,
    headers: { Authorization: `JWT ${token}` },
  };

  try {
    const {
      data: { commissionsDetailsArr },
    } = await axios(request);

    const tags = await getTags(token);

    if (commissionsDetailsArr.length > 0 && checkedExcludeTags) {
      commissionsDetailsArr.forEach((commission) => {
        if (commission.tags === null || commission.tags === "[]") {
          commission.tags = "";
        }
      });

      const filteredCommissionsDetailsArr = commissionsDetailsArr.filter(
        (commission) => !tags.some((tag) => commission.tags.includes(tag))
      );

      let convertDetailsForAdmin = [];
      convertDetailsForAdmin = filteredCommissionsDetailsArr.map((details) => {
        if (category === "summary") {
          const {
            order_created_at,
            commissions_amount,
            is_commissions_paid,
            ...otherProperty
          } = details;
          return {
            ...otherProperty,
            order_created_at: justDate(order_created_at),
            commissions_amount: parseFloat(commissions_amount).toFixed(2),
            is_commissions_paid: is_commissions_paid ? "Paid" : "Unpaid",
          };
        } else {
          const { paidAmount, unpaidAmount, ...otherProperty } = details;
          return {
            ...otherProperty,
            paidAmount: parseFloat(paidAmount).toFixed(2),
            unpaidAmount: parseFloat(unpaidAmount).toFixed(2),
          };
        }
      });
      return convertDetailsForAdmin;
    } else {
      let convertDetailsForAdmin = [];

      commissionsDetailsArr.forEach((commission) => {
        if (commission.tags === null || commission.tags === "[]") {
          commission.tags = "";
        } else {
          commission.tags = JSON.parse(commission.tags).join(", ");
        }
      });

      convertDetailsForAdmin = commissionsDetailsArr.map((details) => {
        if (category === "summary") {
          const {
            order_created_at,
            commissions_amount,
            is_commissions_paid,
            ...otherProperty
          } = details;
          return {
            ...otherProperty,
            order_created_at: justDate(order_created_at),
            commissions_amount: parseFloat(commissions_amount).toFixed(2),
            is_commissions_paid: is_commissions_paid ? "Paid" : "Unpaid",
          };
        } else {
          const { paidAmount, unpaidAmount, ...otherProperty } = details;
          return {
            ...otherProperty,
            paidAmount: parseFloat(paidAmount).toFixed(2),
            unpaidAmount: parseFloat(unpaidAmount).toFixed(2),
          };
        }
      });
      return convertDetailsForAdmin;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTags = async (token) => {
  try {
    const {
      data: { tagsArr },
    } = await axios.get("/api/admin/settings/tags", {
      headers: { Authorization: `JWT ${token}` },
    });

    const tags = tagsArr.map((tag) => tag.tag);
    return tags;
  } catch (error) {
    Swal.fire("Something went wrong in getting the tags. Please try again.");
  }
};

// ARTIST SIDE
export const artistFetchComForTable = async (reqBody, token) => {
  const request = {
    ...reqBody,
    headers: { Authorization: `JWT ${token}` },
  };

  try {
    const {
      data: { commissionsDetailsArr },
    } = await axios(request);

    const convertDetailsForAdmin = commissionsDetailsArr.map((details) => {
      const {
        order_created_at,
        is_commissions_paid,
        ...otherProperty
      } = details;
      return {
        ...otherProperty,
        order_created_at: justDate(order_created_at),
        is_commissions_paid: is_commissions_paid ? "Paid" : "Unpaid",
      };
    });

    return convertDetailsForAdmin;
  } catch (error) {
    throw error;
  }
};
