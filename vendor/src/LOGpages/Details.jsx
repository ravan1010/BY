import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Details() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  // ✅ initialize properly
  const [eventName, seteventName] = useState("");
  const [description, setdescription] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [lat, setlat] = useState("");
  const [lng, setlng] = useState("");

  const [error, seterror] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  // ✅ Check details
  const fetchDetails = async () => {
    try {
      const res = await api.get("/api/details/check");
      if (res.data.success) {
        navigate("/");
      } else {
        setStep(1);
      }
    } catch (err) {
      console.error(err);
      setStep(1);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // ✅ Get location
  const getlivelocation = () => {
    if (!navigator.geolocation) {
      seterror("Geolocation not supported");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setlat(pos.coords.latitude.toFixed(6));
        setlng(pos.coords.longitude.toFixed(6));
        setLoadingLocation(false);
      },
      (err) => {
        seterror(err.message);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getlivelocation();
  }, []);

  // ✅ Submit form
  const SubmitDetails = async (e) => {
    e.preventDefault(); // 🔥 FIX

    if (!lat || !lng) {
      setStep(3);
      return;
    }

    try {
      const res = await api.post("/api/details", {
        eventName,
        description,
        phone,
        address,
        lat,
        lng,
      });

      if (res.data.success) {
        navigate("/");
      }
    } catch (err) {
      seterror("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        {/* Step 0 */}
        {step === 0 && (
          <h2 className="text-center text-lg font-semibold">Loading...</h2>
        )}

        {/* Step 3 - Error */}
        {step === 3 && (
          <div className="text-center">
            <h1 className="text-red-500 mb-5">{error || "Location required"}</h1>
            <button
              onClick={() => setStep(1)} // ✅ FIX
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        )}

        {/* Step 1 - Form */}
        {step === 1 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
              Complete Your Details
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <form onSubmit={SubmitDetails} className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Event management name"
                className="border rounded-lg px-3 py-2"
                value={eventName}
                onChange={(e) => seteventName(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Description"
                className="border rounded-lg px-3 py-2"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Phone No"
                className="border rounded-lg px-3 py-2"
                minLength={10}
                maxLength={10}
                value={phone}
                onChange={(e) => setphone(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Address"
                className="border rounded-lg px-3 py-2"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                required
              />

              {/* Location */}
              <p className="text-xs text-center text-gray-500">
                {loadingLocation
                  ? "Fetching location..."
                  : `Lat: ${lat} | Lng: ${lng}`}
              </p>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;