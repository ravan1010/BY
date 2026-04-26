import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/navbar";
import { MdCelebration } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";
import { generateAndSaveFCMToken } from "../utilis/token";
  
const Home = () => {

  const [vendors, setVendors] = useState([]);
  const [permissionChecked, setPermissionChecked] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await api.get("/api/user/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error(err); 
    }
  };

  // ✅ Handle notification permission
  const checkPermission = async () => {
      generateAndSaveFCMToken();
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          setPermissionChecked(true);
        }else {
          console.log("Notification permission denied.");
          setPermissionChecked(false);
        }
  };


  useEffect(() => {
    fetchVendors();
    checkPermission();
  }, []);

  if (permissionChecked === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Notification Permission Required
        </h1>
        <p className="text-gray-600 mb-6">
          Please allow notifications to receive updates from vendors.
        </p>
        <button
          onClick={generateAndSaveFCMToken}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Allow Notifications
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* ✅ Vendor List */}
      <div className="mt-20 p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Available Vendors
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              onClick={() => navigate(`/vendor/${vendor._id}`)}
              className="bg-white shadow-md rounded-xl p-5 flex flex-col items-center justify-center border hover:shadow-xl transition cursor-pointer"
            >
              <LuPartyPopper size={30} className="text-yellow-500 mb-2" />

              <h2 className="text-lg font-semibold text-gray-800 text-center">
                {vendor.eventName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Click to view details
              </p>

              <MdCelebration size={30} className="text-yellow-500 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;