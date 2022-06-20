import { MemoryRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Room from "./pages/Room";
import Sample from "./components/Sample";
import PrivateRoute from "./utils/PrivateRoute";
import "./App.css";

function App() {
  return (
    <div className="App">
      <MemoryRouter>
        <Routes>
          <Route index element={<Login />} />
          {/* <Route path="room/:roomId" element={<PrivateRoute />}>
            <Route path="" element={<Room />} />
          </Route> */}
          <Route path="/room" element={<Room />} />
          <Route path="/sample" element={<Sample />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
}

export default App;
