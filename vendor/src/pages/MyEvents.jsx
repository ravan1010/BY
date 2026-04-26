import React, { useEffect, useState } from "react";
import { Edit, Home, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/eventposts");
      setEvents(res.data.eventPosts);
    } catch (err) {
      console.error(err);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Delete event
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/eventpost/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Edit event
  const handleEdit = (id) => {
    navigate(`/edit-event/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>

        <div className="flex gap-4">
          <Link
            to="/eventpost"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <Edit size={18} /> Create
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:underline"
          >
            <Home size={18} /> Dashboard
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {events.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No events found. Create one 🚀
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
            >
              {/* Image */}
              <img
                src={event?.variants?.[0]?.images?.[0] || "/placeholder.jpg"}
                alt="event"
                className="w-full h-40 object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold line-clamp-1">
                  {event.eventName}
                </h2>

                <p className="text-sm text-gray-500">
                  {event.EventType}
                </p>

                <p className="text-blue-600 font-bold">
                  ₹{event?.variants?.[0]?.price || "N/A"}
                </p>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleEdit(event._id)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(event._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}