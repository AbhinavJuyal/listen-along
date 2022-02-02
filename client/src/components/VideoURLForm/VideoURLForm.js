import React, { useState } from "react";

let regexURL =
  /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/g;
// https://www.youtube.com/watch?v=rqtEGrSGFvw

// checks the regex to see if the link is valid
const regexChecker = (regexArr) => {
  if (!regexArr) return false;
  let tempArr = [...regexArr];
  let checkArr = ["https:", "www.", "youtube.com", "watch", "?v="];
  tempArr.shift();
  tempArr.pop();
  if (checkArr.length !== tempArr.length) return false;
  for (let i = 0; i < checkArr.length; i++)
    if (checkArr[i] !== tempArr[i]) return false;
  return true;
};

const VideoURLForm = ({ addURL }) => {
  let [inputVal, setInputVal] = useState("");
  const onFormSubmit = (e) => {
    e.preventDefault();
    let regexArr = [...inputVal.matchAll(regexURL)];
    if (!regexChecker(regexArr[0])) {
      console.warn("Please enter a valid URL");
      return;
    }
    addURL(regexArr[0][0]);
    e.target.reset();
  };
  return (
    <>
      <form onSubmit={onFormSubmit}>
        <input
          onChange={(e) => setInputVal(e.target.value)}
          type="text"
          placeholder="Enter a link"
        />
        <button type="submit" disabled={inputVal === ""}>
          Add
        </button>
      </form>
    </>
  );
};

export default VideoURLForm;
