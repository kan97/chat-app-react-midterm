import React, { Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";

import "../../stylesheets/Dashboard.css";

import Chat from "./Chat";
import SidenavPre from "../../components/layout/Sidenav";

const Dashboard = props => {
  const { auth, users, status } = props;
  if (!auth.uid) return <Redirect to="/signin" />;
console.log(props);

  return (
    <Fragment>
      { !isEmpty(users) && isLoaded(users) &&
      !isEmpty(status) && isLoaded(status) &&
    <div className="container clearfix">
      <SidenavPre uid={auth.uid} users={users} status={status}/>
      <Chat cfid={props.match.params.cfid} uid={auth.uid} />
    </div>
      }
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    users: state.firestore.ordered.users,
    status: state.firestore.ordered.status
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect([{ collection: "users"},{ collection: "status" }])
)(Dashboard);
