import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import {
  selectUserAccount,
  selectUserJWTToken,
} from "../../redux/user/user.selector";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";
import { MainButton } from "../Button";
import EmailTemplate from "./email-template.component";
import LogHistory from "./log-history.component";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import SaveIcon from "@material-ui/icons/Save";
import { IconButton, MenuItem, Select } from "@material-ui/core";

import {
  TabArea,
  FilterHeader,
  AdjustableIconWrapper,
  ArtworkContainer,
  PreviewImage,
  ArtPreview,
  ArtFileButtonsWrapper,
  IconContainer,
  IconBottomSubtitle,
  SubmitCard,
  FormInputTitleStyled,
  TextAreaStyled,
  GreyTextArea,
  CaptionTitle,
  EmailStatus,
  DownloadLink,
  CenterButtonsWrapper,
} from "./admin-art-approval.styles";

const buttonAndTextFontStyle = {
  fontFamily:
    "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "15px",
  fontWeight: "bold",
};

const cntrTxtBtnsWithIcons = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const deleteArtFileBtnStyle = {
  fontSize: "10px",
  fontWeight: "normal",
  backgroundColor: "transparent",
  border: "1px solid #c23b22",
  color: "#c23b22",
  width: "150px",
  marginLeft: "5px",
};

const nextPreviousBtnStyle = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
};

