import React, { useState } from "react";
import dayjs from "dayjs";

const ConflictResolver = ({ conflicts, allEvents, onResolve, onClose }) => {
  const [resolvingEvent, setResolvingEvent] = useState(null);
  const [suggestedSlots, setSuggestedSlots] = useState([]);

  // Helper functions
  const eventsOverlap = (event1, event2) => {
    const start1Minutes = timeToMinutes(event1.startTime);
    const end1Minutes = timeToMinutes(event1.endTime);
    const start2Minutes = timeToMinutes(event2.startTime);
    const end2Minutes = timeToMinutes(event2.endTime);

    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const getEventDuration = (event) => {
    return timeToMinutes(event.endTime) - timeToMinutes(event.startTime);
  };

  const findAlternativeSlots = (event, date) => {
    const workingHours = [
      { start: "08:00", end: "12:00" },
      { start: "13:00", end: "18:00" },
    ];

    const suggestions = [];
    const duration = getEventDuration(event);
    const dayEvents = allEvents.filter(
      (e) => e.date === date && e.id !== event.id
    );

    workingHours.forEach((slot) => {
      let currentMinutes = timeToMinutes(slot.start);
      const slotEndMinutes = timeToMinutes(slot.end);

      while (currentMinutes + duration <= slotEndMinutes) {
        const proposedStartTime = minutesToTime(currentMinutes);
        const proposedEndTime = minutesToTime(currentMinutes + duration);

        const proposedEvent = {
          ...event,
          startTime: proposedStartTime,
          endTime: proposedEndTime,
        };

        // Check if this slot is free
        const hasConflict = dayEvents.some((e) =>
          eventsOverlap(e, proposedEvent)
        );

        if (!hasConflict) {
          suggestions.push({
            startTime: proposedStartTime,
            endTime: proposedEndTime,
          });
        }

        currentMinutes += 30; // Check every 30 minutes
      }
    });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  };

  const handleFindAlternatives = (event, date) => {
    const slots = findAlternativeSlots(event, date);
    setSuggestedSlots(slots);
    setResolvingEvent({ event, date });
  };

  const handleReschedule = (newTime) => {
    if (resolvingEvent) {
      onResolve("reschedule", {
        ...resolvingEvent.event,
        startTime: newTime.startTime,
        endTime: newTime.endTime,
      });
      setResolvingEvent(null);
      setSuggestedSlots([]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700";
    }
  };

  const conflictCount = conflicts.reduce(
    (sum, group) => sum + group.events.length,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Event Conflicts Detected</h2>
                <p className="text-white/80 text-sm mt-1">
                  {conflictCount} events need your attention
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
              title="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conflicts.map((group, idx) => (
            <div
              key={idx}
              className="border-2 border-red-300 dark:border-red-700 rounded-xl p-5 bg-red-50/50 dark:bg-red-900/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-bold text-red-700 dark:text-red-400">
                    {dayjs(group.date).format("dddd, MMMM D, YYYY")}
                  </p>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                  {group.events.length} conflicts
                </span>
              </div>

              <div className="space-y-3">
                {group.events.map((event, i) => (
                  <div
                    key={event.id || i}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border-l-4"
                    style={{ borderLeftColor: event.color || "#3b82f6" }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                            {event.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(
                              event.priority
                            )}`}
                          >
                            {event.priority || "Medium"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-semibold">
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                          {event.category && (
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                              {event.category}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            handleFindAlternatives(event, group.date)
                          }
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                          title="Find alternative time slots"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Reschedule
                        </button>
                        <button
                          onClick={() => onResolve("edit", event)}
                          className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                          title="Manually adjust time"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${event.title}"?`)) {
                              onResolve("delete", event);
                            }
                          }}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                          title="Delete this event"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Alternative Slots */}
                    {resolvingEvent?.event.id === event.id &&
                      suggestedSlots.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            ✨ Suggested alternative time slots:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {suggestedSlots.map((slot, slotIdx) => (
                              <button
                                key={slotIdx}
                                onClick={() => handleReschedule(slot)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
                              >
                                {slot.startTime} - {slot.endTime}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {resolvingEvent?.event.id === event.id &&
                      suggestedSlots.length === 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            No available slots found. Try editing manually or
                            choose a different date.
                          </p>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold"
            >
              Ignore Conflicts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolver;
