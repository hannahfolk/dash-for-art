import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import axios from "axios";

import EmailAccordion from "../Accordion/accordion.component";

import {
  LogContainer,
  LogList,
  LogListItem,
  LogInfo,
  LogTimestamp,
} from "./admin-art-approval.styles";

const LogHistory = (props) => {
  const { token, id } = props;
  const [logs, setLogs] = useState([]);

  // TODO: find a way to get log history to refresh when logs change (force reload or redux)
  useEffect(
    () => {
      _getLogs();
    },
    // eslint-disable-next-line
    [id]
  );

  const _getLogs = async () => {
    try {
      const { data } = await axios.get(`/api/admin/submissions/logs/${id}`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      const logs = JSON.parse(data);

      setLogs(logs);
    } catch (error) {
      console.log(error);
    }
  };

  const _mapLogs = () => {
    if (logs !== null) {
      return logs.map((log, i) => {
        if (log.type === "emailStatusChange") {
          return (
            <LogListItem
              key={i}
              style={{ border: "none", marginBottom: "0px" }}
            >
              <LogInfo>{log.logInfo}</LogInfo>
              <LogTimestamp>{log.logTimestamp}</LogTimestamp>
            </LogListItem>
          );
        } else if (log.type === "emailContentChange") {
          return (
            <LogListItem key={i} style={{ marginTop: "5px" }}>
              <EmailAccordion emailContent={log.emailContent} />
            </LogListItem>
          );
        } else {
          return (
            <LogListItem key={i}>
              <LogInfo>{log.logInfo}</LogInfo>
              <LogTimestamp>{log.logTimestamp}</LogTimestamp>
            </LogListItem>
          );
        }
      });
    }
  };

  return (
    <LogContainer>
      <LogList>{_mapLogs()}</LogList>
    </LogContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(LogHistory);
