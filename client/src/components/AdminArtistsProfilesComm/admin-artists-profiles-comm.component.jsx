import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import axios from "axios";
import Swal from "sweetalert2";

import TableQueries from "../Table/table-queries.component";
import AutocompleteSearch from "../AutocompleteSearch";

import {
  CommissionsSumHeader,
  CommissionsSummary,
} from "./admin-artists-profiles-comm.styles";

const AdminArtistsProfilesComm = (props) => {
  const [state, setState] = useState({
    search: "",
    sumQuantity: 0,
    section: "",
    hasSearch: false,
    isLoading: true,
  });
  const [commissionsDetailsArr, setCommissionsDetailsArr] = useState([]);
  const [filteredArr, setFilteredArr] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [topDesigns, setTopDesigns] = useState([]);
  const [dropdownArr, setDropdownArr] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(`${new Date().getFullYear()}-01-01`),
    endDate: new Date(),
  });

  const { search, sumQuantity, section, hasSearch, isLoading } = state;
  const { startDate, endDate } = dateRange;
  const { token, artistName } = props;

  useEffect(
    () => {
      const start = new Date(startDate).toLocaleDateString("en-CA", {
        timeZone: "UTC",
      });
      const end = new Date(endDate).toLocaleDateString("en-CA", {
        timeZone: "UTC",
      });

      setDateRange({
        startDate: start,
        endDate: end,
      });
      _getArtistCommissions(startDate, endDate);
    },
    // eslint-disable-next-line
    []
  );

  const _getArtistCommissions = async (startDate, endDate) => {
    try {
      const {
        data: { commissionsDetailsArr },
      } = await axios.post(
        `/api/admin/commissions/by-artist/${artistName}`,
        {
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      setCommissionsDetailsArr(commissionsDetailsArr);
      _countQuantity(commissionsDetailsArr);
      _getTopDesigns(commissionsDetailsArr);
      _formatDropdownArr(commissionsDetailsArr);
      setState({
        ...state,
        isLoading: false,
      });
    } catch (error) {
      Swal.fire("Something went wrong. Please try again.");
    }
  };

  const _formatDropdownArr = (commissionsDetailsArr) => {
    const dropdownArr = [
      {
        title: "Product Title",
        elements: [],
      },
      {
        title: "Product Type",
        elements: [],
      },
    ];

    commissionsDetailsArr.forEach((element) => {
      if (element.product !== "" || element.product !== null) {
        dropdownArr[0].elements.push(element.product);
        const uniqueProductArr = new Set(dropdownArr[0].elements);
        dropdownArr[0].elements = [...uniqueProductArr];
      }
      if (element.productType !== "" || element.productType !== null) {
        dropdownArr[1].elements.push(element.productType);
        const uniqueProductTypeArr = new Set(dropdownArr[1].elements);
        dropdownArr[1].elements = [...uniqueProductTypeArr];
      }
    });

    setDropdownArr(dropdownArr);
  };

  const _countQuantity = (commissionsDetailsArr) => {
    let totalQuantity = 0;
    commissionsDetailsArr.forEach((order) => {
      totalQuantity += order.quantity;
    });

    setTotalQuantity(totalQuantity);
  };

  const _getTopDesigns = (commissionsDetailsArr) => {
    const commissionsDetailsMap = {};
    const topDesigns = [];

    // First convert details arr to object to count quantity per product
    commissionsDetailsArr.forEach((element) => {
      commissionsDetailsMap[element.product] =
        (commissionsDetailsMap[element.product] || 0) + 1;
    });

    if (JSON.stringify(commissionsDetailsMap) !== "{}") {
      const topDesign = Object.keys(commissionsDetailsMap).reduce((a, b) => {
        return commissionsDetailsMap[a] > commissionsDetailsMap[b] ? a : b;
      });
      topDesigns.push(topDesign);
      delete commissionsDetailsMap[topDesign];
    }

    if (JSON.stringify(commissionsDetailsMap) !== "{}") {
      const secondTopDesign = Object.keys(commissionsDetailsMap).reduce(
        (a, b) => {
          return commissionsDetailsMap[a] > commissionsDetailsMap[b] ? a : b;
        }
      );
      topDesigns.push(secondTopDesign);
      delete commissionsDetailsMap[secondTopDesign];
    }

    if (JSON.stringify(commissionsDetailsMap) !== "{}") {
      const thirdTopDesign = Object.keys(commissionsDetailsMap).reduce(
        (a, b) => {
          return commissionsDetailsMap[a] > commissionsDetailsMap[b] ? a : b;
        }
      );
      topDesigns.push(thirdTopDesign);
      delete commissionsDetailsMap[thirdTopDesign];
    }

    setTopDesigns(topDesigns);
  };

  const handleAutocompleteChange = (event, { newValue, method }) => {
    setState({
      search: newValue,
    });
  };

  const handleAutocompleteSearch = async (event) => {
    event.preventDefault();
    if (search !== "") {
      const filteredArr = commissionsDetailsArr.filter(
        (element) =>
          element.product.toLowerCase() === search.toLowerCase() ||
          element.productType.toLowerCase() === search.toLowerCase()
      );

      const section =
        dropdownArr[0].elements.indexOf(search) !== -1
          ? "Product Title"
          : "Product Type";

      let sumQuantity = 0;
      filteredArr.forEach((element) => (sumQuantity += element.quantity));

      setFilteredArr(filteredArr);
      setState({
        ...state,
        sumQuantity,
        section,
        hasSearch: true,
      });
    }
  };

  const handleDateFilter = async ({ startDate, endDate }) => {
    try {
      _getArtistCommissions(startDate, endDate);
      setDateRange({
        startDate,
        endDate,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }

    return;
  };

  return (
    <>
      <CommissionsSumHeader>
        <h1
          style={{
            margin: "0 auto",
          }}
        >
          Commissions Summary for {artistName}
        </h1>
        <div style={{ marginTop: "20px" }}>
          <TableQueries
            handleDateFilter={handleDateFilter}
            globalStartDate={startDate}
            globalEndDate={endDate}
            note="Note: Default start date is January 1st."
          />
        </div>
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <AutocompleteSearch
            search={search}
            handleAutocompleteChange={handleAutocompleteChange}
            handleAutocompleteSearch={handleAutocompleteSearch}
            dropdownArr={dropdownArr}
            submitButton="Get Summary"
            placeholder="Search by product title or type"
          />
        </div>
      </CommissionsSumHeader>
      <CommissionsSummary>
        {hasSearch ? (
          <>
            <h2>{search}</h2>
            <h4>
              Total products sold for {search}: <span>{sumQuantity}</span>
            </h4>
            {section === "Product Title" ? (
              <ul>
                {filteredArr.map((productType, i) => (
                  <li key={i}>
                    {productType.productType}s: {productType.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {filteredArr.map((product, i) => (
                  <li key={i}>
                    {product.product}s: {product.quantity}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            {isLoading ? (
              ""
            ) : (
              <>
                <h2>
                  Total Number of Orders from {startDate} to {endDate}:
                  <span
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "yellowgreen",
                    }}
                  >
                    {totalQuantity}
                  </span>
                </h2>
                <h2>
                  Top Designs from {startDate} to {endDate}:
                </h2>
                <ul>
                  {topDesigns.map((design, i) => (
                    <li key={i}>{design}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </CommissionsSummary>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminArtistsProfilesComm);