const AdminArtApproval = (props) => {
  const {
    id,
    userAccount: { contactEmail },
    token,
    closeAdminArtApproval,
    flipLeft,
    flipRight,
    isFlipLeftDisabled,
    isFlipRightDisabled,
  } = props;

  const [state, setState] = useState({
    previewArt: "",
    artFile: "",
    isEnlargeImg: false,
    artistName: "",
    firstName: "",
    lastName: "",
    artistEmail: "",
    title: "",
    description: "",
    createdAt: "",
    status: "",
    isDisableSubmit: false,
  });
  const [previousDetails, setPreviousDetails] = useState({
    previousTitle: "",
    previousDescription: "",
    previousStatus: "",
    previousEmailStatus: "",
    previousEmailContent: "",
  });
  const [isArtFileDeleted, setIsArtFileDeleted] = useState(false);
  const [artPreviewImg, setArtPreviewImg] = useState("");
  const [artFileDownload, setArtFileDownload] = useState("");
  const [emailStatus, setEmailStatus] = useState("Not emailed");
  const [emailStatusColor, setEmailStatusColor] = useState({
    color: "#6a6a6a",
  });

  const {
    previewArt,
    artFile,
    isEnlargeImg,
    artistName,
    firstName,
    lastName,
    artistEmail,
    title,
    description,
    createdAt,
    status,
  } = state;
  const {
    previousTitle,
    previousDescription,
    previousStatus,
    previousEmailStatus,
    previousEmailContent,
  } = previousDetails;

  useEffect(
    () => {
      _loadArtwork();
    },
    //eslint-disable-next-line
    [id]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value, isDisableSubmit: false });
  };

  const handleSave = async () => {
    const timeOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    let logs = await _getLogs();

    if (logs !== null) {
      logs = JSON.parse(logs);
    } else {
      logs = [];
    }

    if (previousTitle !== title) {
      logs.push({
        logInfo: `${contactEmail} changed title from ${previousTitle} to ${title}`,
        logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
      });
    }
    if (previousDescription !== description) {
      logs.push({
        logInfo: `${contactEmail} changed description from ${previousDescription} to ${description}`,
        logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
      });
    }
    if (previousStatus !== status) {
      logs.push({
        logInfo: `${contactEmail} changed status from ${previousStatus} to ${status}`,
        logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
      });
    }

    logs = JSON.stringify(logs);

    try {
      await axios.put(
        `/api/admin/submissions`,
        { title, description, status, logs, id },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      setState({
        ...state,
        title,
        description,
        status,
      });

      if (status === "DECLINED") {
        _deleteDeclinedArtFileById();
      }

      Swal.fire({
        icon: "success",
        title: "Successfully saved your changes!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }

    setPreviousDetails({
      ...previousDetails,
      previousTitle: title,
      previousDescription: description,
      previousStatus: status,
    });
  };

  const changeEmailStatusColor = async (approvalType) => {
    if (approvalType !== "Not emailed") {
      try {
        const {
          data: {
            templateColor: { templateColor },
          },
        } = await axios.get(
          `/api/admin/settings/email-templates/get-template-color/${approvalType}`,
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );

        if (templateColor !== "") {
          setEmailStatusColor({ color: templateColor });
        }

        setEmailStatus(approvalType);
      } catch (error) {
        console.log(error);
        Swal.fire(
          "Something went wrong while getting email template colors. Please try again."
        );
      }
    }
  };

  const clickEnlargeImg = () => {
    setState({ ...state, isEnlargeImg: !isEnlargeImg });
  };

  const _loadArtwork = async () => {
    try {
      const submissionDetailsAll = await _getSubmittedArtwork();
      const {
        previewArt,
        artFile,
        title,
        description,
        status,
        emailStatus,
        emailContent,
        ...submissionDetails
      } = submissionDetailsAll;

      _loadPreviewArt(previewArt);
      // _loadArtFile(artFile);

      artFile === "" || artFile === null
        ? setIsArtFileDeleted(true)
        : setIsArtFileDeleted(false);
      changeEmailStatusColor(emailStatus);

      setState({
        ...state,
        ...submissionDetails,
        previewArt,
        artFile,
        title,
        description,
        status,
      });
      setEmailStatus(emailStatus);
      setPreviousDetails({
        previousTitle: title,
        previousDescription: description,
        previousStatus: status,
        previousEmailStatus: emailStatus,
        previousEmailContent: emailContent,
      });
      setArtFileDownload(artFile);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry something went wrong, Please check back later.",
        showConfirmButton: false,
      });
    }
  };

  // eslint-disable-next-line
  const _loadArtFile = async (artFile) => {
    try {
      const artFileDownload = await _createBlob(artFile);
      setArtFileDownload(artFileDownload);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry could not load PSD file",
        showConfirmButton: false,
      });
    }
  };

  const _loadPreviewArt = async (previewArt) => {
    if (!previewArt) {
      setArtPreviewImg(teefuryBirdLogo);
    } else {
      try {
        const largeThumb = `/api/art-submissions-thumb/?src=${previewArt.substring(
          20
        )}&w=500`;
        const artPreviewImg = await _createBlob(largeThumb);
        setArtPreviewImg(artPreviewImg);
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: "Sorry could not load art preview file",
          showConfirmButton: false,
        });
      }
    }
  };

  const _getSubmittedArtwork = async () => {
    const {
      data: { submissionDetails },
    } = await axios.get(`/api/admin/submissions/review/${id}`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    return submissionDetails;
  };

  const _createBlob = async (previewArt) => {
    return await fetch(previewArt, {
      headers: { Authorization: `JWT ${token}` },
    })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  };

  const _deleteDeclinedArtFileById = () => {
    axios.delete(`/api/admin/submissions/declined-art-file/${id}`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    setIsArtFileDeleted(true);
  };

  const _handleDeleteArtFileClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "The art file will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonColor: "#d33",
    }).then((response) => {
      if (response.value) {
        Swal.fire({
          title: "Poof! The art file has been deleted!",
          icon: "success",
        });
        _deleteDeclinedArtFileById();
      } else {
        Swal.fire("The art file was not deleted.");
      }
    });
  };

  const _getLogs = async () => {
    try {
      const { data } = await axios.get(`/api/admin/submissions/logs/${id}`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <TabArea>
        <FilterHeader>
          <AdjustableIconWrapper onClick={closeAdminArtApproval}>
            <HighlightOffIcon />
          </AdjustableIconWrapper>
        </FilterHeader>
        <ArtworkContainer>
          <SubmitCard>
            <h4 style={{ color: "#6A6A6A" }}>Preview Image</h4>
            {artPreviewImg ? (
              <PreviewImage
                src={artPreviewImg}
                alt="Art Preview"
                isEnlargeImg={isEnlargeImg}
                onClick={clickEnlargeImg}
              />
            ) : (
              <ArtPreview>
                <IconContainer>
                  <UploadIcon />
                </IconContainer>
                <IconBottomSubtitle style={{ position: "absolute" }}>
                  No Art Was Submitted
                </IconBottomSubtitle>
              </ArtPreview>
            )}
            <MainButton
              type="button"
              style={{ width: "250px" }}
              loaded={artPreviewImg}
              textAlign="center"
            >
              <DownloadLink href={artPreviewImg} download>
                {artPreviewImg ? "Download Preview Image" : <LoadingIcon />}
              </DownloadLink>
            </MainButton>
            <ArtFileButtonsWrapper>
              {isArtFileDeleted ? (
                <>
                  <MainButton
                    style={{
                      backgroundColor: "lightgrey",
                      cursor: "default",
                      width: "150px",
                    }}
                    disabled
                    textAlign="center"
                  >
                    Download Art File
                  </MainButton>
                  <MainButton
                    style={{
                      ...cntrTxtBtnsWithIcons,
                      ...deleteArtFileBtnStyle,
                      cursor: "default",
                    }}
                    disabled
                    textAlign="center"
                  >
                    <DoneIcon style={{ marginRight: "5px" }} /> Art File Deleted
                  </MainButton>
                </>
              ) : (
                <>
                  <MainButton
                    type="button"
                    style={{ width: "150px" }}
                    textAlign="center"
                  >
                    <DownloadLink
                      href={`http://${window.location.host}${artFileDownload}`}
                      download
                    >
                      {artFile ? "Download Art File" : <LoadingIcon />}
                    </DownloadLink>
                  </MainButton>
                  <MainButton
                    onClick={_handleDeleteArtFileClick}
                    style={{
                      ...cntrTxtBtnsWithIcons,
                      ...deleteArtFileBtnStyle,
                    }}
                    textAlign="center"
                  >
                    <DeleteIcon style={{ marginRight: "5px" }} /> Delete Art
                    File
                  </MainButton>
                </>
              )}
            </ArtFileButtonsWrapper>
          </SubmitCard>
          <SubmitCard style={{ maxWidth: "355px" }}>
            <h4 style={{ color: "#fff" }}>Description box</h4>
            <div>
              <CaptionTitle>Artist:</CaptionTitle>
              <GreyTextArea>@{artistName}</GreyTextArea>
              <CaptionTitle>Name:</CaptionTitle>
              <GreyTextArea style={{ fontSize: "15px" }}>
                {firstName} {lastName}
              </GreyTextArea>
              <CaptionTitle>Email:</CaptionTitle>
              <GreyTextArea style={{ fontSize: "15px" }}>
                {artistEmail}
              </GreyTextArea>
              <CaptionTitle>Title:</CaptionTitle>
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
              <CaptionTitle>Description:</CaptionTitle>
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
              <CaptionTitle>Submitted:</CaptionTitle>
              <GreyTextArea style={{ fontSize: "15px" }}>
                {new Date(createdAt).toLocaleString("en-US", {
                  timeZone: "GMT",
                })}
              </GreyTextArea>
              <CaptionTitle>Status:</CaptionTitle>
              <GreyTextArea>
                <Select
                  labelId="statusSelect"
                  id="statusSelect"
                  name="status"
                  value={status}
                  onChange={handleChange}
                  disableUnderline
                  style={{
                    ...buttonAndTextFontStyle,
                    width: "100%",
                  }}
                >
                  <MenuItem value={"NEW"} style={buttonAndTextFontStyle}>
                    NEW
                  </MenuItem>
                  <MenuItem value={"PENDING"} style={buttonAndTextFontStyle}>
                    PENDING
                  </MenuItem>
                  <MenuItem value={"REVIEWED"} style={buttonAndTextFontStyle}>
                    REVIEWED
                  </MenuItem>
                  <MenuItem value={"APPROVED"} style={buttonAndTextFontStyle}>
                    APPROVED
                  </MenuItem>
                  <MenuItem value={"DECLINED"} style={buttonAndTextFontStyle}>
                    DECLINED
                  </MenuItem>
                  <MenuItem value={"PUBLISHED"} style={buttonAndTextFontStyle}>
                    PUBLISHED
                  </MenuItem>
                </Select>
              </GreyTextArea>
              <EmailStatus
                style={{ ...emailStatusColor, marginBottom: "20px" }}
              >
                <MailOutlineIcon
                  style={{ marginRight: "5px", fontSize: "12px" }}
                />
                {emailStatus}
              </EmailStatus>
            </div>
            <CenterButtonsWrapper>
              <MainButton
                onClick={handleSave}
                style={cntrTxtBtnsWithIcons}
                textAlign="center"
              >
                <SaveIcon style={{ marginRight: "5px" }} />
                Save
              </MainButton>
            </CenterButtonsWrapper>
          </SubmitCard>
        </ArtworkContainer>
        <CenterButtonsWrapper>
          <IconButton
            onClick={flipLeft}
            style={nextPreviousBtnStyle}
            disabled={isFlipLeftDisabled}
          >
            <KeyboardArrowLeftIcon /> Previous
          </IconButton>
          <IconButton
            onClick={flipRight}
            style={nextPreviousBtnStyle}
            disabled={isFlipRightDisabled}
          >
            Next <KeyboardArrowRightIcon />
          </IconButton>
        </CenterButtonsWrapper>
        {previewArt ? (
          <EmailTemplate
            id={id}
            artistName={artistName}
            artistEmail={artistEmail}
            title={title}
            previewArt={previewArt}
            emailStatusColor={emailStatusColor}
            changeEmailStatusColor={changeEmailStatusColor}
            adminEmail={contactEmail}
            previousEmailStatus={previousEmailStatus}
            previousEmailContent={previousEmailContent}
          />
        ) : (
          ""
        )}
        {artistName ? <LogHistory id={id} /> : ""}
      </TabArea>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  userAccount: selectUserAccount,
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminArtApproval);
