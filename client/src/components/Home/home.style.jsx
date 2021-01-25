import styled from "styled-components";
import { Link } from "react-router-dom";

export const Welcome = styled.h5`
  font-weight: bold;
  text-transform: uppercase;
  font-family: sans-serif;
  font-size: 33px;
  margin-bottom: 0px;
  margin-top: 0;
  color: white;
`;

export const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const LinkWrapper = styled.div`
  max-width: 150px;
  margin: 0 20px;
`;

export const LinkStyled = styled(Link)``;

export const LinkButton = styled.button`
  min-height: 70px;
  border-radius: 70px;
  background-color: white;
  color: black;
  text-transform: uppercase;
  padding: 16px 22px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

export const LinkText = styled.p`
  font-size: 15px;
  text-transform: uppercase;
  font-weight: bold;
  color: #4e787b;
`;
