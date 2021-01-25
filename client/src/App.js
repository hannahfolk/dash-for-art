import React from "react";
import { Switch, Route } from "react-router-dom";

import {
  SignUpPage,
  SignInPage,
  CreateArtistPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./pages/SigninSignupPage/signin-signup-page.component";
import ArtistProfilePage from "./pages/ArtistProfilePage/artist-profile-page.component";
import ArtistSubmissionPage from "./pages/ArtistSubmissionPage";
import ArtistCommissions from "./pages/ArtistCommissions";
import HomePage from "./pages/HomePage";
import TermsAndConditions from "./pages/TermsConditionPage";

import AdminProfile from "./pages/AdminProfilePage";
import AdminArtSubmissionsPage from "./pages/AdminArtSubmissions";
import AdminCommissionsPage from "./pages/AdminCommissions";
import AdminArtistsProfilesPage from "./pages/AdminArtistsProfilesPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";

import { GlobalStyle } from "./GlobalStyle";

function App() {
  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/signin" component={SignInPage} />
        <Route exact path="/signup" component={SignUpPage} />
        <Route exact path="/forgot-password" component={ForgotPasswordPage} />
        <Route
          exact
          path="/terms-and-conditions"
          component={TermsAndConditions}
        />
        <Route path="/reset-password/:token" component={ResetPasswordPage} />
        {/* Artist Routes */}
        <Route exact path="/artist/create" component={CreateArtistPage} />
        <Route exact path="/artist/profile" component={ArtistProfilePage} />
        <Route path="/artist/submissions" component={ArtistSubmissionPage} />
        <Route exact path="/artist/commissions" component={ArtistCommissions} />
        <Route
          exact
          path="/artist/notifications"
          component={ArtistProfilePage}
        />
        {/* Admin Routes TODO: Secure Routes */}
        <Route path="/admin/profile" component={AdminProfile} />
        <Route
          path="/admin/art-submissions"
          component={AdminArtSubmissionsPage}
        />
        <Route path="/admin/commissions" component={AdminCommissionsPage} />
        <Route
          path="/admin/artists-profiles"
          component={AdminArtistsProfilesPage}
        />
        <Route path="/admin/settings" component={AdminSettingsPage} />
      </Switch>
    </>
  );
}

export default App;
