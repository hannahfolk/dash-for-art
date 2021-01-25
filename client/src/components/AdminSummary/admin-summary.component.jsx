import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserAccount } from "../../redux/user/user.selector";
import { logoutStart } from "../../redux/user/user.action";

const AdminSummary = ({ userAccount, logOut }) => {
  // TODO: admin summary of different components
  let history = useHistory();

  useEffect(
    () => {
      const redirectUser = () => {
        const { isAdmin } = userAccount;
        if (!isAdmin) {
          logOut();
          history.push("/");
        }
        return;
      };

      redirectUser();
    },
    // eslint-disable-next-line
    [userAccount]
  );

  return <></>;
};

const mapStateToProps = createStructuredSelector({
  userAccount: selectUserAccount,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logoutStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminSummary);
