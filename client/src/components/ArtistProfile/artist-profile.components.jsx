import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import {
  areArtistFormFieldsValid,
  areUserUpdateFormFieldsValid,
} from "../../utils";
import { selectUserAccount } from "../../redux/user/user.selector";
import {
  updateUserStart,
  clearUserError,
  updateUserFailure,
  logoutStart,
} from "../../redux/user/user.action";
import { selectArtistProfile } from "../../redux/artist/artist.selector";
import {
  getArtistProfileStart,
  updateArtistProfileStart,
  clearArtistErrors,
  artistProfileFailure,
} from "../../redux/artist/artist.action";

import { ButtonLgCenter, ButtonSm } from "../Button";
import {
  Checkbox,
  Label,
  CheckboxesContainer,
} from "../CheckBox/checkbox.component";
import { ReactComponent as EnvelopeIcon } from "../../assets/envelope.svg";
import ArtistErrMsg from "../ArtistErrMsg";
import { UserErrorMessages } from "../ErrorMsgs";

import {
  ArtistProfileContainer,
  ProfileImg,
  ArtistName,
  FullName,
  ProfileForm,
  ProfileInfo,
  FormInputStyled,
} from "./artist-profile.styles";
import logo from "../../assets/logo.png";

class ArtistProfile extends Component {
  constructor(props) {
    super(props);

    this.artistProfileForm = React.createRef();

    this.state = {
      // Artist Profile
      artistName: "",
      firstName: "",
      lastName: "",
      paypalEmail: "",
      phoneNumber: "",
      socialFacebook: "",
      socialInstagram: "",
      socialTwitter: "",
      isInternational: "",
      // User Details
      newContactEmail: "",
      contactEmail: "",
      newPassword: "",
      confirmPassword: "",
      // Boolean Modes
      isEditMode: false,
      hasArtistFromSaved: false,
      isDisableArtistSubmit: true,
      hasUserFormSaved: false,
      isDisableUserSubmit: true,
    };
  }

  static getDerivedStateFromProps(props) {
    const { userAccount } = props;
    return {
      contactEmail:
        userAccount && userAccount.contactEmail ? userAccount.contactEmail : "",
    };
  }

