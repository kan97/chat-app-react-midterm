import React from "react";
import UserProfile from "../user/UserProfile";

const Sidenav = ({ users, status, callbackFromParent }) => {
  let input;
  return (
    <div className="people-list" id="people-list">
      <form
        className="search"
        onSubmit={e => {
          e.preventDefault();
          callbackFromParent(input.value);
        }}
      >
        <input ref={node => (input = node)} type="text" placeholder="search" />
      </form>
      <ul className="list">
        {users &&
          users.map((user, index) => (
            <UserProfile key={index} user={user} status={status[index]} />
          ))}
      </ul>
    </div>
  );
};

export default Sidenav;
