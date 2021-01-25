import styled from "styled-components";

export const NavHeader = styled.header`
  background-color: #6CB6BB;
  min-height: 100vh;
  flex-basis: 20%;
  border-radius: 0px 70px 0px 0px;
  max-width: 300px;
`;

export const Title = styled.h2`
  text-align: center;
  padding-top: 60px;
  font-weight: normal;
  font-size: 32px;
  margin-bottom: 1px;
`;

export const LogoImg = styled.img`
  width: 25px;
  display: inline-block;
  margin-bottom: -2px;
`;

export const Subtitle = styled.h3`
  text-align: center;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0;
  font-size: 18px;
`;

export const NavWrapper = styled.nav`
  display: flex;
  flex-direction: column;
`;
