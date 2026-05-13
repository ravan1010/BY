import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/navbar";
import { MdCelebration } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";
import { generateAndSaveFCMToken } from "../utilis/token";
import Footer from "../components/footer";

const Home = () => {

  const [vendors, setVendors] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [permissionChecked, setPermissionChecked] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await api.get("/api/user/vendors/posts");
      setVendors(res.data);

      setFilteredPosts(res.data.eventPosts || []);
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
    } else {
      console.log("Notification permission denied.");
      setPermissionChecked(false);
    }
  };


  useEffect(() => {
    fetchVendors();
    checkPermission();
  }, []);


  // Filter Posts
  const handleFilter = (eventName) => {
    setSelectedEvent(eventName);

    if (eventName === "all") {
      setFilteredPosts(vendors.eventPosts);
      return;
    }

    const filtered = vendors.eventPosts.filter(
      (post) => post.eventType === eventName
    );

    setFilteredPosts(filtered);
  };

  // Unique Events
  const uniqueEvents = [
    "all",
    ...new Set(vendor.eventPosts.map((post) => post.eventType)),
  ];

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

  if (!vendors) return <h1>Loading...</h1>;


  return (
    <>
      <Navbar />
      <div className="p-5">

        {/* Vendor Name */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          Byslot
        </h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {uniqueEvents.map((event, index) => (
            <button
              key={index}
              onClick={() => handleFilter(event)}
              className={`px-4 py-2 rounded-lg border transition
              ${selectedEvent === event
                  ? "bg-black text-white"
                  : "bg-white text-black"
                }
            `}
            >
              {event}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="border rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {post.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {post.description}
                </p>

                <p className="text-sm text-blue-500 mt-3">
                  {post.eventType}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </>
  );
};


export default Home;