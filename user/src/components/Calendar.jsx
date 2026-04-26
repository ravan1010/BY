import React, { useState } from "react";

export default function CalendarPicker({ availableDates = [], onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const availableSet = new Set(
    availableDates.map(d => new Date(d).toDateString())
  );

  const changeMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const handleSelect = (dateObj) => {
    setSelectedDate(dateObj);

    // ✅ send to parent
    if (onDateSelect) {
      onDateSelect(dateObj);
    }
  };

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={"empty-" + i}></div>);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month, d);
    const dateStr = dateObj.toDateString();

    const isAvailable = availableSet.has(dateStr);
    const isSelected =
      selectedDate && selectedDate.toDateString() === dateStr;

    days.push(
      <button
        key={d}
        disabled={!isAvailable}
        onClick={() => isAvailable && handleSelect(dateObj)}
        className={`
          p-2 rounded-lg text-sm
          ${isAvailable ? "cursor-pointer" : "text-gray-300"}
          ${isSelected ? "bg-blue-500 text-white" : ""}
          ${isAvailable && !isSelected ? "hover:bg-blue-100" : ""}
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded-xl shadow">
      
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)}>◀</button>
        <h2 className="font-bold">
          {monthNames[month]} {year}
        </h2>
        <button onClick={() => changeMonth(1)}>▶</button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days}
      </div>

      {selectedDate && (
        <p className="mt-4 text-green-600 text-center">
          Selected: {selectedDate.toDateString()}
        </p>
      )}
    </div>
  );
}