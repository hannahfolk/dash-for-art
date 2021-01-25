import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectUserJWTToken } from "../../redux/user/user.selector";

import { convertFromRaw } from "draft-js";
import axios from "axios";
import Swal from "sweetalert2";

import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import EmailForm from "./email-template-form";
import { SettingsButton } from "../Button";

import { SelectWrapper } from "./admin-settings.styles";

const cntrTxtBtnsWithIcons = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 300,
  },
}));

const EmailTemplateSettings = (props) => {
  const { token } = props;
  const ref = useRef();
  const classes = useStyles();
  const [templateFormObj, setTemplateFormObj] = useState({
    id: "",
    templateLabel: "",
    emailSubject: "",
    emailBody: "",
    templateColor: "",
    isPreviewImg: false,
  });
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    addOrSave: "add",
  });
  const [emailTemplateLabel, setEmailTemplateLabel] = useState("");

  const { addOrSave } = state;

  useEffect(
    () => {
      _getEmailTemplates();
    },
    //eslint-disable-next-line
    []
  );

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

        setOpen(true);
        setState({
          addOrSave: "save",
        });
        setTemplateFormObj({
          id,
          templateLabel,
          emailSubject,
          emailBody,
          templateColor,
          isPreviewImg,
        });
      } catch (error) {
        Swal.fire(
          "Something went wrong while getting an email template. Please try again."
        );
      }
    } else {
      setOpen(false);
    }
  };

  const _handleAddTemplateClick = () => {
    setOpen(true);
    setState({
      addOrSave: "add",
    });
    setTemplateFormObj({
      ...templateFormObj,
      templateLabel: "",
      emailSubject: "",
      emailBody: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setTemplateFormObj({
      ...templateFormObj,
      [name]: value,
    });
  };

  const handleColorChange = (templateColor) => {
    setTemplateFormObj({
      ...templateFormObj,
      templateColor,
    });
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setTemplateFormObj({ ...templateFormObj, isPreviewImg: checked });
  };

  const setSubmitTemplateBtnRef = () => {
    ref.current.save();
  };

  const saveTemplate = async (data) => {
    const content = convertFromRaw(JSON.parse(data));
    const {
      id,
      templateLabel,
      emailSubject,
      templateColor,
      isPreviewImg,
    } = templateFormObj;

    if (templateLabel && emailSubject && content.hasText()) {
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
        })
      } catch (error) {
        Swal.fire(
          "Something went wrong while saving this template. Please try again."
        );
      }
    }
  };

  const addTemplate = async (data) => {
    const content = convertFromRaw(JSON.parse(data));
    const {
      templateLabel,
      emailSubject,
      templateColor,
      isPreviewImg,
    } = templateFormObj;

    if (templateLabel && emailSubject && content.hasText()) {
      try {
        await axios.post(
          "/api/admin/settings/email-templates",
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

        setTemplateFormObj({
          ...templateFormObj,
          templateLabel: "",
          emailSubject: "",
          emailBody: "",
          isPreviewImg: false,
        });
        setOpen(false);
        _getEmailTemplates();
        Swal.fire({
          icon: "success",
          title: "Successfully added this template!",
        })
      } catch (error) {
        Swal.fire(
          "Something went wrong while adding a template. Please try again."
        );
      }
    }
  };

  const deleteTemplate = async (event) => {
    event.preventDefault();
    const { id } = templateFormObj;

    try {
      await axios.delete(`/api/admin/settings/email-templates/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });

      setTemplateFormObj({
        ...templateFormObj,
        templateLabel: "",
        emailSubject: "",
        emailBody: "",
      });
      setEmailTemplateLabel("");
      _getEmailTemplates();
      Swal.fire({
        icon: "success",
        title: "Successfully deleted this template!",
      })
    } catch (error) {
      Swal.fire(
        "Something went wrong while saving this template. Please try again."
      );
    }
  };

  return (
    <div>
      <h1>Email Templates</h1>
      <SettingsButton
        onClick={_handleAddTemplateClick}
        style={{
          width: "200px",
          height: "56px",
          borderRadius: "4px",
          ...cntrTxtBtnsWithIcons,
        }}
      >
        <AddIcon style={{ marginRight: "5px" }} /> Add a template
      </SettingsButton>
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
      {open ? (
        <EmailForm
          ref={ref}
          handleInputChange={handleInputChange}
          handleColorChange={handleColorChange}
          handleCheckboxChange={handleCheckboxChange}
          templateFormObj={templateFormObj}
          addOrSave={addOrSave}
          setSubmitTemplateBtnRef={setSubmitTemplateBtnRef}
          addTemplate={addTemplate}
          saveTemplate={saveTemplate}
          deleteTemplate={deleteTemplate}
        />
      ) : (
        ""
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(EmailTemplateSettings);
