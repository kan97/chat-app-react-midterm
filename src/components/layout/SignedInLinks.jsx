import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

const style = {
  fontWeight: "bold"
};

const SignedInLinks = props => {
  return (
    <ul className="right">
      <li>
        <NavLink to="/" onClick={props.signOut}>
          Sign out
        </NavLink>
      </li>
      <li>
        <NavLink to="#" className="btn btn-floating pink lighten-1">
          {props.profile.picture ? (
            <img
              src={props.profile.picture}
              alt={props.profile.initials}
              width="40px"
              height="40px"
            />
          ) : (
            props.profile.initials
          )}
        </NavLink>
      </li>
      <li>
        <NavLink to="#">
          Hello,{" "}
          <span style={style}>
            {props.profile.firstName} {props.profile.lastName}
          </span>
        </NavLink>
      </li>
    </ul>
  );
};

const mapDisptachToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(
  null,
  mapDisptachToProps
)(SignedInLinks);
