import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/api/user/vendor/${id}`);
        setVendor(res.data);
      } catch (err) {
        setError("Failed to load vendor");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div>
        <p className="mt-20 text-center">Loading vendor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="mt-20 text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div>
        <p className="mt-20 text-center">No vendor found</p>
      </div>
    );
  }

  return (
    <div>

      <div className="mt-10 p-4 max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

          {/* Image */}

          {/* Content */}
          <div className="p-6">

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-sm text-blue-600 hover:underline"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {vendor.eventName}
            </h1>

            <p className="text-gray-700 mb-6">
              {vendor.description}
            </p>

            {/* Book Button */}
            {Array.isArray(vendor.eventPosts) && vendor.eventPosts.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Events
                </h2>
                <ul className="space-y-4 border-t border-b shadow-lg border-gray-300 p-2 rounded-lg">
                  {vendor.eventPosts?.[0] && (
  <li
    key={vendor.eventPosts[0]._id}
    onClick={() =>
      navigate(`/event/${vendor.eventPosts[0]._id}/${vendor._id}/${vendor.eventPosts[0].variants?.[0]._id}`)
    }
    className="bg-white rounded-lg p-2 cursor-pointer hover:shadow-md transition"
  >
    {/* Event Name */}
    <h3 className="font-semibold text-gray-800 mb-3 text-lg">
      {vendor.eventPosts[0].eventName}
    </h3>

    {/* Variants Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {vendor.eventPosts[0].variants?.[0] && (
        <div
          key={vendor.eventPosts[0].variants?.[0]._id}
          className="border rounded-lg overflow-hidden shadow-sm"
        >
          {/* Image */}
          <img
            src={vendor.eventPosts[0].variants?.[0].images?.[0]}
            alt={vendor.eventPosts[0].variants?.[0].name}
            className="w-full h-40 object-cover"
          />

          {/* Content */}
          <div className="p-2">
            <p className="text-sm font-medium text-gray-700">
              {vendor.eventPosts[0].variants?.[0].name}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">
                ₹ {vendor.eventPosts[0].variants?.[0].mrp}
              </span>
              <span className="text-lg font-bold">
                ₹ {vendor.eventPosts[0].variants?.[0].price}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  </li>
)}
                </ul>
              </div>
            ) : (
              <p className="text-gray-700 mb-6">No event available.</p>
            )
            }

            {/* <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Book Now
            </button> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;