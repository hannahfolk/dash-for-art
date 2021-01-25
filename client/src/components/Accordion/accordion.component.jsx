import React, { useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import withStyles from "@material-ui/core/styles/withStyles";

import { LogInfo } from "../AdminArtApproval/admin-art-approval.styles";

const IconLeftAccordionSummary = withStyles({
  expandIcon: {
    order: -1,
  },
})(AccordionSummary);

const EmailAccordion = (props) => {
  const {
    emailContent: { artistEmail, emailSubject, emailBody },
  } = props;
  const [toggle, setToggle] = useState(false);

  const _handleToggle = () => {
    toggle === false ? setToggle(true) : setToggle(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <Accordion style={{ boxShadow: "none" }}>
        <IconLeftAccordionSummary
          IconButtonProps={{ edge: "start" }}
          style={{
            maxHeight: "18px",
            minHeight: "0px",
            padding: "0px",
          }}
          onClick={_handleToggle}
          expandIcon={<ExpandMoreIcon style={{ color: "#abaeb0" }} />}
        >
          <LogInfo style={{ marginRight: "5px" }}>
            {!toggle ? <>Expand to see email sent</> : <>Collapse</>}
          </LogInfo>
        </IconLeftAccordionSummary>
        <AccordionDetails style={{ display: "block" }}>
          <div
            style={{
              marginTop: "20px",
              flexGrow: "1",
              fontSize: "13px",
              lineHeight: "140%",
              color: "rgba(52, 52, 52, 0.4)",
              maxWidth: "calc(100% - 75px)",
              minWidth: "0",
            }}
          >
            <span>
              <b>To:</b>
            </span>
            {artistEmail}
            <br />
            <span>
              <b>Subject:</b>
            </span>
            {emailSubject}
            <br />
            <br />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: emailBody }}
            style={{
              marginTop: "20px",
              flexGrow: "1",
              fontSize: "13px",
              lineHeight: "140%",
              color: "rgba(52, 52, 52, 0.4)",
              maxWidth: "calc(100% - 75px)",
              minWidth: "0",
            }}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default EmailAccordion;
