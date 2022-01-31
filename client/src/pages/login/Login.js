import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import loader from "../../assets/loading.gif";

const Login = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [username, setUserName] = useState("");
  let roomID = searchParams.get("room");
  // checks whether user exists or not
  const validateUser = async () => {
    let userDetails = {
      username,
      roomID,
    };
    let url = process.env.REACT_APP_SOCKET_URL;
    try {
      let res = await axios.post(`${url}`, userDetails);
      let navRoomID = res.data.roomID || roomID;
      navigate(`/lobby?name=${username}&room=${navRoomID}`);
    } catch (err) {
      console.error(err.response.data);
      setLoading(false);
    }
  };

  const formSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (username === "") {
      alert("Please enter a username");
      console.error("Please enter a username");
      setLoading(false);
      return;
    }
    validateUser();
  };
  // controlled input
  const inputChange = (e) => {
    setUserName(e.target.value);
  };
  return (
    <form className="loginForm" onSubmit={formSubmit}>
      <div className="inputwrapper">
        <label htmlFor="username">Nickname</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={inputChange}
        />
      </div>
      <button type="submit" disabled={username === ""}>
        <span className={loading ? "hidden" : ""}>
          {searchParams.get("room") ? "Join Room" : "Create Room"}
        </span>
        <img
          className={(loading ? "" : "hidden") + " loader"}
          src={loader}
          alt="loading.."
        />
      </button>
    </form>
  );
};

export default Login;
