import React from "react";
import {
  CheckboxesContainerStyled,
  CheckboxWrapper,
  HiddenCheckbox,
  StyledCheckbox,
  Icon,
  LabelStyled
} from "./checkbox.styles.jsx";

export const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxWrapper className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxWrapper>
);

export const Label = ({ children, ...props }) => (
  <LabelStyled {...props}>{children}</LabelStyled>
);

export const CheckboxesContainer = ({ children, ...props }) => (
  <CheckboxesContainerStyled {...props}>{children}</CheckboxesContainerStyled>
);
