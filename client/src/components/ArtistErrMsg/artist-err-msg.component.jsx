import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectArtistError } from "../../redux/artist/artist.selector";

import { ErrorTitle, ErrorList, FormTitle } from "./artist-err-msg.styles";

/**
 * @param {Object}   error          Error object
 * @param {Number}   error.status   HTTP error status
 * @param {String[]} error.messages Error message in an array
 */
const ArtistErrorMessages = ({ error, children }) => {
  if (error) {
    const { messages: errorMessage } = error;
    const messages = [];
    if (!errorMessage) {
      messages.push("Required Fields: Artist Name");
      messages.push("Required Fields: First Name");
      messages.push("Required Fields: Last Name");
      messages.push("Required Fields: Valid Paypal Email");
    }
    return (
      <ErrorList>
        <ErrorTitle>Please Correct Error(s)</ErrorTitle>
        {messages && messages.length > 0 ? (
          messages.map((errMsg, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: errMsg }} />
          ))
        ) : (
          <>
            <li>Required Fields: Artist Name</li>
            <li>Required Fields: First Name</li>
            <li>Required Fields: Last Name</li>
            <li>Required Fields: Valid Paypal Email</li>
          </>
        )}
      </ErrorList>
    );
  } else {
    return (
      <>
        {children ? (
          <FormTitle>{children}</FormTitle>
        ) : (
          <div style={{ height: "85px" }} />
        )}
      </>
    );
  }
};

const mapStateToProps = createStructuredSelector({
  error: selectArtistError,
});

export default connect(mapStateToProps)(ArtistErrorMessages);
