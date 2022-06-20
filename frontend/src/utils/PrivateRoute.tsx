import { Navigate, Outlet } from "react-router-dom";
const checkLocalStorage = () => {
  const localStorage: Storage = window.localStorage;
  return localStorage.getItem("name") ? true : false;
};

const PrivateRoute = () => {
  const auth = checkLocalStorage();
  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
