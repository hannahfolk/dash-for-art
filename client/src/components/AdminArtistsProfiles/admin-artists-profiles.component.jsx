import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import axios from "axios";
import Swal from "sweetalert2";

import AutocompleteSearch from "../AutocompleteSearch";
import AdminArtistsProfileForm from "../AdminArtistsProfilesForm";
import AdminArtistsProfileComm from "../AdminArtistsProfilesComm";

import {
  SubmissionContainer,
  TabHeader,
  TabTitle,
  TabArea,
} from "../SharedStyle/styled";

const activeStyle = {
  backgroundColor: "white",
  color: "#6a6a6a",
};

const inactiveStyle = {
  backgroundColor: "#DEDDDD",
  color: "#fff",
};

const AdminArtistsProfiles = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [state, setState] = useState({
    search: "",
    id: 0,
    artistName: "",
    firstName: "",
    lastName: "",
    contactEmail: "",
    paypalEmail: "",
    phoneNumber: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    isInternational: "",
    isEditMode: false,
    isArtistFound: false,
  });
  const [tab, setTab] = useState({
    value: "profile",
    profileTabStyle: activeStyle,
    commissionsTabStyle: inactiveStyle,
  });

  const { token } = props;

  const {
    search,
    id,
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
    isEditMode,
    isArtistFound,
  } = state;

  const [dropdownArr, setDropdownArr] = useState([]);

  const { value, profileTabStyle, commissionsTabStyle } = tab;

  useEffect(
    () => {
      const artistName = _getArtistName();
      _getArtistProfile(artistName);
      _getAllArtistNames();
    },
    //eslint-disable-next-line
    []
  );

  const _getArtistName = () => {
    if (location.search !== "") {
      const artistName = decodeURIComponent(location.search.split("=")[1]);
      setState({ ...state, artistName });
      return artistName;
    } else {
      return "";
    }
  };

  // ---------FUNCTIONS FOR AUTOCOMPLETE SEARCH-------------
  const _getAllArtistNames = async () => {
    try {
      const { data } = await axios.get("/api/admin/artists-names", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      const dropdownArr = [
        {
          title: "Artist Name",
          elements: [],
        },
        {
          title: "Contact Email",
          elements: [],
        },
        {
          title: "Paypal Email",
          elements: [],
        },
      ];

      data.forEach((artist) => {
        if (artist.artistName !== "" || artist.artistName !== null) {
          dropdownArr[0].elements.push(artist.artistName);
        }
        if (artist.contactEmail !== "" || artist.contactEmail !== null) {
          dropdownArr[1].elements.push(artist.contactEmail);
        }
        if (artist.paypalEmail !== "" || artist.paypalEmail !== null) {
          dropdownArr[2].elements.push(artist.paypalEmail);
        }
      });

      setDropdownArr(dropdownArr);
    } catch (error) {
      Swal.fire("Something went wrong. Please try again.");
    }
  };

  const handleAutocompleteChange = (event, { newValue, method }) => {
    setState({
      search: newValue,
    });
  };

  const handleAutocompleteSearch = async (event) => {
    event.preventDefault();
    if (search !== "") {
      await _getArtistProfile(search);
    }
  };
  // ---------------------------------------------------------

  const _getArtistProfile = async (search) => {
    if (search !== "") {
      try {
        const {
          data: { artistProfile },
        } = await axios.post(
          "/api/admin/artists-profiles",
          {
            search,
          },
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        history.push({
          pathname: "/admin/artists-profiles",
          search: `?artist=${encodeURIComponent(artistProfile.artistName)}`,
        });

        setState({
          ...state,
          ...artistProfile,
          isArtistFound: true,
        });
      } catch (error) {
        Swal.fire("Artist not found.");
      }
    }
  };

  const _changeTab = (tab) => {
    switch (tab) {
      case "profile":
        setTab({
          value: "profile",
          profileTabStyle: activeStyle,
          commissionsTabStyle: inactiveStyle,
        });
        break;
      case "commissions":
        setTab({
          value: "commissions",
          profileTabStyle: inactiveStyle,
          commissionsTabStyle: activeStyle,
        });
        break;
      default:
        setTab({
          value: "profile",
          profileTabStyle: activeStyle,
          commissionsTabStyle: inactiveStyle,
        });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
      isEditMode: true,
    });
  };

  const handleToggleCheckbox = (event) => {
    const {
      name,
      dataset: { bool },
    } = event.target;
    const boolValue = bool.toLowerCase() === "true" ? true : false;
    setState({
      ...state,
      [name]: boolValue,
      isEditMode: true,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      await axios.put(
        "/api/admin/artists-profiles",
        {
          ...state,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Successfully saved your changes!",
      });
    } catch (error) {
      Swal.fire("Something went wrong. Please try again.");
    }

    setState({ ...state, isEditMode: false });
  };

  const sendResetEmail = async () => {
    try {
      await axios.post("/api/user/forgot-password", {
        contactEmail,
      });
      setState({
        ...state,
        successMessage: "Please check your inbox for the reset password email.",
        errorMessage: "",
      });
      Swal.fire({
        title: "Successfully sent the artist a reset password email!",
        icon: "success",
      });
    } catch (error) {
      setState({
        ...state,
        errorMessage:
          "Email address not found. Maybe you don't have an account with us.",
        successMessage: "",
      });
    }
  };

  const deleteArtist = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `${artistName} will be deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonColor: "#d33",
    }).then((response) => {
      if (response.value) {
        try {
          axios.delete(`/api/admin/artists-profiles/${id}`, {
            headers: {
              Authorization: `JWT ${token}`,
            },
          });
          Swal.fire({
            icon: "success",
            title: "Successfully deleted this artist!",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Unable to delete artist. Please try again.",
          });
        }
      } else {
        Swal.fire(`${artistName} was not deleted.`);
      }
    });
  };

  return (
    <SubmissionContainer>
      <TabArea>
        <AutocompleteSearch
          search={search}
          handleAutocompleteChange={handleAutocompleteChange}
          handleAutocompleteSearch={handleAutocompleteSearch}
          dropdownArr={dropdownArr}
          submitButton="Get Artist"
          placeholder="Type 'c'"
        />
        {isArtistFound ? (
          <>
            <TabHeader>
              <TabTitle
                onClick={() => _changeTab("profile")}
                style={profileTabStyle}
              >
                Profile
              </TabTitle>
              <TabTitle
                onClick={() => _changeTab("commissions")}
                style={commissionsTabStyle}
              >
                Commissions Summary
              </TabTitle>
            </TabHeader>
            <TabArea>
              {value === "profile" ? (
                <AdminArtistsProfileForm
                  artistName={artistName}
                  firstName={firstName}
                  lastName={lastName}
                  contactEmail={contactEmail}
                  paypalEmail={paypalEmail}
                  phoneNumber={phoneNumber}
                  socialFacebook={socialFacebook}
                  socialInstagram={socialInstagram}
                  socialTwitter={socialTwitter}
                  isInternational={isInternational}
                  handleChange={handleChange}
                  handleToggleCheckbox={handleToggleCheckbox}
                  handleSave={handleSave}
                  sendResetEmail={sendResetEmail}
                  deleteArtist={deleteArtist}
                  isEditMode={isEditMode}
                />
              ) : (
                <AdminArtistsProfileComm artistName={artistName} />
              )}
            </TabArea>
          </>
        ) : (
          ""
        )}
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminArtistsProfiles);
