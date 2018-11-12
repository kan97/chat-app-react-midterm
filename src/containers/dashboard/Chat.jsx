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
          .doc(`conversation/${param}`)
          .set({
            createdAt: getFirestore().FieldValue.serverTimestamp()
          });
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
      { collection: "users", doc: props.cfid, storeAs: "chatFriend" },
      // {
      //   collection: "conversation",
      //   doc: conversationParam(props.uid, props.cfid),
      //   storeAs: "conversation"
      // }
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
    chatFriend: firestore.ordered["chatFriend"],
    // conversation: firestore.ordered["conversation"]
  }))
);

export default enhance(Chat);
