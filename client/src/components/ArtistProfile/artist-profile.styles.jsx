import styled from "styled-components";
import { FormInput } from "../FormInput";

export const ArtistProfileContainer = styled.section`
  flex-basis: 25%;
  min-height: 100vh;
  background-color: #0B7C80;
  border-radius: 70px 0 0 0;
  padding-bottom: 10px;
  max-width: 300px;
`;

export const ProfileImg = styled.div`
  border-radius: 70px 0 0 0;
  min-width: 300px;
  min-height: 300px;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ArtistName = styled.h2`
  text-align: center;
  font-size: 30px;
  color: white;
  margin-bottom: 8px;
`;

export const FullName = styled.h3`
  text-transform: uppercase;
  color: #074F51;
  text-align: center;
  margin: 0;
`;

export const FormTitle = styled.h2`
  color: white;
`

export const ProfileForm = styled.form`
  margin-left: 20px;
  margin-top: 35px;
`;

export const ProfileInfo = styled.p`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  margin: 35% auto;
  padding: 0 10px;
  word-break: break-all;

  .icon {
    width: 30px;
    fill: #fff;
    margin-right: 7px;
  }
`;

export const FormInputStyled = styled(FormInput)`
  min-width: initial;
  padding: 12px;
  font-size: 16px;
  margin: initial;
  margin-bottom: 20px;
`;

export const ErrorList = styled.ul`
  padding-left: 10px;
  color: #ff7777;
  font-weight: bolder;
  text-shadow: -1px 1px 2px #000000eb;
`;

export const ErrorTitle = styled.h4`
  font-size: 25px;
  margin-bottom: 10px;
  font-weight: normal;
`;
