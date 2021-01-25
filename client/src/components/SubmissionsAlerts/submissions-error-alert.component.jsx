import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectSubmissionsErrorAlert } from "../../redux/submissions/submissions.selector";
import { submissionErrorAlertClear } from "../../redux/submissions/submissions.action";

const SubmissionsErrorAlert = ({ message, clearMsg }) => {
  if (message) {
    const msg = message;
    Swal.fire({
      icon: "error",
      text: msg,
      showConfirmButton: false,
    });
    setTimeout(() => {
      clearMsg();
    }, 2000);
  }
  return <></>;
};

const mapStateToProps = createStructuredSelector({
  message: selectSubmissionsErrorAlert,
});

const mapDispatchToProps = (dispatch) => ({
  clearMsg: () => dispatch(submissionErrorAlertClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsErrorAlert);
