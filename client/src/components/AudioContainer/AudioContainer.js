import React from "react"

const AudioContainer = ({ room }) => {
  let url = process.env.REACT_APP_SOCKET_URL;
  return (
    <div>
      <audio id="myaudio" controls>
        {/* <source src={`/${room}/video`} type="" /> */}
        <source src={`${url}/audio`} type="" />
      </audio>
    </div>
  );
};

export default AudioContainer;
