import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Nav from "../../components/Nav";
import AdminSettings from "../../components/AdminSettings";

import { PageContainer, PageWrapper } from "../SharedStyle/style";

const AdminSettingsPage = () => {
  const { path } = useRouteMatch();
  return (
    <PageContainer>
      <Nav />
      <Switch>
        <Route exact path={path}> 
          <PageWrapper>
            <AdminSettings />
          </PageWrapper>
        </Route>
      </Switch>
    </PageContainer>
  );
};

export default AdminSettingsPage;
