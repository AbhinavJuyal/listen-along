import React from "react";

const MessageBox = ({ getUserDetails, obj }) => {
  let cond = getUserDetails().username === obj.username;
  return (
    <>
      <li className={"message " + (cond ? "txt_right" : "txt_left")}>
        <span className="text">{obj.msg}</span>
        <span className={"username " + (cond && "hidden")}>{obj.username}</span>
      </li>
    </>
  );
};

export default MessageBox;
