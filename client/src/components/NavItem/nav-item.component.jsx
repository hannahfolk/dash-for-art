import React from "react";
import { useRouteMatch } from "react-router-dom";

import {
  LinkWrapperSelected,
  LinkAnchorSelected,
  LinkWrapper,
  LinkAnchor,
  AnchorStyle,
  LogoWrapper,
} from "./nav-item.styles";

export const NavItemLink = ({
  children,
  to,
  pathToMatch,
  Icon,
  ...otherProps
}) => {
  const { path } = useRouteMatch();
  return (
    <>
      {path.includes(pathToMatch) ? (
        <LinkWrapperSelected {...otherProps}>
          <LinkAnchorSelected to={to}>
            <LogoWrapper>{Icon ? <Icon /> : null}</LogoWrapper>
            {children}
          </LinkAnchorSelected>
        </LinkWrapperSelected>
      ) : (
        <LinkWrapper {...otherProps}>
          <LinkAnchor to={to}>
            <LogoWrapper>{Icon ? <Icon /> : null}</LogoWrapper>
            {children}
          </LinkAnchor>
        </LinkWrapper>
      )}
    </>
  );
};

// Style of a NavItem without being a link
export const NavItemStyle = ({ children, Icon, ...otherProps }) => (
  <LinkWrapper {...otherProps}>
    <AnchorStyle>
      {Icon ? (
        <LogoWrapper>
          <Icon />
        </LogoWrapper>
      ) : null}
      {children}
    </AnchorStyle>
  </LinkWrapper>
);
