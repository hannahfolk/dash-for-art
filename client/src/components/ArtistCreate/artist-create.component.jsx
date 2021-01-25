import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { areArtistFormFieldsValid } from "../../utils";
import { deleteUserStart, logoutStart } from "../../redux/user/user.action";
import { selectUserAccount } from "../../redux/user/user.selector";
import {
  createArtistProfileStart,
  clearArtistErrors,
  artistProfileFailure,
} from "../../redux/artist/artist.action";
import { selectArtistProfile } from "../../redux/artist/artist.selector";

import { Form, FormInput } from "../FormInput";
import { ButtonMd } from "../Button";
import {
  CheckboxesContainer,
  Checkbox,
  Label,
} from "../CheckBox/checkbox.component";
import ArtistErrMsg from "../ArtistErrMsg";

import {
  SignUpContainer,
  H1,
  H2,
  H3,
  P,
  Span,
  Img,
  Terms,
  LinkToTerm,
} from "./artist-create.styles.jsx";
import logo from "../../assets/logo.png";

class CreateArtist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artistName: "",
      firstName: "",
      lastName: "",
      contactEmail: "",
      paypalEmail: "",
      phoneNumber: "",
      socialFacebook: "",
      socialInstagram: "",
      socialTwitter: "",
      isInternational: true,
      hasAcceptTerms: false,
      errorStatus: "",
      isDisableSubmit: false,
    };
  }

  // TODO: Handle component loading error
  // static getDerivedStateFromError() {
  // componentDidCatch(error, errorInfo)

  static getDerivedStateFromProps(props) {
    const { userAccount } = props;
    return userAccount && userAccount.contactEmail
      ? { contactEmail: userAccount.contactEmail }
      : { contactEmail: "" };
  }

  componentDidMount() {
    const { clearReduxArtistErrors, userAccount, artistProfile } = this.props;
    clearReduxArtistErrors();
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

  handleSubmit = (event) => {
    event.preventDefault();
    this._createArtistProfile();
  };

  handleFormKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();
      this._createArtistProfile();
    }
  };

  handleClick = () => {
    const { deleteUser } = this.props;
    deleteUser();
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  handleToggleCheckBox = (event) => {
    const {
      name,
      dataset: { bool },
    } = event.target;
    const boolValue = bool.toLowerCase() === "true" ? true : false;
    this.setState({ [name]: boolValue });
  };

  _createArtistProfile() {
    const {
      artistName,
      firstName,
      lastName,
      contactEmail,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
      hasAcceptTerms,
    } = this.state;

    const {
      createArtistProfileStart,
      clearReduxArtistErrors,
      artistErrorMsg,
    } = this.props;

    const reqBody = {
      artistName: artistName.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      contactEmail: contactEmail.trim(),
      paypalEmail: paypalEmail.trim(),
      phoneNumber: phoneNumber.trim(),
      socialFacebook: socialFacebook.trim(),
      socialInstagram: socialInstagram.trim(),
      socialTwitter: socialTwitter.trim(),
      isInternational,
      hasAcceptTerms,
    };

    const doesFormHaveErrors = areArtistFormFieldsValid(reqBody);

    clearReduxArtistErrors();

    if (doesFormHaveErrors) {
      const { errorMessages } = doesFormHaveErrors;
      this.setState({
        isDisableSubmit: true,
      });
      artistErrorMsg({ messages: errorMessages });
    } else {
      this.setState({ isDisableSubmit: true });
      createArtistProfileStart(reqBody);
    }
  }

  _redirectUser = (userAccount, artistProfile) => {
    const { history, logOut } = this.props;
    const hasCreatedUserAccount =
      userAccount && userAccount.contactEmail ? true : false;
    const hasCreatedArtistProfile =
      artistProfile && artistProfile.artistName ? true : false;

    if (hasCreatedUserAccount) {
      if (hasCreatedArtistProfile) {
        history.push("/artist/profile");
        return false;
      } else {
        return true;
      }
    } else {
      logOut();
      history.push("/");
      return false;
    }
  };

  render() {
    const {
      artistName,
      firstName,
      lastName,
      contactEmail,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
      hasAcceptTerms,
      isDisableSubmit,
    } = this.state;

    return (
      <SignUpContainer>
        <H1>Welcome!</H1>
        <H2>
          <Img src={logo} alt="Teefury Logo" />
          Tee<b>Fury</b>
        </H2>
        <H3>Artist Dashboard</H3>
        <ArtistErrMsg />
        <Form
          onSubmit={this.handleSubmit}
          style={{ display: "flex", marginTop: "0" }}
          onKeyPress={this.handleFormKeyPress}
        >
          <div style={{ flexBasis: "50%" }}>
            <FormInput
              type="text"
              name="artistName"
              label="Artist Name"
              placeholder="Artist Name"
              style={{ fontSize: "21px" }}
              handleChange={this.handleChange}
              value={artistName}
              required
              border
            />
            <FormInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="First Name"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={firstName}
              required
              border
            />
            <FormInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={lastName}
              required
              border
            />
            <FormInput
              type="email"
              name="contactEmail"
              label="contact_email"
              placeholder="Contact Email"
              style={{ fontSize: "15px" }}
              value={contactEmail}
              required
              disabled
            />
            <FormInput
              type="email"
              name="paypalEmail"
              label="Paypal Email"
              placeholder="Paypal Email"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={paypalEmail}
              required
              border
            />
            <FormInput
              type="text"
              name="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={phoneNumber}
            />
            <FormInput
              type="text"
              name="socialFacebook"
              label="Facebook"
              placeholder="Facebook Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={socialFacebook}
            />
            <FormInput
              type="text"
              name="socialInstagram"
              label="Instagram"
              placeholder="Instagram Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={socialInstagram}
            />
            <FormInput
              type="text"
              name="socialTwitter"
              label="Twitter"
              placeholder="Twitter Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={socialTwitter}
            />
          </div>
          <div style={{ flexBasis: "50%", textAlign: "left", display: "flex" }}>
            <div
              style={{
                display: "inline-block",
                margin: "0 auto",
                minWidth: "233px",
              }}
            >
              <P>INTERNATIONAL?</P>
              <CheckboxesContainer>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={true}
                    checked={isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <Span>Yes</Span>
                </Label>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={false}
                    checked={!isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <Span>No</Span>
                </Label>
              </CheckboxesContainer>
              <div style={{ display: "flex" }}>
                <label>
                  <Checkbox
                    name="hasAcceptTerms"
                    checked={hasAcceptTerms}
                    onChange={this.handleCheckboxChange}
                    required
                  />
                </label>
                <Terms>
                  I have read and accepted <br />
                  <LinkToTerm to="/terms-and-conditions" target="_blank">
                    terms and conditions
                  </LinkToTerm>
                </Terms>
              </div>
              <ButtonMd type="submit" disabled={isDisableSubmit}>
                Create Profile
              </ButtonMd>
              <ButtonMd type="button" onClick={this.handleClick}>
                Cancel
              </ButtonMd>
              <span
                style={{
                  color: "red",
                  marginTop: "20px",
                  display: "inline-block",
                }}
              >
                *
              </span>
              required
            </div>
          </div>
        </Form>
      </SignUpContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  deleteUser: () => dispatch(deleteUserStart()),
  createArtistProfileStart: (reqBody) =>
    dispatch(createArtistProfileStart({ reqBody })),
  clearReduxArtistErrors: () => dispatch(clearArtistErrors()),
  artistErrorMsg: ({ ...errObj }) =>
    dispatch(artistProfileFailure({ ...errObj })),
  logOut: () => dispatch(logoutStart()),
});

const mapStateToProps = createStructuredSelector({
  userAccount: selectUserAccount,
  artistProfile: selectArtistProfile,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateArtist)
);
