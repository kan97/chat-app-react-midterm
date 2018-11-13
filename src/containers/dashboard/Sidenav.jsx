import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import SidenavPre from "../../components/layout/Sidenav";
import {
  sortByAlphabet,
  sortByLastestChat,
  sortByStar
} from "../../utils/helpers";

const Sidenav = props => {
  if (!isLoaded(props.star) || !isLoaded(props.conversation)) {
    return null;
  }
  let alphabet = [...props.users];
  alphabet.sort(sortByAlphabet);
  const lastestChat = sortByLastestChat(
    props.uid,
    [...props.conversation],
    [...alphabet],
    [...props.status]
  );
  const star = sortByStar(
    [...props.star],
    [...lastestChat.users],
    [...lastestChat.status]
  );
  return <SidenavPre users={star.users} status={star.status} />;
};

const enhance = compose(
  firestoreConnect(props => {
    return [
      {
        collection: "conversation",
        doc: props.uid,
        subcollections: [
          { collection: "list", orderBy: ["createdAt", "desc"] }
        ],
        storeAs: "conversation"
      },
      {
        collection: "star",
        doc: props.uid,
        subcollections: [{ collection: "list" }],
        storeAs: "star"
      }
    ];
  }),
  connect(({ firestore }) => ({
    conversation: firestore.ordered["conversation"],
    star: firestore.ordered["star"]
  }))
);

export default enhance(Sidenav);
