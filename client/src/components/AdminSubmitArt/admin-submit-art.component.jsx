import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import axios from "axios";
import Swal from "sweetalert2";

import { cleanFileName } from "../../utils";
import {
  selectSubmissionsErrorAlert,
  selectSubmissionsSuccessAlert,
} from "../../redux/submissions/submissions.selector";
import {
  submissionErrorAlertClear,
  submissionSuccessAlertClear,
} from "../../redux/submissions/submissions.action";

import { ReactComponent as Upload } from "../../assets/upload.svg";
import { ReactComponent as Loading } from "../../assets/loading.svg";
import { InputArtFile, BtnArtSubmit, InputArtPreview } from "../Button";

import {
  SubmissionContainer,
  TabHeader,
  TabTitle,
  TabArea,
  SubTitle,
  FormArtistSubmit,
  SubmitCard,
  ArtPreview,
  IconContainer,
  IconTopSubtitle,
  IconBottomSubtitle,
  PreviewImage,
  FormInputArtistStyled,
  FormInputTitleStyled,
  TextAreaStyled,
} from "./admin-submit-art.styles";

const AdminSubmitArt = (props) => {
  const location = useLocation();
  const artworkSubmissionForm = useRef();
  const {
    token,
    submissionSuccessMsg,
    submissionSuccessAlertClear,
    submissionErrorMsg,
    submissionErrorAlertClear,
  } = props;
  const [state, setState] = useState({
    artistName: "",
    contactEmail: "",
    title: "",
    description: "",
    artFileName: "UPLOAD ART FILE",
    artPreviewImg: "",
    artHasSubmitted: false,
    isDisableSubmit: false,
  });

  const {
    artistName,
    contactEmail,
    title,
    description,
    artFileName,
    artPreviewImg,
    artHasSubmitted,
    isDisableSubmit,
  } = state;

  useEffect(() => {
    _getArtistName();
    _submissionMessages();
  }, 
  //eslint-disable-next-line
  []);

  const _getArtistName = async () => {
    const artistName = decodeURIComponent(location.search.split("=")[1]);
    setState({ ...state, artistName });

    await _getArtistContactEmail(artistName);
  };

  const _getArtistContactEmail = async (artistName) => {
    try {
      const {
        data: {
          artistProfile: { contactEmail },
        },
      } = await axios.post(
        "/api/admin/artists-profiles",
        {
          search: artistName,
        },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      setState({ ...state, artistName, contactEmail });
    } catch (error) {
      Swal.fire("Something went wrong. Please try again.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value, isDisableSubmit: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    _submitArtwork();
    setState({
      ...state,
      isDisableSubmit: true,
    });
  };

  const onChangeArtPreview = async (event) => {
    const [file] = event.target.files;

    if (!file) return;
    // Make sure `file.name` matches our extensions criteria
    if (!/\.(jpe?g|png)$/i.test(file.name)) return;

    // Make sure `file.size` does not exceed 100 kb
    if (file.size > 1000000) {
      Swal.fire({
        icon: "error",
        text:
          "Sorry your file is too large! Please limit your image size to less than 1MB.",
        showConfirmButton: true,
      });

      return;
    }

    const artPreviewImg = await _generatePreviewImg(file);
    setState({ ...state, artPreviewImg, isDisableSubmit: false });
  };

  const onChangeArtFile = (event) => {
    let [file] = event.target.files;
    if (!file) return;

    const { name } = file;
    setState({
      ...state,
      artFileName: cleanFileName(name),
      isDisableSubmit: false,
    });
  };

  const _submitArtwork = () => {
    const { elements } = artworkSubmissionForm.current;
    const inputsDOM = Array.from(elements);

    const formData = new FormData();

    inputsDOM.forEach((el) => {
      const { files, name, value } = el;
      if (files) {
        formData.append(name, files[0]);
      } else if (value) {
        formData.append(name, value);
      }
    });

    formData.append("contactEmail", contactEmail);

    Swal.fire({
      icon: "warning",
      text:
        "Please be patient!!! Don't close this window these are large files.",
      showConfirmButton: false,
    });

    try {
      axios.post("/api/admin/submit-artwork", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `JWT ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        text: `The artwork was successfully submitted for ${artistName}!`,
      });
      _resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong. Please try again.",
      });
    }

    setState({ ...state, artHasSubmitted: true });
  };

  const _generatePreviewImg = (file) => {
    return new Promise((resolve, reject) => {
      const loadImg = () => {
        reader.removeEventListener("load", loadImg);
        reader.removeEventListener("error", loadError);
        resolve(reader.result);
      };

      const loadError = (event) => {
        reader.removeEventListener("load", loadImg);
        reader.removeEventListener("error", loadError);
        reject(event);
      };

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", loadImg);
      reader.addEventListener("error", loadError);
    });
  };

  const _resetForm = () => {
    artworkSubmissionForm.current.reset();

    setState({
      artistName,
      title: "",
      description: "",
      artFileName: "UPLOAD ART FILE",
      artPreviewImg: "",
      artHasSubmitted: false,
      isDisableSubmit: false,
    });
  };

  const _submissionMessages = () => {
    // Check Redux for messages
    if (!!submissionSuccessMsg) {
      Swal.fire({
        icon: "success",
        text: submissionSuccessMsg,
        showConfirmButton: false,
      });

      setTimeout(() => {
        submissionSuccessAlertClear();
        _resetForm();
      }, 2000);
    } else if (!!submissionErrorMsg) {
      Swal.fire({
        icon: "error",
        text: submissionErrorMsg,
        showConfirmButton: false,
      });

      setTimeout(() => {
        submissionErrorAlertClear();
      }, 2000);
    }
  };

  return (
    <SubmissionContainer>
      <TabHeader>
        <TabTitle>Submit Artwork</TabTitle>
      </TabHeader>
      <TabArea>
        <SubTitle>Create New Submission</SubTitle>
        <FormArtistSubmit onSubmit={handleSubmit} ref={artworkSubmissionForm}>
          <SubmitCard>
            <h4 style={{ color: "#6A6A6A" }}>Preview Image</h4>
            <label htmlFor="preview-art">
              <InputArtPreview
                id="preview-art"
                type="file"
                name="previewArt"
                onChange={onChangeArtPreview}
                textAlign="center"
                required
              >
                {artPreviewImg ? (
                  <PreviewImage src={artPreviewImg} alt="Art Preview" />
                ) : (
                  <ArtPreview>
                    <IconContainer>
                      <Upload />
                    </IconContainer>
                    <IconTopSubtitle>Click to upload images</IconTopSubtitle>
                    <IconBottomSubtitle style={{ position: "absolute" }}>
                      Preview images must be under 1MB <br />
                      Recommendation .png or .jpg
                    </IconBottomSubtitle>
                  </ArtPreview>
                )}
              </InputArtPreview>
            </label>
            <label htmlFor="art-file">
              <InputArtFile
                id="art-file"
                type="file"
                name="artFile"
                onChange={onChangeArtFile}
                textAlign="center"
                required
              >
                {artFileName}
              </InputArtFile>
            </label>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IconTopSubtitle>
                Can be a large file <br />
                ai, psd, or eps at 300 dpi
              </IconTopSubtitle>
            </div>
          </SubmitCard>
          <SubmitCard>
            <h4 style={{ color: "#fff" }}>Description box </h4>
            <div>
              <FormInputArtistStyled
                type="text"
                name="artistName"
                label="artist_name"
                data-lpignore="true"
                value={artistName}
                readOnly
              />
              <FormInputTitleStyled
                type="text"
                name="title"
                label="title"
                placeholder="TITLE"
                data-lpignore="true"
                autoComplete="off"
                handleChange={handleChange}
                value={title}
                maxlength="180"
                required
              />
              <TextAreaStyled
                type="text"
                name="description"
                label="Description"
                placeholder="DESCRIPTION"
                data-lpignore="true"
                autoComplete="off"
                handleChange={handleChange}
                value={description}
                maxlength="255"
                required
              />
              {artHasSubmitted ? (
                <BtnArtSubmit
                  type="submit"
                  disabled={true}
                  textAlign="right"
                  style={{
                    backgroundColor: "#0B7C80",
                    cursor: "pointer",
                    width: "95px",
                    height: "45px",
                    padding: "0",
                  }}
                >
                  <Loading />
                </BtnArtSubmit>
              ) : (
                <BtnArtSubmit
                  type="submit"
                  disabled={isDisableSubmit}
                  textAlign="right"
                  style={{ backgroundColor: "#0B7C80", cursor: "pointer" }}
                >
                  Submit
                </BtnArtSubmit>
              )}
            </div>
          </SubmitCard>
        </FormArtistSubmit>
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
  submissionErrorMsg: selectSubmissionsErrorAlert,
  submissionSuccessMsg: selectSubmissionsSuccessAlert,
});

const mapDispatchToProps = (dispatch) => ({
  submissionErrorAlertClear: () => dispatch(submissionErrorAlertClear()),
  submissionSuccessAlertClear: () => dispatch(submissionSuccessAlertClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminSubmitArt);
