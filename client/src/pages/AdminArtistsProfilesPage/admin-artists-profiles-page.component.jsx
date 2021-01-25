import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Nav from "../../components/Nav";
import AdminArtistsProfiles from "../../components/AdminArtistsProfiles";

import { PageContainer, PageWrapper } from "../SharedStyle/style";

const AdminArtistsProfilesPage = () => {
  const { path } = useRouteMatch();
  return (
    <PageContainer>
      <Nav />
      <Switch>
        <Route exact path={path}>
          <PageWrapper>
            <AdminArtistsProfiles />
          </PageWrapper>
        </Route>
      </Switch>
    </PageContainer>
  );
};

export default AdminArtistsProfilesPage;
