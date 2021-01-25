import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { convertFromRaw } from "draft-js";
import axios from "axios";
import Swal from "sweetalert2";
import MUIRichTextEditor from "mui-rte";

import {
  MuiThemeProvider,
  ThemeProvider,
  makeStyles,
  withStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import { MainButton, BtnArtSubmitLoading } from "../Button";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";

import { MockEmailContainer, SelectWrapper } from "./admin-art-approval.styles";

const cntrTxtBtnsWithIcons = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#64add1",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 300,
  },
  emailForm: {
    width: "100%",
  },
}));

const defaultTheme = createMuiTheme();
const focusTheme = createMuiTheme();

Object.assign(defaultTheme, {
  overrides: {
    MUIRichTextEditor: {
      root: {
        marginTop: 20,
        marginBottom: 20,
        minHeight: 500,
        width: "calc(100% - 30px)",
        padding: "0px 14px 18.5px 14px",
        border: "1px solid #c4c4c4",
        borderRadius: 4,
      },
    },
  },
});

Object.assign(focusTheme, {
  overrides: {
    MUIRichTextEditor: {
      root: {
        marginTop: 20,
        marginBottom: 20,
        minHeight: 500,
        width: "calc(100% - 30px)",
        padding: "0px 14px 18.5px 14px",
        border: "1px solid #64add1",
        borderRadius: 4,
      },
    },
  },
});

