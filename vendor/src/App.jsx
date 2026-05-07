import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LOGpages/Login";
import Success from "./LOGpages/Success";
import Details from "./LOGpages/Details";

import ProtectedADMIN from "./LOGpages/protect/authroute";

import EventPost from "./pages/Eventpost";
import VendorDashboard from "./pages/dashboard";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/editevent";
import VendorCalendar from "./pages/VendorCalendar";
import VendorBooking from "./pages/vendorBooking";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />

        <Route element={<ProtectedADMIN />}>
          <Route path="/details" element={<Details />} />
                    <Route path="/di" element={<Details />} />

          <Route path="/" element={<VendorDashboard />} />
          <Route path="/calendar" element={<VendorCalendar />} />
          <Route path="/eventpost" element={<EventPost />} />
          <Route path="/myevents" element={<MyEvents />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/vendor/bookings" element={<VendorBooking />} />
          <Route />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;