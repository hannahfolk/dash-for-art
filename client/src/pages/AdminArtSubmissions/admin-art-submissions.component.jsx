import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Nav from "../../components/Nav/nav.component";
import AdminSubmitArt from "../../components/AdminSubmitArt";
import AdminArtSubmissions from "../../components/AdminArtSubmissions";

import {
  ArtistContainer,
  SubmissionWrapper,
} from "./admin-art-submissions.styles";

const AdminArtSubmissionsPage = () => {
  const { path } = useRouteMatch();

  return (
    <ArtistContainer>
      <Nav />
      <Switch>
        <Route exact path={path}>
          <SubmissionWrapper>
            <AdminSubmitArt />
          </SubmissionWrapper>
        </Route>
        <Route path={`${path}/:status`}>
          <SubmissionWrapper>
            <AdminArtSubmissions />
          </SubmissionWrapper>
        </Route>
      </Switch>
    </ArtistContainer>
  );
};

export default AdminArtSubmissionsPage;
