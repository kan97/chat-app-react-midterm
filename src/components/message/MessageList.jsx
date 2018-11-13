import React, { Fragment } from "react";
import { isEmpty, isLoaded } from "react-redux-firebase";
import moment from "moment";
import Message from "./Message";

const MessageList = ({ uid, userName, chatFriendName, messageList }) => {
  return (
    <Fragment>
      {!isEmpty(messageList) &&
        isLoaded(messageList) &&
        messageList.map((message, index) => {
          const time = new Date(message.value.createdAt);
          const createdAt = moment(time.toGMTString()).calendar();
          const name = message.value.uid === uid ? userName : chatFriendName;
          const owner = message.value.uid === uid ? true : false;
          return (
            <Message
              key={index}
              owner={owner}
              createdAt={createdAt}
              name={name}
              text={message.value.text}
              isImage={message.value.isImage}
            />
          );
        })}
    </Fragment>
  );
};

export default MessageList;
