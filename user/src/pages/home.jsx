import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/navbar";
import { generateAndSaveFCMToken } from "../utilis/token";
import Footer from "../components/footer";

const Home = () => {
  const [vendor, setVendor] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [permissionChecked, setPermissionChecked] = useState(null);

  const navigate = useNavigate();

  // Fetch Vendor
  const fetchVendors = async () => {
    try {
      const res = await api.get("/api/user/vendors/posts");

      setVendor(res.data);

      setFilteredPosts(res.data?.eventPosts || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Notification Permission
  const checkPermission = async () => {
    generateAndSaveFCMToken();

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      setPermissionChecked(true);
    } else {
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
      setFilteredPosts(vendor?.eventPosts || []);
      return;
    }

    const filtered =
      vendor?.eventPosts?.filter(
        (post) => post.EventType === eventName
      ) || [];

    setFilteredPosts(filtered);
  };

  // Unique Events
  const uniqueEvents = [
    "all",
    ...new Set(
      vendor?.eventPosts?.map((post) => post.EventType) || []
    ),
  ];

  if (permissionChecked === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-5">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Notification Permission Required
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Please allow notifications to receive vendor updates.
        </p>

        <button
          onClick={generateAndSaveFCMToken}
          className="
            px-6 py-3
            rounded-full
            bg-gradient-to-r
            from-blue-500
            to-purple-500
            text-white
            font-semibold
            shadow-lg
            hover:scale-105
            transition
          "
        >
          Allow Notifications
        </button>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold animate-pulse">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="pt-24 px-4 md:px-8 min-h-screen bg-gray-50">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Byslot Events
          </h1>

          <p className="text-gray-500 mt-2">
            Discover amazing event setups
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1 mb-8">
          {uniqueEvents.map((event, index) => (
            <button
              key={index}
              onClick={() => handleFilter(event)}
              className={`
                whitespace-nowrap
                px-5 py-2
                rounded-full
                border
                font-medium
                transition-all
                duration-300
                shadow-sm
                hover:scale-105
                ${
                  selectedEvent === event
                    ? "bg-gradient-to-r from-pink-500 to-yellow-500 text-white border-transparent shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                }
              `}
            >
              {event}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              onClick={() =>
                navigate(
                  `/event/${post._id}/${post.VendorId}/${post?.variants?.[0]?._id}`
                )
              }
              className="
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-2xl
                transition-all
                duration-300
                cursor-pointer
                group
              "
            >
              <div className="overflow-hidden">
                <img
                  src={post?.variants?.[0]?.images?.[0]}
                  alt={post?.variants?.[0]?.title}
                  className="
                    w-full
                    h-56
                    object-cover
                    group-hover:scale-110
                    transition-transform
                    duration-500
                  "
                />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-800">
                    {post?.variants?.[0]?.name}
                  </h2>

                  <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-600">
                    {post.EventType}
                  </span>
                </div>

                <p className="text-gray-500 line-clamp-2">
                  {post?.variants?.[0]?.description}
                </p>

                <button
                  className="
                    mt-5
                    w-full
                    py-2
                    rounded-xl
                    bg-gradient-to-r
                    from-pink-500
                    to-yellow-500
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                  "
                >
                  View Details
                </button>
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