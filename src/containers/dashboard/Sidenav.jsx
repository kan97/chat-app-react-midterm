import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import SidenavPre from "../../components/layout/Sidenav";
import { sortByAlphabet, sortByLastestChat } from "../../utils/helpers";

const Sidenav = props => {
  if (!isLoaded(props.star) || !isLoaded(props.conversation)) {
    return null;
  }
  let temp = [...props.users];
  temp.sort(sortByAlphabet);
  const data = sortByLastestChat(
    props.uid,
    [...props.conversation],
    [...temp],
    [...props.status]
  );
  return <SidenavPre users={data.users} status={data.status} />;
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
