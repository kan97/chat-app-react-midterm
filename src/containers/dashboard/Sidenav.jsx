import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import SidenavPre from "../../components/layout/Sidenav";
import {
  sortByAlphabet,
  sortByLastestChat,
  sortByStar,
  searchByName
} from "../../utils/helpers";

class Sidenav extends Component {
  state = {
    search: ""
  };

  myCallback = value => {
    this.setState({ search: value });
  };

  render() {
    if (!isLoaded(this.props.star) || !isLoaded(this.props.conversation)) {
      return null;
    }
    let alphabet = [...this.props.users];
    alphabet.sort(sortByAlphabet);
    const lastestChat = sortByLastestChat(
      this.props.uid,
      [...this.props.conversation],
      [...alphabet],
      [...this.props.status]
    );
    const star = sortByStar(
      [...this.props.star],
      [...lastestChat.users],
      [...lastestChat.status]
    );
    const search = searchByName(
      this.state.search,
      [...star.users],
      [...star.status]
    );
    return (
      <SidenavPre
        users={search.users}
        status={search.status}
        callbackFromParent={this.myCallback}
      />
    );
  }
}

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
