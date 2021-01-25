import styled, { css } from "styled-components";
import { FormInput, TextArea } from "../FormInput";

export const SubmissionContainer = styled.div`
  width: 90%;
  margin: 40px auto;
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

export const ArtworkContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const SubmitCard = styled.div`
  margin-right: 65px;
`;

export const PreviewImage = styled.img`
  box-shadow: -3px 4px 24px -1px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  cursor: pointer;
  text-align: center;
  ${(p) =>
    p.isEnlargeImg
      ? css`
          max-width: 500px;
        `
      : css`
          max-width: 290px;
        `}
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
  margin: 0 auto;
  min-width: 250px;
  // min-width: 290px;
  // min-height: 310px;
`;

export const ArtFileButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
`;

export const IconContainer = styled.div`
  width: 85px;
`;

export const IconTopSubtitle = styled.span`
  font-weight: bold;
  display: inline-block;
  width: 76%;
  text-align: center;
  color: #b5b4b4;
  font-size: 30px;
  font-family: sans-serif;
  margin-top: 20px;
  margin-bottom: -16px;
`;

const previewTxt = css`
  font-weight: bold;
  display: inline-block;
  margin-top: 10px;
  width: 76%;
  text-align: center;
  color: #b5b4b4;
`;

export const IconBottomSubtitle = styled.span`
  ${previewTxt}
  bottom: 20px;
  font-size: 9px;
`;

export const FormInputArtistStyled = styled(FormInput)`
  font-size: 25px;
  margin-bottom: 15px;
  border-radius: 20px;
  cursor: not-allowed;
  color: #6a6a6a;
`;

const formInputStyle = css`
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  margin-bottom: 15px;
  border-radius: 20px;
`;

export const FormInputTitleStyled = styled(FormInput)`
  ${formInputStyle}
`;

export const TextAreaStyled = styled(TextArea)`
  ${formInputStyle}
  resize: vertical;
  min-height: 75px;
  // min-height: 265px;
`;

export const GreyTextArea = styled.div`
  font-size: 25px;
  border-radius: 20px;
  color: #6a6a6a;
  background-color: #f4f2f2;
  border: none;
  padding: 12px;
  font-weight: bold;
  display: block;
  margin: 0 auto;
  min-width: 250px;
  margin-bottom: 16px;
`;

export const CaptionTitle = styled.span`
  margin-left: 15px;
  color: #b5b4b4;
`;

export const EmailStatus = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
`;

export const DownloadLink = styled.a`
  color: #fff;
  text-decoration: none;
`;

export const CenterButtonsWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
`;

// Approval Email

export const MockEmailContainer = styled.section`
  margin-top: 20px;
  border-top: 2px solid black;
`;

export const SelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 30px;
  border-radius: 10px;
  margin: 40px auto;
`;

// History Log
export const LogContainer = styled.div`
  margin-top: 20px;
  margin: 20px auto;
  border-top: 2px solid black;
`;

export const LogList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const LogListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 0.5px dotted #abaeb0;
`;

export const LogInfo = styled.span`
  flex-grow: 1;
  font-size: 13px;
  line-height: 140%;
  color: rgba(52, 52, 52, 0.4);
  max-width: calc(100% - 75px);
  min-width: 0;
`;

export const LogTimestamp = styled.span`
  flex-shrink: 0;
  font: 400 11px "Gotham Pro", "Proxima Nova", arial, serif;
  margin: 0 0 0 10px;
  padding: 4px 0 0;
  color: #abaeb0;
`;