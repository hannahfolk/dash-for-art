import styled from "styled-components";
import { Link } from "react-router-dom";

export const SignUpContainer = styled.section`
  background-color: white;
  text-align: center;
  min-width: 50%;
  margin-top: 50px;
  margin-bottom: 50px;
  border-radius: 17px;
  padding: 85px;
  padding-top: 0;
  height: 100%;
`;

export const H1 = styled.h1`
  text-transform: uppercase;
  color: #0B777A;
  font-size: 33px;
  margin-bottom: 20px;
`;

export const H2 = styled.h2`
  font-weight: normal;
  margin-bottom: 5px;
  font-size: 28px;
  margin-top: 0;
`;

export const H3 = styled.h3`
  text-transform: uppercase;
  margin-top: 0;
`;

export const P = styled.p`
  color: #B5B4B4;
  font-weight: bold;
  margin-bottom: 25px;
  font-size: 14px;
`;

export const Span = styled.span`
  color: #B5B4B4;
  margin-left: 13px;
  font-weight: bold;
  display: inline-block;
  text-transform: uppercase;
  font-size: 14px;
`;

export const Terms = styled.span`
  color: #B5B4B4;
  margin-left: 13px;
  font-size: 12px;
  font-weight: bold;
  margin-top: -8px;

  &::before {
    content: "*";
    font-size: 20px;
    color: red;
  }
`;

export const LinkToTerm = styled(Link)`
  color: #6A6A6A; 
`;

export const Img = styled.img`
  width: 24px;
  display: inline-flex;
  margin-bottom: -2px;
`;
