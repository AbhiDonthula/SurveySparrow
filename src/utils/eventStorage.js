import dayjs from "dayjs";

// Event storage utility with LocalStorage
export const saveEventsToStorage = (events) => {
  try {
    localStorage.setItem("surveysparrow_events", JSON.stringify(events));
  } catch (error) {
    console.error("Error saving events to storage:", error);
  }
};

export const loadEventsFromStorage = () => {
  try {
    const stored = localStorage.getItem("surveysparrow_events");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading events from storage:", error);
    return [];
  }
};

export const generateEventId = () => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Process recurring events
export const expandRecurringEvents = (events) => {
  const expanded = [];
  const today = dayjs();
  const endDate = today.add(1, "year"); // Expand up to 1 year ahead

  events.forEach((event) => {
    if (!event.recurring || event.recurring === "none") {
      expanded.push(event);
      return;
    }

    const startDate = dayjs(event.date);
    let currentDate = startDate;

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      expanded.push({
        ...event,
        date: currentDate.format("YYYY-MM-DD"),
        originalDate: event.date,
        isRecurring: true,
      });

      // Move to next occurrence
      switch (event.recurring) {
        case "daily":
          currentDate = currentDate.add(1, "day");
          break;
        case "weekly":
          currentDate = currentDate.add(1, "week");
          break;
        case "monthly":
          currentDate = currentDate.add(1, "month");
          break;
        case "yearly":
          currentDate = currentDate.add(1, "year");
          break;
        default:
          break;
      }
    }
  });

  return expanded;
};

// Conflict detection utilities
export const eventsOverlap = (event1, event2) => {
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const start1Minutes = timeToMinutes(event1.startTime);
  const end1Minutes = timeToMinutes(event1.endTime);
  const start2Minutes = timeToMinutes(event2.startTime);
  const end2Minutes = timeToMinutes(event2.endTime);

  return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
};

export const detectConflicts = (events) => {
  const conflicts = [];
  const eventsByDate = {};

  // Group events by date
  events.forEach((event) => {
    const date = event.date;
    if (!eventsByDate[date]) {
      eventsByDate[date] = [];
    }
    eventsByDate[date].push(event);
  });

  // Check each date for overlaps
  Object.entries(eventsByDate).forEach(([date, dayEvents]) => {
    if (dayEvents.length < 2) return; // No conflicts possible with less than 2 events

    const conflictingEvents = new Set();

    for (let i = 0; i < dayEvents.length; i++) {
      for (let j = i + 1; j < dayEvents.length; j++) {
        if (eventsOverlap(dayEvents[i], dayEvents[j])) {
          conflictingEvents.add(dayEvents[i]);
          conflictingEvents.add(dayEvents[j]);
        }
      }
    }

    if (conflictingEvents.size > 0) {
      conflicts.push({
        date,
        events: Array.from(conflictingEvents).sort((a, b) => {
          const timeA = a.startTime.split(":").map(Number);
          const timeB = b.startTime.split(":").map(Number);
          return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
        }),
      });
    }
  });

  return conflicts;
};
