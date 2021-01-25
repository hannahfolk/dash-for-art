import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link, withRouter } from "react-router-dom";

import axios from "axios";

import { areUserFormFieldsValid } from "../../utils";
import { clearUserError, signInStart } from "../../redux/user/user.action";
import { selectUserAccount } from "../../redux/user/user.selector";
import { selectArtistProfile } from "../../redux/artist/artist.selector";

import { Form, FormInput } from "../FormInput";
import { ButtonMd } from "../Button";
import SignInSignUpError from "../SigninSignUpError";
import Captcha from "../Captcha";

import {
  SignUpContainer,
  H1,
  H2,
  H3,
  H4,
  Img,
  ErrorMessages,
  SpaceHolder,
} from "../SharedStyle/signin-signout.styles";
import logo from "../../assets/logo.png";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactEmail: "",
      password: "",
      captcha: 0,
      formEmailError: "",
      formPasswordError: "",
      formCaptchaError: "",
      isDisableSubmit: false,
      isFormValid: true,
      componentHasError: false,
    };
  }

  // TODO: Handle error better when components are mounting

  static getDerivedStateFromError() {
    return { componentHasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log("++++++++++++++++++++++++++++++");
    console.log({ error });
    console.log({ errorInfo });
    console.log("++++++++++++++++++++++++++++++");
  }

  componentDidMount() {
    const { userAccount, artistProfile, clearReduxUserErrors } = this.props;
    clearReduxUserErrors();
    this._redirectUser(userAccount, artistProfile);
  }

  shouldComponentUpdate(nextProps) {
    const { userAccount, artistProfile } = nextProps;
    return this._redirectUser(userAccount, artistProfile);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, isDisableSubmit: false });
  };

  handleCaptchaChange = async (value) => {
    const { status } = await axios.post("/api/user/captcha", {
      humanKey: value,
    });

    if (status === 200) {
      this.setState({
        captcha: 200,
        isDisableSubmit: false,
      });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this._signInUser();
  };

  handleFormKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();
      this._signInUser();
    }
  };

  _signInUser() {
    const { contactEmail, password, captcha } = this.state;
    const { signInStart, clearReduxUserErrors } = this.props;

    const doesFormHaveErrors = areUserFormFieldsValid(
      contactEmail,
      password,
      captcha
    );

    clearReduxUserErrors();

    if (doesFormHaveErrors) {
      const { ...errorMsgs } = doesFormHaveErrors;
      this.setState({
        ...errorMsgs,
        isDisableSubmit: true,
      });
    } else {
      this.setState({
        formEmailError: "",
        formPasswordError: "",
        formCaptchaError: "",
        isDisableSubmit: true,
      });
      signInStart(contactEmail.trim(), password.trim());
    }
  }

  _redirectUser = (userAccount, artistProfile) => {
    const { history } = this.props;
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

  render() {
    const {
      contactEmail,
      password,
      formEmailError,
      formPasswordError,
      formCaptchaError,
      isDisableSubmit,
      componentHasError,
    } = this.state;

    // TODO: handle error better
    if (componentHasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    } else {
      return (
        <SignUpContainer>
          <H1>Welcome!</H1>
          <H2>
            <Img src={logo} alt="Teefury Logo" />
            Tee<b>Fury</b>
          </H2>
          <H3>Artist Dashboard</H3>
          <H4>Sign In</H4>
          <Form
            onSubmit={this.handleSubmit}
            onKeyPress={this.handleFormKeyPress}
          >
            {formEmailError ? (
              <ErrorMessages>{formEmailError}</ErrorMessages>
            ) : (
              <SignInSignUpError />
            )}
            <FormInput
              type="email"
              name="contactEmail"
              label="contact_email"
              placeholder="Contact Email"
              style={{ fontSize: "16px", marginBottom: "10px" }}
              handleChange={this.handleChange}
              value={contactEmail}
              required
            />
            {formPasswordError ? (
              <ErrorMessages>{formPasswordError}</ErrorMessages>
            ) : (
              <SpaceHolder />
            )}
            <FormInput
              type="password"
              name="password"
              label="password"
              placeholder="Password"
              style={{ fontSize: "16px", marginBottom: "10px" }}
              handleChange={this.handleChange}
              value={password}
              required
            />
            {contactEmail && password ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "20px 0",
                }}
              >
                <Captcha handleCaptchaChange={this.handleCaptchaChange} />
              </div>
            ) : (
              ""
            )}
            {formCaptchaError ? (
              <ErrorMessages>{formCaptchaError}</ErrorMessages>
            ) : (
              ""
            )}
            <div style={{ marginTop: "-9px" }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: "12px", margin: "0 auto" }}
              >
                Forgot your password?
              </Link>
            </div>
            <ButtonMd
              type="submit"
              disabled={isDisableSubmit}
              style={{ width: "110px" }}
            >
              Sign In
            </ButtonMd>
          </Form>
          <div style={{ marginTop: "20px" }}>
            <Link
              style={{
                textTransform: "uppercase",
                fontSize: "15px",
                fontFamily: "sans-serif",
                fontWeight: "bold",
              }}
              to="/signup"
            >
              Don't have an account? Sign Up!
            </Link>
          </div>
        </SignUpContainer>
      );
    }
  }
}

const mapStateToProps = createStructuredSelector({
  userAccount: selectUserAccount,
  artistProfile: selectArtistProfile,
});

const mapDispatchToProps = (dispatch) => ({
  clearReduxUserErrors: () => dispatch(clearUserError()),
  signInStart: (contactEmail, password) =>
    dispatch(signInStart({ contactEmail, password })),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));
