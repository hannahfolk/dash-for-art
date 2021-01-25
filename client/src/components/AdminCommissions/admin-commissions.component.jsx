import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { AdminTable } from "../Table";
import TableQueries from "../Table/table-queries.component";
import { adminFetchCommForTable } from "../../utils/fetchCommForTable";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

// import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
//eslint-disable-next-line
// import ToggleButton from "@material-ui/lab/ToggleButton";

import {
  TABLE_COLUMNS,
  // TABLE_COLUMNS_ARTIST,
  // TABLE_COLUMNS_PRODUCT,
  // TABLE_COLUMNS_PRODUCT_TYPE,
} from "./admin-table-headers";

import {
  SubmissionContainer,
  TabArea,
  TabHeader,
  TabSubLink,
  TabSubTitle,
  TabTitle,
} from "../SharedStyle/styled";

const AdminCommissions = (props) => {
  const [tableData, setTableData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [alignment, setAlignment] = useState("summary");
  const [tableColumns, setTableColumns] = useState(TABLE_COLUMNS);
  const [checkedExcludeTags, setCheckedExludeTags] = useState(false);
  const [isCommLoading, setIsCommLoading] = useState(true);

  const { startDate, endDate } = dateRange;
  const { token } = props;

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
      _getAllCommissions(start, end, alignment);
    },
    //eslint-disable-next-line
    []
  );

  const _getAllCommissions = async (
    startDate,
    endDate,
    category,
    checkedExcludeTags
  ) => {
    const reqBody = {
      method: "POST",
      data: {
        startDate,
        endDate,
      },
    };
    category === "summary"
      ? (reqBody.url = `/api/admin/commissions`)
      : (reqBody.url = `/api/admin/commissions/by-${category}`);

    try {
      const tableData = await adminFetchCommForTable(
        reqBody,
        token,
        category,
        checkedExcludeTags
      );

      setIsCommLoading(false);
      setTableData(tableData);

      return tableData;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
      return;
    }
  };

  const handleDateFilter = async ({ startDate, endDate }) => {
    try {
      const tableData = await _getAllCommissions(
        startDate,
        endDate,
        alignment,
        checkedExcludeTags
      );

      setTableData(tableData);
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

  // eslint-disable-next-line
  const _handleToggle = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);

      switch (newAlignment) {
        case "summary":
          setTableColumns(TABLE_COLUMNS);
          break;
        // case "artist":
        //   setTableColumns(TABLE_COLUMNS_ARTIST);
        //   break;
        // case "product":
        //   setTableColumns(TABLE_COLUMNS_PRODUCT);
        //   break;
        // case "product-type":
        //   setTableColumns(TABLE_COLUMNS_PRODUCT_TYPE);
        //   break;
        default:
          return;
      }

      _getAllCommissions(startDate, endDate, newAlignment, checkedExcludeTags);
    }
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setCheckedExludeTags(checked);
    setTableColumns(TABLE_COLUMNS);

    _getAllCommissions(startDate, endDate, alignment, checked);
  };

  return (
    <SubmissionContainer>
      <TabHeader>
        <TabTitle>Commissions</TabTitle>
        <TabSubLink to={`/admin/commissions/payouts`}>
          <TabSubTitle>Payouts</TabSubTitle>
        </TabSubLink>
      </TabHeader>
      <TabArea>
        <TableQueries
          handleDateFilter={handleDateFilter}
          globalStartDate={startDate}
          globalEndDate={endDate}
          note="Note: Default is today."
        />
        {/* <ToggleButtonGroup
          size="large"
          value={alignment}
          exclusive
          onChange={_handleToggle}
          style={{ marginBottom: "15px" }}
        > */}
        {/* <ToggleButton value="summary">Summary</ToggleButton> */}
        {/* <ToggleButton value="artist">Artist</ToggleButton>
          <ToggleButton value="product">Product Title</ToggleButton>
          <ToggleButton value="product-type">Product Type</ToggleButton> */}
        {/* </ToggleButtonGroup> */}
        {isCommLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "50px",
            }}
          >
            <img
              className="rotating"
              src={teefuryBirdLogo}
              alt="tee bird"
              style={{ height: "100px", width: "100px" }}
            />
          </div>
        ) : tableData.length > 1 ? (
          <AdminTable
            columns={tableColumns}
            setTableData={setTableData}
            startDate={startDate}
            endDate={endDate}
            type={alignment}
            data={tableData}
            token={token}
            checkedExcludeTags={checkedExcludeTags}
            handleCheckboxChange={handleCheckboxChange}
          />
        ) : (
          <h2> No Records Found </h2>
        )}
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminCommissions);
