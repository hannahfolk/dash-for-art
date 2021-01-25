import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectArtistErrorAlert } from "../../redux/artist/artist.selector";
import { artistErrorAlertClear } from "../../redux/artist/artist.action";

const ArtistErrorAlert = ({ message, clearMsg }) => {
  if (message) {
    const msg = message;
    Swal.fire({
      icon: "error",
      text: msg,
      showConfirmButton: false,
    });
    setTimeout(() => {
      clearMsg();
    }, 1500);
  }
  return <></>;
};

const mapStateToProps = createStructuredSelector({
  message: selectArtistErrorAlert,
});

const mapDispatchToProps = (dispatch) => ({
  clearMsg: () => dispatch(artistErrorAlertClear("")),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistErrorAlert);
