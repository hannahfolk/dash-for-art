import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

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
  margin-right: 33px;
`;

export const TabArea = styled.div`
  box-shadow: 0px 7px 16px 2px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 55px;
  min-height: 70vh;
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
    fill: #1a8488;
  }
`;

export const FilterContainer = styled.div`
  position: absolute;
  bottom: -145px;
  right: -20px;
  z-index: 5;
  max-width: 170px;
  padding: 18px 20px 18px 0;
  border-radius: 12px;
  box-shadow: 0px 3px 11px 1px rgba(0, 0, 0, 0.2);
  background-color: #fff;

  .selected {
    background-color: #dedddd;
    border-left: 5px solid #6a6a6a;
    border-radius: 0 12px 12px 0;
    padding-left: 30px;
    box-shadow: 0px 3px 11px 1px rgba(0, 0, 0, 0.2);
  }
`;
