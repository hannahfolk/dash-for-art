import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectArtistSuccessAlert } from "../../redux/artist/artist.selector";
import { artistSuccessAlertClear } from "../../redux/artist/artist.action";

const ArtistSuccessAlert = ({ message, clearMsg }) => {
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
  message: selectArtistSuccessAlert,
});

const mapDispatchToProps = (dispatch) => ({
  clearMsg: () => dispatch(artistSuccessAlertClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistSuccessAlert);
