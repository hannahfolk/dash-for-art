import React, { useRef } from "react";
import { Link } from "react-router-dom";

import SaveIcon from "@material-ui/icons/Save";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import CropOriginalIcon from "@material-ui/icons/CropOriginal";
import DeleteIcon from "@material-ui/icons/Delete";

import { MainButton } from "../Button";
import {
  Checkbox,
  Label,
  CheckboxesContainer,
} from "../CheckBox/checkbox.component";

import { ProfileForm, FormInputStyled } from "./admin-artists-profiles-form.styles";

const cntrTxtBtnsWithIcons = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const deleteArtistBtnStyle = {
  backgroundColor: "transparent",
  border: "1px solid #c23b22",
  color: "#c23b22",
};

const AdminArtistsProfilesForm = (props) => {
  const profileFormRef = useRef();

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
    handleChange,
    handleToggleCheckbox,
    handleSave,
    sendResetEmail,
    deleteArtist,
    isEditMode,
  } = props;

  return (
    <div style={{ marginLeft: "20px" }}>
      <ProfileForm ref={profileFormRef}>
        <FormInputStyled
          type="text"
          name="artistName"
          label="Artist Name"
          isShowLabel={true}
          value={artistName || ""}
          handleChange={handleChange}
          required
        />
        <FormInputStyled
          type="text"
          name="firstName"
          label="First Name"
          isShowLabel={true}
          placeholder="First Name"
          value={firstName || ""}
          handleChange={handleChange}
          required
        />
        <FormInputStyled
          type="text"
          name="lastName"
          label="Last Name"
          isShowLabel={true}
          placeholder="Last Name"
          value={lastName || ""}
          handleChange={handleChange}
          required
        />
        <FormInputStyled
          type="email"
          name="contactEmail"
          label="Contact Email"
          isShowLabel={true}
          value={contactEmail || ""}
          handleChange={handleChange}
          required
        />
        <FormInputStyled
          type="email"
          name="paypalEmail"
          isShowLabel={true}
          label="Paypal Email"
          placeholder="Paypal Email"
          value={paypalEmail || ""}
          handleChange={handleChange}
          required
        />
        <FormInputStyled
          type="text"
          name="phoneNumber"
          label="Phone Number"
          isShowLabel={true}
          placeholder="Phone Number"
          value={phoneNumber || ""}
          handleChange={handleChange}
          required
        />
        <FormInputStyled
          type="text"
          name="socialFacebook"
          label="Facebook"
          isShowLabel={true}
          placeholder="Facebook Handle"
          value={socialFacebook || ""}
          handleChange={handleChange}
        />
        <FormInputStyled
          type="text"
          name="socialInstagram"
          label="Instagram"
          isShowLabel={true}
          placeholder="Instagram Handle"
          value={socialInstagram || ""}
          handleChange={handleChange}
        />
        <FormInputStyled
          type="text"
          name="socialTwitter"
          label="Twitter"
          isShowLabel={true}
          placeholder="Twitter Handle"
          value={socialTwitter || ""}
          handleChange={handleChange}
        />
        <div style={{ display: "flex" }}>
          <p style={{ marginRight: "15px", width: "150px" }}>International?</p>
          <CheckboxesContainer
            style={{ marginBottom: "0px", marginTop: "16px" }}
          >
            <Label style={{ width: "100px" }}>
              <Checkbox
                name="isInternational"
                data-bool={true}
                checked={isInternational}
                onChange={handleToggleCheckbox}
              />
              <span>Yes</span>
            </Label>
            <Label style={{ width: "100px" }}>
              <Checkbox
                name="isInternational"
                data-bool={false}
                checked={!isInternational}
                onChange={handleToggleCheckbox}
              />
              <span>No</span>
            </Label>
          </CheckboxesContainer>
        </div>
        {isEditMode ? (
          <MainButton onClick={handleSave} style={cntrTxtBtnsWithIcons}>
            <SaveIcon style={{ marginRight: "5px" }} />
            Save
          </MainButton>
        ) : (
          ""
        )}
      </ProfileForm>
      <MainButton
        onClick={sendResetEmail}
        style={{
          ...cntrTxtBtnsWithIcons,
          width: "340px",
          marginTop: "0px",
        }}
        textAlign="center"
      >
        <MailOutlineIcon style={{ marginRight: "5px" }} />
        Send Reset Password Email
      </MainButton>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Link to={`/admin/art-submissions?artist=${artistName}`}>
          <MainButton
            style={{
              ...cntrTxtBtnsWithIcons,
              width: "160px",
              float: "left",
              marginRight: "20px",
            }}
            textAlign="center"
          >
            <CropOriginalIcon style={{ marginRight: "5px" }} />
            Submit Artwork
          </MainButton>
        </Link>
        <MainButton
          onClick={deleteArtist}
          style={{
            ...cntrTxtBtnsWithIcons,
            ...deleteArtistBtnStyle,
            width: "160px",
            float: "left",
          }}
          textAlign="center"
        >
          <DeleteIcon style={{ marginRight: "5px" }} />
          Delete Artist
        </MainButton>
      </div>
    </div>
  );
};

export default AdminArtistsProfilesForm;
