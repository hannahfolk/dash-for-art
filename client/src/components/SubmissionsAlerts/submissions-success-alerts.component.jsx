import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectSubmissionsSuccessAlert } from "../../redux/submissions/submissions.selector";
import { submissionSuccessAlertClear } from "../../redux/submissions/submissions.action";

const SubmissionsSuccessAlert = ({ message, clearMsg }) => {
  if (message) {
    Swal.fire({
      icon: "success",
      text: message,
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(() => {
      clearMsg();
    }, 1500);
  }
  return <></>;
};

const mapStateToProps = createStructuredSelector({
  message: selectSubmissionsSuccessAlert,
});

const mapDispatchToProps = (dispatch) => ({
  clearMsg: () => dispatch(submissionSuccessAlertClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsSuccessAlert);
