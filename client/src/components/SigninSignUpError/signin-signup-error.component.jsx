import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserError } from "../../redux/user/user.selector";

import { ErrorMessages, SpaceHolder } from "./signin-signup-error.styles";

const TEEFURY_EMAIL = "artist@teefury.com";
const EMAIL_SUBJECT = "Reset User Account";

const SignInSignUpError = ({ error }) => {
  if (error) {
    const {
      status,
      data: { message },
      config,
    } = error;
    
    let contactEmail = "";
    if (config) contactEmail = JSON.parse(config.data).contactEmail;

    const MSG_TO_ARTIST = `Artist! Please send this email from the same inbox you are requesting the password to be reset.\nFor your account security sender email must match ${contactEmail}.\nMissed match sender email and account email will be ignored.`;
    const EMAIL_BODY = `Hello Teefury Team,\n\nPlease reset the password associated to the email, ${contactEmail}\n\n${MSG_TO_ARTIST}\n\nThank you!`;
    // eslint-disable-next-line
    const RESET_EMAIL_URL = encodeURI(
      `mailto:${TEEFURY_EMAIL}?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`
    );

    return (
      <>
        <ErrorMessages>{message}</ErrorMessages>
        {/* User not found 404 || Password incorrect not Authorized 401 || Conflict 409 */}
        {status === 404 || status === 401 || status === 409 ? (
          <ErrorMessages>
            <a target="_blank" rel="noopener noreferrer" href={"/forgot-password"}> 
              Forgot Password
            </a>
          </ErrorMessages>
        ) : null}
      </>
    );
  } else {
    return <SpaceHolder />;
  }
};

const mapStateToProp = createStructuredSelector({
  error: selectUserError,
});

export default connect(mapStateToProp)(SignInSignUpError);