const TealCheckbox = withStyles({
  root: {
    color: "#64add1",
    "&$checked": {
      color: "#64add1",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const EmailTemplate = (props) => {
  const {
    id,
    token,
    artistName,
    artistEmail,
    title,
    previewArt,
    changeEmailStatusColor,
    adminEmail,
    previousEmailStatus,
    previousEmailContent,
  } = props;
  const ref = useRef();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [templateFormObj, setTemplateFormObj] = useState({
    id: "",
    templateLabel: "",
    emailSubject: "",
    emailBody: "",
    templateColor: "",
    isPreviewImg: false,
  });
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [emailTemplateLabel, setEmailTemplateLabel] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [whichBtn, setWhichBtn] = useState("");

  const {
    templateLabel,
    emailSubject,
    templateColor,
    emailBody,
    isPreviewImg,
  } = templateFormObj;

  useEffect(() => {
    _getEmailTemplates();
    setEmailTemplateLabel("");
  }, 
  // eslint-disable-next-line
  [id]);

  const _getEmailTemplates = async () => {
    try {
      const {
        data: { emailTemplatesArr },
      } = await axios.get("/api/admin/settings/email-templates", {
        headers: { Authorization: `JWT ${token}` },
      });

      setEmailTemplates(emailTemplatesArr);
    } catch (error) {
      Swal.fire(
        "Something went wrong while getting email templates. Please try again."
      );
    }
  };

  const _changeBorderColor = (event) => {
    event === "focus" ? setIsFocused(true) : setIsFocused(false);
  };

  const _handleOnChange = async (event) => {
    const { value } = event.target;
    const {
      dataset: { id },
    } = event.currentTarget;

    setEmailTemplateLabel(value);

    if (value !== "") {
      try {
        const {
          data: {
            emailTemplate: {
              templateLabel,
              emailSubject,
              emailBody,
              templateColor,
              isPreviewImg,
            },
          },
        } = await axios.get(`/api/admin/settings/email-templates/${id}`, {
          headers: { Authorization: `JWT ${token}` },
        });

        const newEmailSubject = emailSubject
          .replace("{submission_title}", `${title}`)
          .replace("{artist_name}", `${artistName}`);
        const newEmailBody = emailBody
          .replace("{submission_title}", `${title}`)
          .replace("{artist_name}", `${artistName}`);

        setTemplateFormObj({
          id,
          templateLabel,
          emailSubject: newEmailSubject,
          emailBody: newEmailBody,
          templateColor,
          isPreviewImg,
        });
      } catch (error) {
        Swal.fire(
          "Something went wrong while getting an email template. Please try again."
        );
      }
    }
  };

  const _handleInputChange = (event) => {
    const { name, value } = event.target;

    console.log(value);
    setTemplateFormObj({
      ...templateFormObj,
      [name]: value,
    });
  };

  const _formatEmailAndLogs = async (data) => {
    const { blocks } = JSON.parse(data);
    const textArr = blocks.map((block) => block.text);

    for (let i = 0; i < textArr.length; i++) {
      textArr[i] = textArr[i].split("\n\n").join("<br/><br/>");
    }

    const text = textArr.join("<br/>");

    const emailContent = `to: ${artistEmail}<br/>subject: ${emailSubject}<br/>${text}`;
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

    if (previousEmailStatus !== emailTemplateLabel) {
      logs.push({
        type: "emailStatusChange",
        logInfo: `${adminEmail} changed emailStatus from ${previousEmailStatus} to ${emailTemplateLabel}`,
        logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
      });
    }
    if (previousEmailContent !== emailContent) {
      if (previousEmailContent === null) {
        logs.push({
          type: "emailContentChange",
          logInfo: `${adminEmail} sent "${emailTemplateLabel}" email to ${artistName}`,
          emailContent: {
            artistEmail,
            emailSubject,
            emailBody: text,
          },
          logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
        });
      } else {
        logs.push({
          type: "emailContentChange",
          logInfo: `${adminEmail} changed emailContent from ${previousEmailContent}`,
          emailContent: {
            artistEmail,
            emailSubject,
            emailBody: text,
          },
          logTimestamp: new Date().toLocaleTimeString("en-US", timeOptions),
        });
      }
    }

    logs = JSON.stringify(logs);
    _sendEmail(logs, text);
  };

  const _sendEmail = async (logs, text) => {
    const emailColor = { color: templateColor };
    const reqBody = {
      artistEmail,
      subject: emailSubject,
      emailColor,
      htmlContent: text,
      previewArt,
      isPreviewImg,
      emailStatus: templateLabel,
      logs,
    };

    setIsLoading(true);
    try {
      await axios.put(`/api/admin/email/${id}`, reqBody, {
        headers: { Authorization: `JWT ${token}` },
      });

      changeEmailStatusColor(emailTemplateLabel);

      Swal.fire({
        icon: "success",
        title: "Email Sent",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Email Not Sent",
      });
    }
    setIsLoading(false);
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

  const _handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setTemplateFormObj({ ...templateFormObj, isPreviewImg: checked });
  };

  const _saveTemplate = async (data) => {
    const content = convertFromRaw(JSON.parse(data));
    const {
      id,
      templateLabel,
      emailSubject,
      templateColor,
      isPreviewImg,
    } = templateFormObj;

    if (templateLabel && emailSubject && content.hasText()) {
      if (whichBtn === "Send Email") {
        // The function below also runs _sendEmail();
        _formatEmailAndLogs(data);
      } else {
        try {
          await axios.put(
            `/api/admin/settings/email-templates/${id}`,
            {
              templateLabel,
              emailSubject,
              emailBody: data,
              templateColor,
              isPreviewImg,
            },
            {
              headers: { Authorization: `JWT ${token}` },
            }
          );

          _getEmailTemplates();
          Swal.fire({
            icon: "success",
            title: "Successfully updated this template!",
          });
        } catch (error) {
          Swal.fire(
            "Something went wrong while saving this template. Please try again."
          );
        }
      }

      setTemplateFormObj({
        id,
        templateLabel,
        emailSubject,
        emailBody: data,
        templateColor,
        isPreviewImg,
      });
    }
  };

  const _setBtnRef = async (event) => {
    await setWhichBtn(event.target.textContent);
    ref.current.save();
  };

  return (
    <MockEmailContainer>
      <SelectWrapper>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="emailTemplateSelect">
            Choose a template to view/edit
          </InputLabel>
          <Select
            labelId="emailTemplateSelect"
            id="emailTemplateSelect"
            name="emailTemplate"
            value={emailTemplateLabel}
            onChange={_handleOnChange}
          >
            <MenuItem value={""}>
              <em>None</em>
            </MenuItem>
            {emailTemplates.map((template) => (
              <MenuItem
                key={template.id}
                value={template.templateLabel}
                data-id={template.id}
              >
                {template.templateLabel}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SelectWrapper>
      {emailTemplateLabel ? (
        <>
          <BtnArtSubmitLoading
            type="button"
            textAlign="center"
            style={{ width: "95px", height: "45px" }}
            onClick={_setBtnRef}
          >
            {isLoading ? <LoadingIcon /> : "Send Email"}
          </BtnArtSubmitLoading>
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <span>
              <b>To: </b>
            </span>
            {artistEmail}
            <br />
          </div>
          <FormControl className={classes.emailForm}>
            <ThemeProvider theme={theme}>
              <TextField
                id="emailSubject"
                label="Email Subject Line"
                name="emailSubject"
                value={emailSubject}
                variant="outlined"
                style={{ marginTop: "20px" }}
                onChange={_handleInputChange}
              />
            </ThemeProvider>
            {isFocused ? (
              <MuiThemeProvider theme={focusTheme}>
                <MUIRichTextEditor
                  label="Start typing..."
                  defaultValue={emailBody}
                  ref={ref}
                  controls={[
                    "title",
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "highlight",
                    "undo",
                    "redo",
                    "link",
                    "numberList",
                    "bulletList",
                  ]}
                  inlineToolbar={true}
                  onSave={_saveTemplate}
                  onBlur={() => _changeBorderColor("blur")}
                />
              </MuiThemeProvider>
            ) : (
              <MuiThemeProvider theme={defaultTheme}>
                <MUIRichTextEditor
                  label="Start typing..."
                  defaultValue={emailBody}
                  ref={ref}
                  controls={[
                    "title",
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "highlight",
                    "undo",
                    "redo",
                    "link",
                    "numberList",
                    "bulletList",
                  ]}
                  inlineToolbar={true}
                  onSave={_saveTemplate}
                  onFocus={() => _changeBorderColor("focus")}
                />
              </MuiThemeProvider>
            )}
            <FormControlLabel
              control={
                <TealCheckbox
                  checked={isPreviewImg}
                  onChange={_handleCheckboxChange}
                  name="isPreviewImg"
                />
              }
              label="Preview Image Attached"
            />
            <MainButton
              onClick={_setBtnRef}
              style={{
                width: "400px",
                ...cntrTxtBtnsWithIcons,
              }}
            >
              <SaveIcon style={{ marginRight: "5px" }} />
              Save this template for future use
            </MainButton>
          </FormControl>
        </>
      ) : (
        <h2>Choose an email template</h2>
      )}
    </MockEmailContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(EmailTemplate);
