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
import { conversationParam, validateImageURL } from "../../utils/helpers";

import MessageBox from "../../components/message/MessageBox";

class Chat extends Component {
  componentDidMount() {
    presence(getFirebase());
  }

  myCallback = value => {
    if (!this.props.uid || !this.props.cfid || value.trim() === "") {
      return;
    }
    validateImageURL(value).then(res => {
      let isImage = false;
      if (res) {
        isImage = true;
      }
      let param = conversationParam(this.props.uid, this.props.cfid);
      getFirebase()
        .database()
        .ref(`messages/${param}`)
        .push({
          text: value,
          isImage: isImage,
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
    });
  };

  myCallback2 = () => {
    getFirestore()
      .doc(`star/${this.props.uid}/list/${this.props.cfid}`)
      .set({
        createdAt: getFirestore().FieldValue.serverTimestamp()
      });
  };

  render() {
    return (
      <Fragment>
        {!isEmpty(this.props.user) &&
          !isEmpty(this.props.chatFriend) &&
          isLoaded(this.props.user) &&
          isLoaded(this.props.chatFriend) &&
          isLoaded(this.props.star) && (
            <MessageBox
              uid={this.props.uid}
              user={this.props.user[0]}
              chatFriend={this.props.chatFriend[0]}
              messageList={this.props.messageList}
              callbackFromParent={this.myCallback}
              star={this.props.star.length !== 0}
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
      { collection: "users", doc: props.cfid, storeAs: "chatFriend" },
      {
        collection: "star",
        doc: props.uid,
        subcollections: [{ collection: "list", doc: props.cfid }],
        storeAs: "star"
      }
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
    star: firestore.ordered["star"]
  }))
);

export default enhance(Chat);
