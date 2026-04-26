import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../api";

export default function VendorCalendar() {
  const [availability, setAvailability] = useState([]);

  // 📥 Fetch existing availability
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await api.get(`/api/vendor/availability`);

      const formattedDates = (res.data.availableDates || []).map(
        (d) => new Date(d).toISOString().split("T")[0]
      );

      setAvailability(formattedDates);
    } catch (err) {
      console.error(err);
    }
  };

  // 🎨 Highlight selected dates
  const events = availability.map((date) => ({
    start: date,
    display: "background",
    backgroundColor: "#22c55e",
  }));

  // 📅 Toggle date selection
  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr)
      .toISOString()
      .split("T")[0];

    setAvailability((prev) => {
      if (prev.includes(clickedDate)) {
        return prev.filter((d) => d !== clickedDate);
      } else {
        return [...prev, clickedDate];
      }
    });
  };

  // 💾 Submit to backend
  const handleSubmit = async () => {
    try {
      await api.put(`/api/vendor/availability/update`, {
        availableDates: availability,
      });

      alert("Availability saved ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save ❌");
    }
  };

  // ✅ Prevent past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Vendor Availability
      </h2>

      {/* Calendar */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="auto"
        validRange={{ start: today }}
      />

      {/* Selected Count */}
      <p className="text-sm text-gray-600 mt-4 text-center">
        Selected: {availability.length} days
      </p>

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}