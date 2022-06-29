import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Room from "./pages/Room";
import Sample from "./components/Sample";
import { RoomProvider } from "./context/RoomContext";

function App() {
  return (
    <div className="h-screen">
      <MemoryRouter>
        <Routes>
          <Route index element={<Login />} />
          {/* <Route path="room/:roomId" element={<PrivateRoute />}>
            <Route path="" element={<Room />} />
          </Route> */}
          <Route path="/room" element={<RoomProvider />} />
        </Routes>
      </MemoryRouter>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          duration: 2000,
        }}
      />
    </div>
  );
}

export default App;
