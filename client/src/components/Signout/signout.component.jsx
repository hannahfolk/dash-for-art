import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { logoutStart } from "../../redux/user/user.action";

import { SignOutStyled } from "./signout.styles";

class SignOut extends Component {
  handleClick = () => {
    const { logOut, history } = this.props;
    logOut();
    history.push("/");
  };

  render() {
    return <SignOutStyled onClick={this.handleClick}>Sign Out</SignOutStyled>;
  }
}

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logoutStart()),
});

export default withRouter(connect(null, mapDispatchToProps)(SignOut));
