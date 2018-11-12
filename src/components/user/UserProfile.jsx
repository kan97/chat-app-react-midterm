import React from "react";
import { NavLink } from "react-router-dom";
import UserStatus from "./UserStatus";

const UserProfile = ({ user, status }) => {
  return (
    <li className="clearfix">
      <NavLink to={`/message/${user.id}`}>
        <div className="btn btn-floating pink lighten-1">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.initials}
              width="40px"
              height="40px"
            />
          ) : (
            user.initials
          )}
        </div>
        <div className="about">
          <div className="name">
            {user.firstName} {user.lastName}
          </div>
          <UserStatus status={status} />
        </div>
      </NavLink>
    </li>
  );
};

export default UserProfile;
