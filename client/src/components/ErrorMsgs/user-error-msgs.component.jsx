import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserError } from "../../redux/user/user.selector";

import { ErrorTitle, ErrorList, FormTitle } from "./error-msgs.styles";

/**
 * @param {Object}   error          Error object
 * @param {Number}   error.status   HTTP error status
 * @param {String[]} error.messages Error message in an array
 */
const UserError = ({ error, children }) => {
  if (error) {
    const { messages: errorMessage } = error;

    const messages = [];
    if (!errorMessage) {
      messages.push("Required Fields: First Name");
      messages.push("Required Fields: Last Name");
      messages.push("Required Fields: Paypal Email");
      messages.push("Required Fields: Paypal Email");
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
            <li>
              If you are changing your contact email. Please use a valid email
            </li>
            <li>
              If you are changing your password. Please match the password.
            </li>
            <li>
              If you are changing your password. Password must be at least 5
              characters long.
            </li>
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
  error: selectUserError,
});

export const UserErrorMessages = connect(mapStateToProps)(UserError);
