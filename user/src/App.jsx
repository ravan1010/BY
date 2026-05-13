import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LOGpages/Login";
import Success from "./LOGpages/Success";
import ProtectedUSER from "./LOGpages/protect/authroute";

//
import Home from "./pages/home";
import Booked from "./pages/Booked";
import Profile from "./pages/profile";
import EventPage from "./pages/eventPage";
import PrivacyPolicy from "./components/PrivacyPolicy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/" element={<Home />} />
       
        <Route path="privacy-policy" element={<PrivacyPolicy />} />

        <Route element={<ProtectedUSER />}>
          <Route path="/booked" element={<Booked />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/event/:id/:vendor/:variant" element={<EventPage />} />

          {/* <Route path="*"  /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;