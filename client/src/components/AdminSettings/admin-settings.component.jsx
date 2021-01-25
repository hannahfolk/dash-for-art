import React from "react";

import TagSettings from "./tag-settings.component";
import EmailSettings from "./email-template-settings.component";

import {
  SubmissionContainer,
  TabHeader,
  TabTitle,
  TabArea,
} from "../SharedStyle/styled";

const AdminSettings = () => {
  return (
    <SubmissionContainer>
      <TabHeader>
        <TabTitle>Admin Settings</TabTitle>
      </TabHeader>
      <TabArea>
        <TagSettings />
        <EmailSettings />
      </TabArea>
    </SubmissionContainer>
  );
};

export default AdminSettings;
