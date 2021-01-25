import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { Form, FormInput, TextArea } from "../FormInput";

export const SubmissionContainer = styled.div`
  width: 90%;
  margin: 40px auto;
`;

export const TabHeader = styled.header`
  display: flex;
  justify-content: center;
`;

const tabTitle = css`
  margin: 0;
  padding: 20px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 17px;
  border-radius: 15px 15px 0 0;
  font-family: sans-serif;
  min-width: 170px;
  text-align: center;
  cursor: pointer;
`;

export const TabTitle = styled.h1`
  ${tabTitle}
  margin-right: 33px;
  // box-shadow: 0px -10px 26px 2px rgba(0,0,0,0.2);
  box-shadow: 0px -7px 17px 0px rgba(0, 0, 0, 0.2);
  color: #6a6a6a;
`;

export const TabSubTitle = styled.h2`
  ${tabTitle}
  background-color: #DEDDDD;
  color: #fff;
`;

export const TabSubLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin-right: 20px;
`;

export const TabArea = styled.div`
  box-shadow: 0px 7px 16px 2px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 55px;
  min-height: 70vh;
  margin-top: 20px;
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
`;

export const AdjustableIconWrapper = styled.div`
  width: 30px;
  cursor: pointer;

  path {
    fill: #6a6a6a;
  }
`;

export const SubTitle = styled.h3`
  margin: 0;
  color: #757575;
  font-weight: 600;
  font-size: 25px;
  font-family: sans-serif;
`;

export const FormArtistSubmit = styled.form`
  display: flex;
  justify-content: center;
`;

export const SubmitCard = styled.div`
  margin-right: 65px;
`;

export const IconContainer = styled.div`
  width: 85px;
`;

export const ArtPreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  box-shadow: -3px 4px 24px -1px rgba(0, 0, 0, 0.2);
  flex-direction: column;
  padding: 50px 15px 85px;
  position: relative;
  cursor: pointer;
  min-width: 250px;
  // min-width: 290px;
  // min-height: 310px;
`;

const previewTxt = css`
  font-weight: bold;
  display: inline-block;
  margin-top: 10px;
  width: 76%;
  text-align: center;
  color: #b5b4b4;
`;

export const IconTopSubtitle = styled.span`
  ${previewTxt}
  font-size: 11px;
`;

export const IconBottomSubtitle = styled.span`
  ${previewTxt}
  bottom: 20px;
  font-size: 9px;
`;

export const PreviewImage = styled.img`
  box-shadow: -3px 4px 24px -1px rgba(0, 0, 0, 0.2);
  max-width: 290px;
  border-radius: 15px;
  cursor: pointer;
`;

export const FormStyled = styled(Form)`
  margin-top: 0;
`;

export const FormInputArtistStyled = styled(FormInput)`
  font-size: 25px;
  margin-bottom: 15px;
  border-radius: 20px;
  cursor: not-allowed;
  color: #6a6a6a;
`;

const formInputStyle = css`
  font-size: 14px;
  margin-bottom: 15px;
  border-radius: 20px;
`;

export const FormInputTitleStyled = styled(FormInput)`
  ${formInputStyle}
`;

export const TextAreaStyled = styled(TextArea)`
  ${formInputStyle}
  min-height: 75px;
  // min-height: 265px;
`;

export const Terms = styled.span`
  color: #b5b4b4;
  margin-left: 13px;
  font-size: 12px;
  font-weight: bold;
`;

export const LinkToTerm = styled(Link)`
  color: #6a6a6a;
`;

export const TermsWrapper = styled.div`
  display: flex;
  max-width: 275px;
  margin: 0 auto;
  min-height: 50px;
`;

export const FlipButtonsWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
`;
