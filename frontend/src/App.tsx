import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Room from "./pages/Room";
import PrivateRoute from "./utils/PrivateRoute";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="room/:roomId" element={<PrivateRoute />}>
            <Route path="" element={<Room />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
