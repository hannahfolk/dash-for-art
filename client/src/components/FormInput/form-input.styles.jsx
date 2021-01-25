import styled, { css } from "styled-components";

export const FormStyled = styled.form`
  /* margin-top: 84px; */
`;

export const FormInputContainer = styled.div`
  display: block;

  .form-label {
    margin-bottom: 6px;
    display: inline-block;
  }
`;

const inputStyled = css`
  background-color: #f4f2f2;
  border: none;
  padding: 16px;
  font-weight: bold;
  border-radius: 12px;
  display: block;
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

export const TextAreaStyled = styled.textarea`
  ${inputStyled}
`;
