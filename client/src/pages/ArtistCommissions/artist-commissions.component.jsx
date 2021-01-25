import React from "react";

import Nav from "../../components/Nav";
import ArtistCommissions from "../../components/ArtistCommissions";

import {
  ArtistContainer,
  CommissionsWrapper,
} from "./artist-commissions.styles";

const ArtistCommissionsPage = () => (
  <ArtistContainer>
    <Nav />
    <CommissionsWrapper>
      <ArtistCommissions />
    </CommissionsWrapper>
  </ArtistContainer>
);

export default ArtistCommissionsPage;
