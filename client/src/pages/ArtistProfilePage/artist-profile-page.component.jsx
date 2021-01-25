import React from "react";

import Nav from "../../components/Nav";
import ArtistProfile from "../../components/ArtistProfile";
import ArtistHome from "../../components/ArtistHome";

import { ArtistContainer } from "./artist-profile-page.styles";

const ArtistProfilePage = () => (
  <ArtistContainer>
    <Nav />
    <ArtistHome />
    <ArtistProfile />
  </ArtistContainer>
);

export default ArtistProfilePage;
