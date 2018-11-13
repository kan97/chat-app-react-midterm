import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  getFirebase,
  firebaseConnect,
  getVal,
  firestoreConnect,
  isEmpty,
  isLoaded
} from "react-redux-firebase";
import { getFirestore } from "redux-firestore";

import { presence } from "../../utils/actions";
import { conversationParam } from "../../utils/helpers";

import MessageBox from "../../components/message/MessageBox";

class Chat extends Component {
  state = {
    star: { color: "#D8DADF" }
  };

  componentDidMount() {
    presence(getFirebase());
  }

  myCallback = value => {
    let param = conversationParam(this.props.uid, this.props.cfid);
    getFirebase()
      .database()
      .ref(`messages/${param}`)
      .push({
        text: value,
        createdAt: getFirebase().database.ServerValue.TIMESTAMP,
        uid: this.props.uid
      })
      .then(() => {
        getFirestore()
          .doc(`conversation/${this.props.uid}/list/${this.props.cfid}`)
          .set({
            createdAt: getFirestore().FieldValue.serverTimestamp()
          });
        getFirestore()
          .doc(`conversation/${this.props.cfid}/list/${this.props.uid}`)
          .set({
            createdAt: getFirestore().FieldValue.serverTimestamp()
          });
      });
  };

  myCallback2 = () => {
    getFirestore()
      .doc(`star/${this.props.uid}/list/${this.props.cfid}`)
      .set({
        createdAt: getFirestore().FieldValue.serverTimestamp()
      })
      .then(() => {
        this.setState({ star: { color: "#f1e05a" } });
      });
  };

  render() {
    return (
      <Fragment>
        {!isEmpty(this.props.user) &&
          !isEmpty(this.props.chatFriend) &&
          isLoaded(this.props.user) &&
          isLoaded(this.props.chatFriend) && (
            <MessageBox
              uid={this.props.uid}
              user={this.props.user[0]}
              chatFriend={this.props.chatFriend[0]}
              messageList={this.props.messageList}
              callbackFromParent={this.myCallback}
              star={this.state.star}
              callbackFromParent2={this.myCallback2}
            />
          )}
      </Fragment>
    );
  }
}

const enhance = compose(
  firestoreConnect(props => {
    return [
      { collection: "users", doc: props.uid, storeAs: "user" },
      { collection: "users", doc: props.cfid, storeAs: "chatFriend" }
    ];
  }),
  firebaseConnect(props => {
    return [{ path: `messages/${conversationParam(props.uid, props.cfid)}` }];
  }),
  connect(({ firebase, firestore }, props) => ({
    messageList: getVal(
      firebase,
      `ordered/messages/${conversationParam(props.uid, props.cfid)}`
    ),
    user: firestore.ordered["user"],
    chatFriend: firestore.ordered["chatFriend"]
  }))
);

export default enhance(Chat);
