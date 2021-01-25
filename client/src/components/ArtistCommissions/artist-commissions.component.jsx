import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectUserJWTToken } from "../../redux/user/user.selector";

import { ArtistTable } from "../Table";
import TableQueries from "../Table/table-queries.component";
import { artistFetchCommForTable } from "../../utils/fetchCommForTable";
import { SelectColumnFilter } from "../../libs/table";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { SubmissionContainer, TabArea } from "../SharedStyle/styled";

const TABLE_COLUMNS = [
  {
    Header: "Date",
    accessor: "order_created_at",
    disableFilters: true,
  },
  {
    Header: "Title",
    accessor: "product_title",
    filter: "fuzzyText",
  },
  {
    Header: "Product Type",
    accessor: "product_type",
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "Commissions Amount",
    accessor: "commissions_amount",
    disableFilters: true,
  },
  // {
  //   Header: "Paid or Unpaid",
  //   accessor: "is_commissions_paid",
  //   Filter: SelectColumnFilter,
  //   filter: "includes",
  // },
];

class ArtistCommissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      errorMsg: "",
      loading: true,
      startDate: new Date(),
      endDate: new Date(),
    };
  }

  componentDidMount() {
    this.getAllCommissions();
  }

  setTableData = (data) => {
    this.setState({ tableData: data });
  };

  getAllCommissions = async () => {
    try {
      const { token } = this.props;
      const reqBody = {
        url: "/api/artist/commissions",
        method: "GET",
      };

      const tableData = await artistFetchCommForTable(reqBody, token);

      this.setState({ tableData, loading: false });
    } catch (error) {
      console.log(error);
      this.setState({
        errorMsg:
          "We could not find any records. Let us know if its a mistake.",
      });
    }
  };

  handleDateFilter = async ({ startDate, endDate }) => {
    const { token } = this.props;
    const reqBody = {
      url: "/api/artist/commissions/dates",
      method: "POST",
      data: {
        startDate,
        endDate,
      },
    };
    try {
      const tableData = await artistFetchCommForTable(reqBody, token);

      this.setState({
        tableData,
        startDate,
        endDate,
        loading: false,
      });
    } catch (error) {
      console.log(error);
      this.setState({
        errorMsg:
          "We could not find any records. Let us know if its a mistake.",
      });
    }
  };

  render() {
    const { tableData, errorMsg, loading, startDate, endDate } = this.state;
    return (
      <SubmissionContainer>
        <TabArea>
          <TableQueries
            handleDateFilter={this.handleDateFilter}
            globalStartDate={startDate}
            globalEndDate={endDate}
          />
          {tableData.length > 1 ? (
            <ArtistTable columns={TABLE_COLUMNS} data={tableData} />
          ) : errorMsg ? (
            <h2>{errorMsg}</h2>
          ) : (
            <>
              {loading ? (
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
              ) : (
                <h2 style={{ textAlign: "center" }}>
                  Sorry you don't have any commissions yet.
                </h2>
              )}
            </>
          )}
        </TabArea>
      </SubmissionContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(ArtistCommissions);
