import React, { Component } from "react";
import {
  getFirebase,
  firebaseConnect,
  getVal,
  firestoreConnect
} from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import moment from "moment";

class Chat extends Component {
  submitHandler = e => {
    e.preventDefault();
    const createdAt = getFirebase().database.ServerValue.TIMESTAMP;
    getFirebase()
      .database()
      .ref(`messages/${this.props.uid}/${this.props.cfid}`)
      .push({
        text: this.refs.message_to_send.value,
        createdAt: createdAt,
        uid: this.props.uid
      })
      .then(() => {
        getFirebase()
          .database()
          .ref(`messages/${this.props.cfid}/${this.props.uid}`)
          .push({
            text: this.refs.message_to_send.value,
            createdAt: createdAt,
            uid: this.props.uid
          });
      })
      .then(() => {
        this.refs.message_to_send.value = "";
      });
  };

  render() {
    let chatHistory;
    let userName
    let chatFriendName;
    let chatFriendPicture;
    let chatFriendInitials;
    if (this.props.chatFriend && this.props.user) {
      userName = `${this.props.user[0].firstName} ${
        this.props.user[0].lastName
      }`;
      chatFriendName = `${this.props.chatFriend[0].firstName} ${
        this.props.chatFriend[0].lastName
      }`;
      chatFriendPicture = this.props.chatFriend[0].picture;
      chatFriendInitials = this.props.chatFriend[0].initials;
    }
    if (this.props.messageList) {
      chatHistory = this.props.messageList.map((message, index) => {
        const time = new Date(message.value.createdAt);
        const createdAt = moment(time.toGMTString()).calendar();

        if (this.props.uid === message.value.uid) {
          return (
            <li className="clearfix" key={index}>
              <div className="message-data align-right">
                <span className="message-data-time">{createdAt}</span> &nbsp;
                &nbsp;
                <span className="message-data-name">
                  {userName}
                </span>{" "}
                <i className="fa fa-circle me" />
              </div>
              <div className="message other-message float-right">
                {message.value.text}
              </div>
            </li>
          );
        } else {
          return (
            <li key={index}>
              <div className="message-data">
                <span className="message-data-name">
                  <i className="fa fa-circle online" />
                  {chatFriendName}
                </span>
                <span className="message-data-time">{createdAt}</span>
              </div>
              <div className="message my-message">{message.value.text}</div>
            </li>
          );
        }
      });
    }

    return (
      <div className="chat">
        <div className="chat-header clearfix">
          <div className="btn btn-floating pink lighten-1">
            {chatFriendPicture ? (
              <img
                src={chatFriendPicture}
                alt={chatFriendInitials}
                width="40px"
                height="40px"
              />
            ) : (
              chatFriendInitials
            )}
          </div>

          <div className="chat-about">
            <div className="chat-with">
              Chat with{" "}
              {chatFriendName}
            </div>
          </div>
        </div>

        <div className="chat-history">
          <ul>{chatHistory}</ul>
        </div>

        <form className="chat-message clearfix" onSubmit={this.submitHandler}>
          <textarea
            ref="message_to_send"
            name="message-to-send"
            id="message-to-send"
            placeholder="Type your message"
            rows="3"
          />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

const enhance = compose(
  firestoreConnect(props => [
    { collection: "users", doc: props.uid, storeAs: "user" },
    { collection: "users", doc: props.cfid, storeAs: "chatFriend" }
  ]),
  firebaseConnect(props => {
    return [{ path: `messages/${props.uid}/${props.cfid}` }];
  }),
  connect(({ firebase, firestore }, props) => ({
    messageList: getVal(
      firebase,
      `ordered/messages/${props.uid}/${props.cfid}`
    ),
    user: firestore.ordered["user"],
    chatFriend: firestore.ordered["chatFriend"]
  }))
);

export default enhance(Chat);
