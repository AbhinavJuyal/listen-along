import { useSearchParams } from "react-router-dom";

const sample = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log(Object.keys(params)[0]);
  return <div>sample</div>;
};

export default sample;
