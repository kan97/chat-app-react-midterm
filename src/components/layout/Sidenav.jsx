import React from "react";
import UserProfile from "../user/UserProfile";

const Sidenav = ({ users, status }) => {
  return (
    <div className="people-list" id="people-list">
      <div className="search">
        <input type="text" placeholder="search" />
      </div>
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
