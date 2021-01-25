import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectUserJWTToken } from "../../redux/user/user.selector";

import PayoutTable from "./payoutTable.component";

import {
  SubmissionContainer,
  TabArea,
  TabHeader,
  TabSubLink,
  TabSubTitle,
  TabTitle,
} from "../SharedStyle/styled";

const AdminPayout = ({ token }) => {
  const [tableRowsData, setTableRowsData] = useState([]);

  const tableColumn = [
    { title: "ID", field: "id", type: "numeric", editable: "never" },
    { title: "Product Type", field: "product_type" },
    {
      title: "Commissions Payout",
      field: "commissions_payout",
      type: "numeric",
    },
    {
      title: "Group",
      field: "group",
    },
  ];

  useEffect(() => {
    const getCommissionsPayout = async () => {
      const reqBody = {
        url: "/api/admin/commissions/payouts",
        method: "GET",
        headers: { Authorization: `JWT ${token}` },
      };

      const {
        data: { commissionsPayouts: tableRowsData },
      } = await axios(reqBody);

      setTableRowsData(tableRowsData);
    };
    getCommissionsPayout();
  }, [token]);

  const handleRowAdd = async (rowData) => {
    const reqBody = {
      url: "/api/admin/commissions/payout",
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      data: {
        rowData,
      },
    };

    const {
      data: { tableRowData },
    } = await axios(reqBody);

    return tableRowData;
  };

  const handleRowUpdate = async (rowData) => {
    const reqBody = {
      url: "/api/admin/commissions/payout",
      method: "PUT",
      headers: { Authorization: `JWT ${token}` },
      data: {
        rowData,
      },
    };

    const {
      data: { tableRowData },
    } = await axios(reqBody);

    return tableRowData;
  };

  const handleRowDelete = async (rowData) => {
    const reqBody = {
      url: "/api/admin/commissions/payout",
      method: "DELETE",
      headers: { Authorization: `JWT ${token}` },
      data: {
        rowData,
      },
    };

    await axios(reqBody);

    return true;
  };

  return (
    <SubmissionContainer>
      <TabHeader>
        <TabSubLink to={`/admin/commissions`}>
          <TabSubTitle>Commissions</TabSubTitle>
        </TabSubLink>
        <TabTitle>Payouts</TabTitle>
      </TabHeader>
      <TabArea>
        {tableRowsData.length ? (
          <PayoutTable
            tableRowsData={tableRowsData}
            tableColumn={tableColumn}
            handleRowUpdate={handleRowUpdate}
            handleRowDelete={handleRowDelete}
            handleRowAdd={handleRowAdd}
          />
        ) : null}
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminPayout);
