import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 64) / 7; // Accounting for padding

export default function CalendarPicker({ availableDates = [], onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const availableSet = new Set(
    availableDates.map(d => new Date(d).toDateString())
  );

  const changeMonth = (dir) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const handleSelect = (dateObj) => {
    setSelectedDate(dateObj);
    if (onDateSelect) {
      // Format to YYYY-MM-DD to match your API expectations
      onDateSelect(dateObj.toISOString().split('T')[0]);
    }
  };

  const renderDays = () => {
    const dayElements = [];

    // Empty spaces for previous month's trailing days
    for (let i = 0; i < firstDay; i++) {
      dayElements.push(<View key={"empty-" + i} style={styles.dayBox} />);
    }

    // Actual days of the month
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toDateString();

      const isAvailable = availableSet.has(dateStr);
      const isSelected = selectedDate && selectedDate.toDateString() === dateStr;

      dayElements.push(
        <TouchableOpacity
          key={d}
          disabled={!isAvailable}
          onPress={() => isAvailable && handleSelect(dateObj)}
          style={[
            styles.dayBox,
            isAvailable ? styles.availableDay : styles.disabledDay,
            isSelected && styles.selectedDay
          ]}
        >
          <Text style={[
            styles.dayText,
            !isAvailable && styles.disabledText,
            isSelected && styles.selectedDayText
          ]}>
            {d}
          </Text>
        </TouchableOpacity>
      );
    }
    return dayElements;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
          <Text style={styles.navText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
          <Text style={styles.navText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Weekdays Labels */}
      <View style={styles.weekLabels}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <Text key={d} style={styles.weekText}>{d}</Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.grid}>
        {renderDays()}
      </View>

      {selectedDate && (
        <Text style={styles.selectedMsg}>
          Selected: {selectedDate.toDateString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navBtn: { padding: 10 },
  navText: { fontSize: 18, color: '#2563eb' },
  monthTitle: { fontSize: 16, fontWeight: 'bold' },
  weekLabels: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekText: {
    width: COLUMN_WIDTH,
    textAlign: 'center',
    fontWeight: '600',
    color: '#6b7280',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayBox: {
    width: COLUMN_WIDTH,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 8,
  },
  dayText: { fontSize: 14, color: '#1f2937' },
  availableDay: { backgroundColor: 'transparent' },
  disabledDay: { backgroundColor: 'transparent' },
  disabledText: { color: '#d1d5db' },
  selectedDay: { backgroundColor: '#3b82f6' },
  selectedDayText: { color: '#fff', fontWeight: 'bold' },
  selectedMsg: {
    marginTop: 16,
    color: '#059669',
    textAlign: 'center',
    fontWeight: '500',
  }
});