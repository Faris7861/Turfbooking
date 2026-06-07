import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home/Home";
import Search from "./pages/user/Search/Search";
import MyBookings from "./pages/user/bookings/MyBookings";
import Turf from "./pages/user/turf/Turf";
import RoleSelectPage from "./pages/auth/roleSelectPage/RoleSelectPage";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import ClientDashboard from "./pages/client/clientDashoard/ClientDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/roles" element={<RoleSelectPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<div>Admin Dashboard</div>} />
        <Route path="/user" element={<Home />} />

        
        <Route path="/" element={<Home />} />
        <Route path="/turfs" element={<Search />} />
        <Route path="/turfs/:id" element={<Turf />} />
        <Route path="/bookings" element={<MyBookings />} />

        <Route path="/client" element={<ClientDashboard />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
