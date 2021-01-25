import styled, { css } from "styled-components";
import { Link } from "react-router-dom"

const AnchorText = css`
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
`;

const NavItemSharedStyle = css`
  width: 73%;
  display: flex;
  align-items: center;
`;

export const LogoWrapper = styled.div`
  margin-right: 20px;
  width: 23px;;
`;

const Icon = css`
  margin-right: 20px;
  width: 23px;
`;

export const LinkWrapperSelected = styled.div`
padding: 14px 0 0 16px;
height: 37px;
  margin-right: 15px;
  border-left: 4px solid #214E51;
  background-color: #86C9CE;
  border-radius: 0 10px 10px 0;
  box-shadow: 0px 6px 14px 1px rgba(0,0,0,0.2);
`;

export const LinkWrapper = styled.div`
  padding: 27px 0 22px 22px;

  .icon {
    ${Icon}
    fill: #ffffff;
  }
`;

export const LinkAnchorSelected = styled(Link)`
  ${NavItemSharedStyle}
  ${AnchorText}
  color: #214E51;
`;

export const LinkAnchor = styled(Link)`
  ${AnchorText}
  ${NavItemSharedStyle}
  color: #ffffff;
`;

export const AnchorStyle = styled.span`
  ${AnchorText}
  ${NavItemSharedStyle}
  color: #ffffff;
`;
