import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link, useParams, useHistory } from "react-router-dom";

import { authorizedSuccess } from "../../redux/user/user.action";

import { areUserUpdateFormFieldsValid } from "../../utils";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";

import { Form, FormInput } from "../FormInput";
import { ButtonMd } from "../Button";
import {
  SignUpContainer,
  H1,
  H2,
  H3,
  H4,
  Img,
  ErrorMessages,
} from "../SharedStyle/signin-signout.styles";
import logo from "../../assets/logo.png";

const ResetPassword = ({ loginUser }) => {
  const [state, setState] = useState({
    newPassword: "",
    confirmPassword: "",
    errorMessages: [],
    successMessage: "",
    isDisableSubmit: false,
    isLoading: false,
  });

  const {
    newPassword,
    confirmPassword,
    errorMessages,
    isDisableSubmit,
    successMessage,
    isLoading,
  } = state;

  const { token } = useParams();
  const history = useHistory();

  const resetPassword = async () => {
    try {
      const { data } = await axios.post("/api/user/reset-password", {
        password: newPassword,
        token,
      });

      const { userAccount, artistProfile } = data;

      loginUser(data);
      redirectUser(userAccount, artistProfile);
    } catch (error) {
      const { message } = error.response.data;
      setState({
        ...state,
        errorMessages: [message],
        successMessage: "",
        isDisableSubmit: true,
      });
    }
  };

  const resetUserPassword = () => {
    const formObject = {
      newPassword: newPassword.trim(),
      confirmPassword: confirmPassword.trim(),
    };

    const doesFormHaveErrors = areUserUpdateFormFieldsValid(formObject);

    if (doesFormHaveErrors) {
      const { errorMessages } = doesFormHaveErrors;
      setState({
        ...state,
        errorMessages,
        isDisableSubmit: true,
      });
    } else {
      setState({
        ...state,
        isDisableSubmit: true,
        isLoading: true,
      });
      resetPassword();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value, isDisableSubmit: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    resetUserPassword();
  };

  const handleFormKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();
      resetUserPassword();
    }
  };

  const redirectUser = (userAccount, artistProfile) => {
    const hasCreatedUserAccount =
      userAccount && userAccount.contactEmail ? true : false;
    const hasCreatedArtistProfile =
      artistProfile && artistProfile.artistName ? true : false;

    if (hasCreatedUserAccount) {
      // Admin
      if (userAccount.isAdmin) {
        history.push("/admin/profile");
        return false;
      }

      // Artist
      if (hasCreatedArtistProfile) {
        history.push("/artist/profile");
        return false;
      } else {
        history.push("/artist/create");
        return false;
      }
    } else {
      return true;
    }
  };

  return (
    <SignUpContainer>
      <H1>Welcome!</H1>
      <H2>
        <Img src={logo} alt="Teefury Logo" />
        Tee<b>Fury</b>
      </H2>
      <H3>Artist Dashboard</H3>
      <H4>RESET PASSWORD</H4>
      <span style={{ display: "block", minHeight: "40px" }}>
        <h5 style={{ color: "red" }}>{successMessage}</h5>
        {errorMessages.length > 0
          ? errorMessages.map((msg, i) => {
              return <ErrorMessages key={i}>{msg}</ErrorMessages>;
            })
          : null}
      </span>
      <Form onSubmit={handleSubmit} onKeyPress={handleFormKeyPress}>
        <FormInput
          type="password"
          name="newPassword"
          label="password"
          placeholder="Password"
          style={{ fontSize: "16px", marginBottom: "10px" }}
          handleChange={handleChange}
          value={newPassword}
          required
        />
        <FormInput
          type="password"
          name="confirmPassword"
          label="confirmPassword"
          placeholder="Confirm Password"
          style={{ fontSize: "16px", marginBottom: "10px" }}
          handleChange={handleChange}
          value={confirmPassword}
          required
        />
        <ButtonMd
          type="submit"
          disabled={isDisableSubmit}
          // IE polyfill
          // eslint-disable-next-line
          style={{ width: "220px", width: "fit-content" }}
        >
          {isLoading ? <LoadingIcon /> : "Reset Password"}
        </ButtonMd>
      </Form>
      <div style={{ marginTop: "20px" }}>
        <Link to="/signin" style={{ fontSize: "22px" }}>
          SIGNIN!
        </Link>
      </div>
    </SignUpContainer>
  );
};

const mapDispatchToProps = (dispatch) => ({
  loginUser: (data) => dispatch(authorizedSuccess(data)),
});

export default connect(null, mapDispatchToProps)(ResetPassword);
