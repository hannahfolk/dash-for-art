import React from "react";
import {
  ButtonLgContainer,
  ButtonLgStyled,
  ButtonMdContainer,
  ButtonMdStyled,
  ButtonSmStyled,
  BtnArtSubmitStyled,
  BtnArtSubmitLoadingStyled,
  InputArtFileStyled,
  SpanStyled,
  InputArtPreviewWrapper,
  MainButtonContainer,
  MainButtonStyled,
  SettingsButtonContainer,
} from "./button.styles";

export const ButtonLgCenter = ({ children, ...props }) => (
  <ButtonLgContainer>
    <ButtonLgStyled {...props}>{children}</ButtonLgStyled>
  </ButtonLgContainer>
);

export const ButtonLg = ({ children, ...props }) => (
  <ButtonLgStyled {...props}>{children}</ButtonLgStyled>
);

export const ButtonMd = ({ children, ...props }) => (
  <ButtonMdContainer>
    <ButtonMdStyled {...props}>{children}</ButtonMdStyled>
  </ButtonMdContainer>
);

export const ButtonSm = ({ children, ...props }) => (
  <ButtonSmStyled {...props}>{children}</ButtonSmStyled>
);

export const BtnArtSubmit = ({ children, textAlign, ...props }) => (
  <ButtonMdContainer style={{ textAlign }}>
    <BtnArtSubmitStyled {...props}>{children}</BtnArtSubmitStyled>
  </ButtonMdContainer>
);

export const InputArtFile = ({ children, textAlign, ...props }) => (
  <ButtonMdContainer style={{ textAlign }}>
    <InputArtFileStyled {...props} />
    <SpanStyled>{children}</SpanStyled>
  </ButtonMdContainer>
);

export const InputArtPreview = ({ children, ...props }) => (
  <InputArtPreviewWrapper>
    {children}
    <InputArtFileStyled {...props} />
  </InputArtPreviewWrapper>
);

export const BtnArtSubmitLoading = ({ children, textAlign, ...props }) => (
  <ButtonMdContainer style={{ textAlign }}>
    <BtnArtSubmitLoadingStyled {...props}>{children}</BtnArtSubmitLoadingStyled>
  </ButtonMdContainer>
);

export const MainButton = ({ children, textAlign, ...props }) => (
  <MainButtonContainer style={{ textAlign }}>
    <MainButtonStyled {...props}>{children}</MainButtonStyled>
  </MainButtonContainer>
);

export const SettingsButton = ({ children, textAlign, ...props }) => (
  <SettingsButtonContainer style={{ textAlign }}>
    <MainButtonStyled {...props}>{children}</MainButtonStyled>
  </SettingsButtonContainer>
);
