import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { cleanFileName } from "../../utils";
import { selectArtistProfile } from "../../redux/artist/artist.selector";
import {
  selectSubmissionsErrorAlert,
  selectSubmissionsSuccessAlert,
} from "../../redux/submissions/submissions.selector";
import {
  submissionCreateStart,
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
  TabSubTitle,
  TabSubLink,
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
} from "./artist-submit-art.styles";

class ArtistSubmitArt extends Component {
  constructor(props) {
    super(props);

    this.artworkSubmissionForm = React.createRef();

    this.state = {
      artistName: "",
      title: "",
      description: "",
      artFileName: "UPLOAD ART FILE",
      artPreviewImg: "",
      artHasSubmitted: false,
      isDisableSubmit: false,
    };
  }

  static getDerivedStateFromProps(props) {
    const {
      artistProfile: { artistName },
    } = props;

    return {
      artistName,
    };
  }

  componentDidUpdate() {
    this._submissionMessages();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, isDisableSubmit: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this._submitArtwork();
    this.setState({
      isDisableSubmit: true,
    });
  };

  onChangeArtPreview = async (event) => {
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

    const artPreviewImg = await this._generatePreviewImg(file);
    this.setState({ artPreviewImg, isDisableSubmit: false });
  };

  onChangeArtFile = (event) => {
    let [file] = event.target.files;
    if (!file) return;

    const { name } = file;
    this.setState({ artFileName: cleanFileName(name), isDisableSubmit: false });
  };

  _submitArtwork = () => {
    const { submissionCreateStart } = this.props;
    const { elements } = this.artworkSubmissionForm.current;
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

    submissionCreateStart(formData);
    Swal.fire({
      icon: "warning",
      text:
        "Please be patient!!! Allow 1 - 3 minutes for upload. Don't close this window these are large files.",
      showConfirmButton: false,
    });

    this.setState({ artHasSubmitted: true });
  };

  _generatePreviewImg = (file) => {
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

  _resetForm = () => {
    const {
      artistProfile: { artistName },
    } = this.props;

    this.artworkSubmissionForm.current.reset();

    this.setState({
      artistName,
      title: "",
      description: "",
      artFileName: "UPLOAD ART FILE",
      artPreviewImg: "",
      artHasSubmitted: false,
      isDisableSubmit: false,
    });
  };

  _submissionMessages() {
    // Check Redux for messages

    const {
      submissionSuccessMsg,
      submissionSuccessAlertClear,
      submissionErrorMsg,
      submissionErrorAlertClear,
    } = this.props;

    if (!!submissionSuccessMsg) {
      Swal.fire({
        icon: "success",
        text: submissionSuccessMsg,
        showConfirmButton: false,
      });

      setTimeout(() => {
        submissionSuccessAlertClear();
        this._resetForm();
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
  }

  render() {
    const {
      artistName,
      title,
      description,
      isDisableSubmit,
      artPreviewImg,
      artHasSubmitted,
      artFileName,
    } = this.state;

    return (
      <SubmissionContainer>
        <TabHeader>
          <TabTitle>Submit Artwork</TabTitle>
          <TabSubLink to={`/artist/submissions/new`}>
            <TabSubTitle>Submissions</TabSubTitle>
          </TabSubLink>
        </TabHeader>
        <TabArea>
          <SubTitle>Create New Submission</SubTitle>
          <FormArtistSubmit
            onSubmit={this.handleSubmit}
            ref={this.artworkSubmissionForm}
          >
            <SubmitCard>
              <h4 style={{ color: "#6A6A6A" }}>Preview Image</h4>
              <label htmlFor="preview-art">
                <InputArtPreview
                  id="preview-art"
                  type="file"
                  name="previewArt"
                  onChange={this.onChangeArtPreview}
                  textAlign="center"
                  required
                >
                  {artPreviewImg ? (
                    <PreviewImage
                      src={this.state.artPreviewImg}
                      alt="Art Preview"
                    />
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
                  onChange={this.onChangeArtFile}
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
                  handleChange={this.handleChange}
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
                  handleChange={this.handleChange}
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
  }
}

const mapStateToProps = createStructuredSelector({
  artistProfile: selectArtistProfile,
  submissionErrorMsg: selectSubmissionsErrorAlert,
  submissionSuccessMsg: selectSubmissionsSuccessAlert,
});

const mapDispatchToProps = (dispatch) => ({
  submissionCreateStart: (formData) =>
    dispatch(submissionCreateStart({ formData })),
  submissionErrorAlertClear: () => dispatch(submissionErrorAlertClear()),
  submissionSuccessAlertClear: () => dispatch(submissionSuccessAlertClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistSubmitArt);
