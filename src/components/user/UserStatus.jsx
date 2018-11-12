import React, { Fragment } from "react";
import moment from "moment";

const UserStatus = ({ status }) => {
  const timestamp = new Date(status.last_changed.seconds * 1000);
  const time = moment(timestamp.toGMTString()).fromNow();
  return (
    <div className="status">
      {status.state === "online" ? (
        <Fragment>
          <i className="fa fa-circle online" /> online
        </Fragment>
      ) : (
        <Fragment>
          <i className="fa fa-circle offline" /> left {time}
        </Fragment>
      )}
    </div>
  );
};

export default UserStatus;
