import React from "react";
import {
  FormStyled,
  FormInputContainer,
  InputStyled,
  TextAreaStyled,
} from "./form-input.styles";

export const Form = ({ children, ...props }) => (
  <FormStyled {...props}>{children}</FormStyled>
);

export const Input = ({ ...props }) => <InputStyled {...props} />;

export const FormInput = ({
  handleChange,
  label,
  isShowLabel,
  ...otherProps
}) => (
  <FormInputContainer>
    {label ? (
      <label className={isShowLabel ? "form-label" : "display-none"}>
        {label}
      </label>
    ) : null}
    <InputStyled
      className="form-input"
      onChange={handleChange}
      {...otherProps}
    />
  </FormInputContainer>
);

export const TextArea = ({
  handleChange,
  label,
  isShowLabel,
  ...otherProps
}) => (
  <FormInputContainer>
    {label ? (
      <label className={isShowLabel ? "form-label" : "display-none"}>
        {label}
      </label>
    ) : null}
    <TextAreaStyled
      className="form-input"
      onChange={handleChange}
      {...otherProps}
    />
  </FormInputContainer>
);