  componentDidMount() {
    const { userAccount, artistProfile } = this.props;
    if (this._redirectUser(userAccount, artistProfile)) {
      this.setState({ ...artistProfile });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { userAccount, artistProfile } = nextProps;
    return this._redirectUser(userAccount, artistProfile);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      hasArtistFromSaved: false,
      isDisableArtistSubmit: false,
      hasUserFormSaved: false,
      isDisableUserSubmit: false,
    });
  };

  handleSubmitArtistForm = (event) => {
    event.preventDefault();
    const { isDisableArtistSubmit } = this.state;
    if (isDisableArtistSubmit) {
      Swal.fire({
        icon: "error",
        text: "You didn't change anything...",
      });
    } else {
      this._updateArtistProfile();
    }
  };

  handleSubmitUserForm = (event) => {
    event.preventDefault();
    const { newContactEmail, newPassword, isDisableUserSubmit } = this.state;
    if ((!!newContactEmail || !!newPassword) && !isDisableUserSubmit) {
      this._updateUserAccount();
    } else {
      Swal.fire({
        icon: "error",
        text: "No fields were changed",
      });
    }
  };

  handleClickOpenForm = () => {
    const {
      getArtistProfileStart,
      clearReduxArtistErrors,
      clearReduxUserErrors,
    } = this.props;

    getArtistProfileStart();
    clearReduxArtistErrors();
    clearReduxUserErrors();

    this.setState({ isEditMode: true });
  };

  handleClickCloseForm = (event) => {
    event.preventDefault();
    const { artistProfile } = this.props;
    this.setState({
      ...artistProfile,
      isEditMode: false,
      hasArtistFromSaved: false,
      isDisableArtistSubmit: false,
      hasUserFormSaved: false,
      isDisableUserSubmit: false,
    });
  };

  handleToggleCheckBox = (event) => {
    const {
      name,
      dataset: { bool },
    } = event.target;
    const boolValue = bool.toLowerCase() === "true" ? true : false;
    this.setState({
      [name]: boolValue,
      hasArtistFromSaved: false,
      isDisableArtistSubmit: false,
    });
  };

  handleScrollToElement(scrollTo) {
    window.scrollTo(0, scrollTo);
  }

  _updateArtistProfile = () => {
    const {
      artistName,
      firstName,
      lastName,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
    } = this.state;

    const {
      updateArtistProfileStart,
      clearReduxArtistErrors,
      artistErrorMsg,
    } = this.props;

    const reqBody = {
      artistName: artistName.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      paypalEmail: paypalEmail ? paypalEmail.trim() : "",
      phoneNumber: phoneNumber ? phoneNumber.trim() : "",
      socialFacebook: socialFacebook ? socialFacebook.trim() : "",
      socialInstagram: socialInstagram ? socialInstagram.trim() : "",
      socialTwitter: socialTwitter ? socialTwitter.trim() : "",
      isInternational,
      hasAcceptTerms: true,
    };

    const doesFormHaveErrors = areArtistFormFieldsValid(reqBody);

    clearReduxArtistErrors();

    if (doesFormHaveErrors) {
      const { errorMessages } = doesFormHaveErrors;
      this.setState({
        isDisableArtistSubmit: true,
      });
      artistErrorMsg(errorMessages);
      this.handleScrollToElement(this.artistProfileForm.current.offsetTop);
    } else {
      this.setState({ hasArtistFromSaved: true });
      updateArtistProfileStart(reqBody);
      Swal.fire({
        icon: "success",
        title: "Your profile has been updated!",
      });
    }
  };

  _updateUserAccount = () => {
    const { newContactEmail, newPassword, confirmPassword } = this.state;

    const {
      updateUserStart,
      clearReduxUserErrors,
      updateUserFailure,
    } = this.props;

    const reqBody = {
      newContactEmail: newContactEmail.trim(),
      newPassword: newPassword.trim(),
      confirmPassword: confirmPassword.trim(),
    };

    const doesFormHaveErrors = areUserUpdateFormFieldsValid(reqBody);

    clearReduxUserErrors();

    if (doesFormHaveErrors) {
      const { errorMessages } = doesFormHaveErrors;
      this.setState({
        isDisableUserSubmit: true,
      });
      updateUserFailure({ messages: errorMessages });
    } else {
      updateUserStart(reqBody);
      this.setState({
        hasUserFormSaved: true,
        newContactEmail: "",
        newPassword: "",
        confirmPassword: "",
      });
      Swal.fire({
        icon: "success",
        title: "Your Account has been updated!",
      });
    }
  };

  _redirectUser = (userAccount, artistProfile) => {
    const { history, logOut } = this.props;
    const hasCreatedUserAccount =
      userAccount && userAccount.contactEmail ? true : false;
    const hasCreatedArtistProfile =
      artistProfile && artistProfile.artistName ? true : false;

    if (hasCreatedUserAccount) {
      if (hasCreatedArtistProfile) {
        return true;
      } else {
        history.push("/artist/create");
        return false;
      }
    } else {
      logOut();
      history.push("/");
      return false;
    }
  };

  render() {
    const {
      // Artist Profile
      artistName,
      firstName,
      lastName,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
      // User Details
      newContactEmail,
      contactEmail,
      newPassword,
      confirmPassword,
      // Boolean Modes
      isEditMode,
      hasArtistFromSaved,
      hasUserFormSaved,
    } = this.state;

    return (
      <ArtistProfileContainer>
        <ProfileImg
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: "150px",
            backgroundPosition: "center",
          }}
        />
        {isEditMode ? (
          <>
            <ProfileForm ref={this.artistProfileForm}>
              <ArtistErrMsg>Artist Profile</ArtistErrMsg>
              <FormInputStyled
                type="text"
                name="artistName"
                label="Artist Name"
                isShowLabel={true}
                value={artistName}
                readOnly
                style={{ cursor: "not-allowed" }}
              />
              <FormInputStyled
                type="text"
                name="firstName"
                label="First Name"
                isShowLabel={true}
                placeholder="First Name"
                handleChange={this.handleChange}
                value={firstName}
                required
              />
              <FormInputStyled
                type="text"
                name="lastName"
                label="Last Name"
                isShowLabel={true}
                placeholder="Last Name"
                handleChange={this.handleChange}
                value={lastName}
                required
              />
              <FormInputStyled
                type="email"
                name="paypalEmail"
                isShowLabel={true}
                label="Paypal Email"
                placeholder="Paypal Email"
                handleChange={this.handleChange}
                value={paypalEmail}
                required
              />
              <FormInputStyled
                type="text"
                name="phoneNumber"
                label="Phone Number"
                isShowLabel={true}
                placeholder="Phone Number"
                handleChange={this.handleChange}
                value={phoneNumber}
                required
              />
              <FormInputStyled
                type="text"
                name="socialFacebook"
                label="Facebook"
                isShowLabel={true}
                placeholder="Facebook Handle"
                handleChange={this.handleChange}
                value={socialFacebook}
              />
              <FormInputStyled
                type="text"
                name="socialInstagram"
                label="Instagram"
                isShowLabel={true}
                placeholder="Instagram Handle"
                handleChange={this.handleChange}
                value={socialInstagram}
              />
              <FormInputStyled
                type="text"
                name="socialTwitter"
                label="Twitter"
                isShowLabel={true}
                placeholder="Twitter Handle"
                handleChange={this.handleChange}
                value={socialTwitter}
              />
              <p>INTERNATIONAL?</p>
              <CheckboxesContainer>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={true}
                    checked={isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <span>Yes</span>
                </Label>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={false}
                    checked={!isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <span>No</span>
                </Label>
              </CheckboxesContainer>
              {hasArtistFromSaved ? (
                <>
                  <ButtonSm disabled={true}>Saved!</ButtonSm>
                  <ButtonSm onClick={this.handleClickCloseForm}>X</ButtonSm>
                </>
              ) : (
                <>
                  <ButtonSm type="submit" onClick={this.handleSubmitArtistForm}>
                    Save Artist Profile
                  </ButtonSm>
                  <ButtonSm type="button" onClick={this.handleClickCloseForm}>
                    X
                  </ButtonSm>
                </>
              )}
            </ProfileForm>
            <ProfileForm>
              <UserErrorMessages>Account Information</UserErrorMessages>
              <FormInputStyled
                type="text"
                name="newContactEmail"
                label="Contact Email"
                isShowLabel={true}
                handleChange={this.handleChange}
                value={newContactEmail}
                placeholder={contactEmail}
                required
              />
              <FormInputStyled
                type="password"
                name="newPassword"
                label="New Password"
                isShowLabel={true}
                handleChange={this.handleChange}
                value={newPassword}
              />
              <FormInputStyled
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                isShowLabel={true}
                handleChange={this.handleChange}
                value={confirmPassword}
              />
              {hasUserFormSaved ? (
                <>
                  <ButtonSm disabled={true}>Saved!</ButtonSm>
                  <ButtonSm onClick={this.handleClickCloseForm}>X</ButtonSm>
                </>
              ) : (
                <>
                  <ButtonSm type="submit" onClick={this.handleSubmitUserForm}>
                    Save User Details
                  </ButtonSm>
                  <ButtonSm type="button" onClick={this.handleClickCloseForm}>
                    X
                  </ButtonSm>
                </>
              )}
            </ProfileForm>
          </>
        ) : (
          <>
            <ArtistName>@{artistName}</ArtistName>
            <FullName>{`${firstName} ${lastName}`}</FullName>

            <ProfileInfo>
              <EnvelopeIcon />
              {contactEmail}
            </ProfileInfo>
            <ButtonLgCenter onClick={this.handleClickOpenForm}>
              EDIT PROFILE
            </ButtonLgCenter>
          </>
        )}
      </ArtistProfileContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  userAccount: selectUserAccount,
  artistProfile: selectArtistProfile,
});

const mapDispatchToProps = (dispatch) => ({
  getArtistProfileStart: () => dispatch(getArtistProfileStart()),
  updateArtistProfileStart: (reqBody) =>
    dispatch(updateArtistProfileStart({ reqBody })),
  clearReduxArtistErrors: () => dispatch(clearArtistErrors()),
  updateUserStart: (reqBody) => dispatch(updateUserStart({ reqBody })),
  clearReduxUserErrors: () => dispatch(clearUserError()),
  updateUserFailure: ({ ...errObj }) =>
    dispatch(updateUserFailure({ ...errObj })),
  artistErrorMsg: ({ ...errObj }) =>
    dispatch(artistProfileFailure({ ...errObj })),
  logOut: () => dispatch(logoutStart()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ArtistProfile)
);
