import React from "react";

import Nav from "../../components/Nav";
import AdminSummary from "../../components/AdminSummary";

import { PageContainer } from "../SharedStyle/style";

const AdminProfilePage = () => (
  <PageContainer>
    <Nav />
    <AdminSummary />
  </PageContainer>
);

export default AdminProfilePage;
