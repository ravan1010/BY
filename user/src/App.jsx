import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LOGpages/Login";
import Success from "./LOGpages/Success";
import ProtectedUSER from "./LOGpages/protect/authroute";

//
import Home from "./pages/home";
import Booked from "./pages/Booked";
import Profile from "./pages/profile";
import VendorDetails from "./pages/VendorDetails";
import EventPage from "./pages/eventPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route element={<ProtectedUSER />}>
          <Route path="/" element={<Home />} />
          <Route path="/booked" element={<Booked />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vendor/:id" element={<VendorDetails />} />
          <Route path="/event/:id/:vendor" element={<EventPage />} />

          {/* <Route path="*"  /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;