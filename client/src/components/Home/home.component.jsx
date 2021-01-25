import React from "react";

import homepageImage from "../../assets/homepage.png";
import {
  SignUpContainer,
  H2,
  H3,
  Img,
  SpaceHolder,
} from "../SharedStyle/signin-signout.styles";
import {
  Welcome,
  LinksContainer,
  LinkWrapper,
  LinkStyled,
  LinkText,
  LinkButton,
} from "./home.style";
import logo from "../../assets/logo.png";

const HomePage = () => (
  <SignUpContainer style={{ backgroundColor: "#50B8BD" }}>
    <H2>
      <Img src={logo} alt="Teefury Logo" />
      Tee<b>Fury</b>
    </H2>
    <H3>Artist Dashboard</H3>
    <SpaceHolder />
    <Welcome>Welcome To Our</Welcome>
    <Welcome>New Teefury Artist Dashboard</Welcome>
    <SpaceHolder style={{ display: "block" }} />
    <img src={homepageImage} alt="home" style={{ maxWidth: "900px" }} />
    <LinksContainer>
      <LinkWrapper>
        <LinkStyled to="/forgot-password">
          <LinkButton>Existing Artist</LinkButton>
        </LinkStyled>
        <LinkText>(First Time On New Dashboard)</LinkText>
      </LinkWrapper>
      <LinkWrapper>
        <LinkStyled to="/signin">
          <LinkButton>Existing Artist</LinkButton>
        </LinkStyled>
        <LinkText>(Login)</LinkText>
      </LinkWrapper>
      <LinkWrapper>
        <LinkStyled to="/signup">
          <LinkButton>New Artist</LinkButton>
        </LinkStyled>
        <LinkText>(Create Account)</LinkText>
      </LinkWrapper>
    </LinksContainer>
  </SignUpContainer>
);

export default HomePage;
