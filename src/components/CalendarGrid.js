import React from "react";
import dayjs from "dayjs";
import CalendarCell from "./CalendarCell";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarGrid = ({
  calendarDays,
  currentDate,
  selectedDate,
  eventsByDate,
  onDateSelect,
  onCreateEvent,
  viewMode = "month",
}) => {
  const today = dayjs();

  return (
    <div className="calendar-grid">
      {/* Days of week header */}
      <div
        className={`grid ${
          viewMode === "day" ? "grid-cols-1" : "grid-cols-7"
        } gap-2 mb-2`}
      >
        {viewMode === "day" ? (
          <div className="text-center py-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {calendarDays[0].format("dddd, MMMM D, YYYY")}
          </div>
        ) : (
          DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="text-center py-3 text-sm font-semibold text-gray-600 uppercase tracking-wide"
            >
              {day}
            </div>
          ))
        )}
      </div>

      {/* Calendar cells */}
      <div
        className={`grid ${
          viewMode === "day" ? "grid-cols-1" : "grid-cols-7"
        } gap-2`}
      >
        {calendarDays.map((day, index) => {
          const dateKey = day.format("YYYY-MM-DD");
          const dayEvents = eventsByDate[dateKey] || [];
          const isCurrentMonth =
            viewMode === "day" ||
            viewMode === "week" ||
            day.month() === currentDate.month();
          const isToday = day.isSame(today, "day");
          const isSelected = day.isSame(selectedDate, "day");

          return (
            <CalendarCell
              key={index}
              day={day}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              isSelected={isSelected}
              events={dayEvents}
              onDateSelect={onDateSelect}
              onCreateEvent={onCreateEvent}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
