import styled, { css } from "styled-components";

const buttonStyle = css`
  border-radius: 15px;
  font-size: 17px;
  font-weight: bold;
  background-color: #50b8bd;
  border: none;
  color: #0b7c80;
  cursor: pointer;
`;

export const ButtonLgContainer = styled.div`
  text-align: center;
`;

export const ButtonLgStyled = styled.button`
  ${buttonStyle}
  padding: 20px 25px;
`;

export const ButtonMdContainer = styled.div`
  margin-top: 20px;
`;

export const ButtonMdStyled = styled.button`
  padding: 10px 20px;
  border-radius: 13px;
  width: 100%;
  font-size: 19px;
  font-weight: bold;
  background-color: #50b8bd;
  color: white;
`;

const artSubmitCTA = css`
  padding: 13px 22px;
  border-radius: 20px;
  border: none;
  background-color: #50b8bd;
  color: white;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  font-size: 14px;
  font-weight: bold;
`;

export const BtnArtSubmitStyled = styled.button`
  ${artSubmitCTA}
`;

export const BtnArtSubmitLoadingStyled = styled.button`
  ${artSubmitCTA}
  ${(p) =>
    p.loaded
      ? null
      : css`
          padding: 0;
        `}
`;

export const InputArtPreviewWrapper = styled.div`
  // min-width: 290px;
  // min-height: 290px;
`;

export const InputArtFileStyled = styled.input`
  width: 1px;
  height: 1px;
`;

export const SpanStyled = styled.span`
  ${artSubmitCTA}
  cursor: pointer;
  max-width: 170px;
  display: inline-block;
`;

export const ButtonSmStyled = styled.button`
  ${buttonStyle}
  padding: 10px 15px;
`;

export const MainButtonContainer = styled.div`
  margin-top: 20px;
`;

export const MainButtonStyled = styled.button`
  /* padding: 13px 22px; */
  border-radius: 20px;
  border: none;
  background-color: #50b8bd;
  color: white;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  height: 45px;
  min-width: 95px;
  ${(p) =>
    p.loaded
      ? null
      : css`
          padding: 0;
        `}
`;

export const SettingsButtonContainer = styled.div``;