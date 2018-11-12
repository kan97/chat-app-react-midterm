import React from "react";
import MessageList from "./MessageList";

const MessageBox = ({
  uid,
  user,
  chatFriend,
  messageList,
  callbackFromParent
}) => {
  const userName = `${user.firstName} ${user.lastName}`;
  const chatFriendName = `${chatFriend.firstName} ${chatFriend.lastName}`;
  let input;
  return (
    <div className="chat">
      <div className="chat-header clearfix">
        <div className="btn btn-floating pink lighten-1">
          {chatFriend.picture ? (
            <img
              src={chatFriend.picture}
              alt={chatFriend.initials}
              width="40px"
              height="40px"
            />
          ) : (
            chatFriend.initials
          )}
        </div>
        <div className="chat-about">
          <div className="chat-with">Chat with {chatFriendName}</div>
        </div>
        <i className="fa fa-star" />
      </div>
      <div className="chat-history">
        <ul>
          <MessageList
            uid={uid}
            userName={userName}
            chatFriendName={chatFriendName}
            messageList={messageList}
          />
        </ul>
      </div>
      <form
        className="chat-message clearfix"
        onSubmit={e => {
          e.preventDefault();
          callbackFromParent(input.value);
          input.value = "";
        }}
      >
        <textarea
          ref={node => (input = node)}
          name="message-to-send"
          id="message-to-send"
          placeholder="Type your message"
          rows="3"
        />
        <i className="fa fa-file-image" />
        <button>Send</button>
      </form>
    </div>
  );
};

export default MessageBox;
