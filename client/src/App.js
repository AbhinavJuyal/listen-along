import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Room from "./pages/room/Room";
import NotFound from "./pages/notFound/NotFound";
import "./css/App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/lobby" element={<Room />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
