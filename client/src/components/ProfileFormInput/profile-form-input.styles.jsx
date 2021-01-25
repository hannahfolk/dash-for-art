import styled, { css } from "styled-components";

export const FormInputContainer = styled.div`

  .form-label {
    text-align: left;
    float: left;
    margin-top: 12px;
    margin-right: 15px;
    width: 150px;
  }
`;

const inputStyled = css`
  background-color: #f4f2f2;
  border: none;
  padding: 16px;
  font-weight: bold;
  border-radius: 12px;
  margin: 0 auto;
  margin-bottom: 30px;
  min-width: 250px;

  &::placeholder {
    color: #b5b4b4;
  }
`;

export const InputStyled = styled.input`
  ${inputStyled}

  ${(props) =>
    props.border
      ? css`
          border: 2px solid red;
        `
      : null}

  ${(props) =>
    props.disabled
      ? css`
          cursor: not-allowed;
        `
      : null}
`;