import React, { useState, forwardRef } from "react";

import ColorPicker from "material-ui-color-picker";
import MUIRichTextEditor from "mui-rte";

import {
  MuiThemeProvider,
  ThemeProvider,
  withStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import { SettingsButton } from "../Button";

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

const EmailForm = forwardRef((props, ref) => {
  const {
    handleInputChange,
    handleColorChange,
    handleCheckboxChange,
    templateFormObj: {
      templateLabel,
      emailSubject,
      emailBody,
      templateColor,
      isPreviewImg,
    },
    addOrSave,
    setSubmitTemplateBtnRef,
    addTemplate,
    saveTemplate,
    deleteTemplate,
  } = props;
  const [isFocused, setIsFocused] = useState(false);

  const _changeBorderColor = (event) => {
    event === "focus" ? setIsFocused(true) : setIsFocused(false);
  };

  return (
    <FormControl>
      <ThemeProvider theme={theme}>
        <TextField
          id="templateLabel"
          label="Template Label"
          name="templateLabel"
          value={templateLabel}
          variant="outlined"
          style={{ marginTop: "20px" }}
          onChange={handleInputChange}
        />
        <h4>
          You can put placeholders anywhere in your template's email subject or
          body. Make sure they match the exact syntax as the sentence below.
        </h4>
        <p>
          {"Possible placeholders are {submission_title} and {artist_name}."}
        </p>
        <p>
          {
            "Example: Your submission, {submission_title}, has been chosen to be added to the TeeFury gallery!"
          }
        </p>
        <TextField
          id="emailSubject"
          label="Email Subject Line"
          name="emailSubject"
          value={emailSubject}
          variant="outlined"
          style={{ marginTop: "20px" }}
          onChange={handleInputChange}
        />
      </ThemeProvider>
      {addOrSave === "add" ? (
        <>
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
                  "media",
                  "numberList",
                  "bulletList",
                ]}
                inlineToolbar={true}
                onSave={addTemplate}
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
                  "media",
                  "numberList",
                  "bulletList",
                ]}
                inlineToolbar={true}
                onSave={addTemplate}
                onFocus={() => _changeBorderColor("focus")}
              />
            </MuiThemeProvider>
          )}
        </>
      ) : (
        <>
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
                onSave={saveTemplate}
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
                onSave={saveTemplate}
                onFocus={() => _changeBorderColor("focus")}
              />
            </MuiThemeProvider>
          )}
        </>
      )}
      <ColorPicker
        label="Pick a color for this template"
        name="templateColor"
        defaultValue="Template Color"
        value={templateColor}
        onChange={handleColorChange}
        style={{ marginTop: "20px" }}
      />
      <FormControlLabel
        control={
          <TealCheckbox
            checked={isPreviewImg}
            onChange={handleCheckboxChange}
            name="isPreviewImg"
          />
        }
        label="Include preview image attachment in this template"
      />
      {addOrSave === "add" ? (
        <SettingsButton
          onClick={setSubmitTemplateBtnRef}
          style={{ width: "200px", marginTop: "20px", ...cntrTxtBtnsWithIcons }}
        >
          <AddIcon style={{ marginRight: "5px" }} />
          Add template
        </SettingsButton>
      ) : (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <SettingsButton
            onClick={setSubmitTemplateBtnRef}
            style={{
              width: "200px",
              marginTop: "20px",
              ...cntrTxtBtnsWithIcons,
            }}
          >
            <SaveIcon style={{ marginRight: "5px" }} />
            Save template
          </SettingsButton>
          <SettingsButton
            onClick={deleteTemplate}
            style={{
              width: "200px",
              marginTop: "20px",
              marginLeft: "5px",
              fontSize: "14px",
              fontWeight: "normal",
              backgroundColor: "transparent",
              border: "1px solid #c23b22",
              color: "#c23b22",
              ...cntrTxtBtnsWithIcons,
            }}
          >
            <DeleteIcon style={{ marginRight: "5px" }} />
            Delete Template
          </SettingsButton>
        </div>
      )}
    </FormControl>
  );
});

export default EmailForm;
