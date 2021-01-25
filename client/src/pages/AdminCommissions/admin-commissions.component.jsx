import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Nav from "../../components/Nav";
import AdminCommissions from "../../components/AdminCommissions";
import AdminPayout from "../../components/AdminPayout";

import { PageContainer, PageWrapper } from "../SharedStyle/style";

const AdminCommissionsPage = () => {
  const { path } = useRouteMatch();
  return (
    <PageContainer>
      <Nav />
      <Switch>
        <Route exact path={path}> 
          <PageWrapper>
            <AdminCommissions />
          </PageWrapper>
        </Route>
        <Route exact path={`${path}/payouts`}> 
          <PageWrapper>
            <AdminPayout />
          </PageWrapper>
        </Route>
      </Switch>
    </PageContainer>
  );
};

export default AdminCommissionsPage;
