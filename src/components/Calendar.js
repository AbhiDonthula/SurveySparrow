import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import EventList from "./EventList";
import EventModal from "./EventModal";
import JsonImport from "./JsonImport";
import SearchAndFilter from "./SearchAndFilter";
import ConflictResolver from "./ConflictResolver";
import ToastContainer from "./Toast";
import {
  loadEventsFromStorage,
  saveEventsToStorage,
  generateEventId,
  expandRecurringEvents,
  detectConflicts,
} from "../utils/eventStorage";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("month");
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConflictResolverOpen, setIsConflictResolverOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "all", priority: "all" });
  const [toasts, setToasts] = useState([]);

  // Load events from storage (start with empty calendar)
  useEffect(() => {
    const storedEvents = loadEventsFromStorage();
    setEvents(storedEvents);
  }, []);

  // Toast notification helper
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Process and filter events
  const processedEvents = useMemo(() => {
    // Expand recurring events
    const expanded = expandRecurringEvents(events);

    // Apply search filter
    let filtered = expanded;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.description && event.description.toLowerCase().includes(query))
      );
    }

    // Apply category and priority filters
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (event) => event.category === filters.category
      );
    }
    if (filters.priority !== "all") {
      filtered = filtered.filter(
        (event) => event.priority === filters.priority
      );
    }

    return filtered;
  }, [events, searchQuery, filters]);

  // Detect conflicts
  const conflicts = useMemo(() => {
    return detectConflicts(processedEvents);
  }, [processedEvents]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const eventsMap = {};

    processedEvents.forEach((event) => {
      const dateKey = event.date;
      if (!eventsMap[dateKey]) {
        eventsMap[dateKey] = [];
      }
      eventsMap[dateKey].push(event);
    });

    // Sort events by start time, then by priority for each date
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    Object.keys(eventsMap).forEach((dateKey) => {
      eventsMap[dateKey].sort((a, b) => {
        // First, sort by start time
        const timeA = a.startTime.split(":").map(Number);
        const timeB = b.startTime.split(":").map(Number);
        const minutesA = timeA[0] * 60 + timeA[1];
        const minutesB = timeB[0] * 60 + timeB[1];

        // If times are equal, sort by priority (high > medium > low)
        if (minutesA === minutesB) {
          // Normalize priority to lowercase for consistent comparison
          const priorityA =
            priorityOrder[(a.priority || "medium").toLowerCase()] ??
            priorityOrder.medium;
          const priorityB =
            priorityOrder[(b.priority || "medium").toLowerCase()] ??
            priorityOrder.medium;
          // Lower number means higher priority (high=0, medium=1, low=2)
          return priorityA - priorityB;
        }

        return minutesA - minutesB;
      });
    });

    return eventsMap;
  }, [processedEvents]);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateKey = dayjs(date).format("YYYY-MM-DD");
    return eventsByDate[dateKey] || [];
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    if (viewMode === "month") {
      setCurrentDate(currentDate.subtract(1, "month"));
    } else if (viewMode === "week") {
      setCurrentDate(currentDate.subtract(1, "week"));
    } else if (viewMode === "day") {
      setCurrentDate(currentDate.subtract(1, "day"));
    }
  };

  const goToNextMonth = () => {
    if (viewMode === "month") {
      setCurrentDate(currentDate.add(1, "month"));
    } else if (viewMode === "week") {
      setCurrentDate(currentDate.add(1, "week"));
    } else if (viewMode === "day") {
      setCurrentDate(currentDate.add(1, "day"));
    }
  };

  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Event management
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map((e) =>
        e.id === editingEvent.id ? { ...eventData, id: editingEvent.id } : e
      );
      setEvents(updatedEvents);
      saveEventsToStorage(updatedEvents);
      addToast(`Event "${eventData.title}" updated successfully`, 'success');
    } else {
      // Create new event
      const newEvent = {
        ...eventData,
        id: generateEventId(),
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      saveEventsToStorage(updatedEvents);
      addToast(`Event "${eventData.title}" added successfully`, 'success');
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    const eventToDelete = events.find((e) => e.id === eventId);
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((e) => e.id !== eventId);
      setEvents(updatedEvents);
      saveEventsToStorage(updatedEvents);
      addToast(`Event "${eventToDelete?.title || 'Event'}" deleted successfully`, 'success');
    }
  };

  // Handle JSON file import
  const handleImportJson = (jsonEvents, replaceExisting) => {
    // Process imported events - add IDs and default values
    const processedEvents = jsonEvents.map((event) => ({
      ...event,
      id: generateEventId(),
      category: event.category || "meeting",
      priority: (event.priority || "medium").toLowerCase(), // Normalize to lowercase for consistent lookup
      description: event.description || "",
      recurring: event.recurring || "none",
      color: event.color || "#3b82f6", // Default blue color if not provided
    }));

    let updatedEvents;
    if (replaceExisting) {
      // Replace all events
      updatedEvents = processedEvents;
      addToast(`${processedEvents.length} event(s) imported (replaced existing)`, 'success');
    } else {
      // Merge with existing events
      updatedEvents = [...events, ...processedEvents];
      addToast(`${processedEvents.length} event(s) imported successfully`, 'success');
    }

    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  // Clear all events and localStorage
  const handleClearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all events? This action cannot be undone."
      )
    ) {
      setEvents([]);
      saveEventsToStorage([]);
      addToast('All events cleared successfully', 'info');
    }
  };

  // Handle conflict resolution
  const handleViewConflicts = () => {
    if (conflicts.length > 0) {
      setIsConflictResolverOpen(true);
    }
  };

  const handleResolveConflict = (action, event) => {
    if (action === "delete") {
      const updatedEvents = events.filter((e) => e.id !== event.id);
      setEvents(updatedEvents);
      saveEventsToStorage(updatedEvents);
      addToast(`Event "${event?.title || 'Event'}" deleted successfully`, 'success');
    } else if (action === "edit") {
      setIsConflictResolverOpen(false);
      setEditingEvent(event);
      setIsModalOpen(true);
    } else if (action === "reschedule") {
      // Update event with new time
      const updatedEvents = events.map((e) =>
        e.id === event.id ? { ...event } : e
      );
      setEvents(updatedEvents);
      saveEventsToStorage(updatedEvents);
      addToast(`Event "${event?.title || 'Event'}" rescheduled successfully`, 'success');
    }
  };

  // Filter handlers
  const handleFilterChange = (key, value) => {
    if (key === "reset") {
      setFilters({ category: "all", priority: "all" });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Get calendar days based on view mode
  const getCalendarDays = () => {
    if (viewMode === "day") {
      return [currentDate];
    } else if (viewMode === "week") {
      const startOfWeek = currentDate.startOf("week");
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(startOfWeek.add(i, "day"));
      }
      return days;
    } else {
      // Month view
      const startOfMonth = currentDate.startOf("month");
      const endOfMonth = currentDate.endOf("month");
      const startOfCalendar = startOfMonth.startOf("week");
      const endOfCalendar = endOfMonth.endOf("week");

      const days = [];
      let day = startOfCalendar;

      while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, "day")) {
        days.push(day);
        day = day.add(1, "day");
      }

      return days;
    }
  };

  const calendarDays = getCalendarDays();
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="calendar-container max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 card-hover">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
          viewMode={viewMode}
          onViewChange={setViewMode}
          onCreateEvent={handleCreateEvent}
          onOpenImportJson={() => setIsImportModalOpen(true)}
          onClearAllData={handleClearAllData}
          conflicts={conflicts}
          onViewConflicts={handleViewConflicts}
        />

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <CalendarGrid
              calendarDays={calendarDays}
              currentDate={currentDate}
              selectedDate={selectedDate}
              eventsByDate={eventsByDate}
              onDateSelect={setSelectedDate}
              onCreateEvent={(date) => {
                setSelectedDate(date);
                handleCreateEvent();
              }}
              viewMode={viewMode}
            />
          </div>

          {/* Event List Sidebar */}
          <div className="lg:col-span-1">
            <EventList
              selectedDate={selectedDate}
              events={selectedDateEvents}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        event={editingEvent}
        selectedDate={selectedDate}
      />

      {/* JSON Import Modal */}
      <JsonImport
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportJson}
      />

      {/* Conflict Resolver Modal */}
      {isConflictResolverOpen && (
        <ConflictResolver
          conflicts={conflicts}
          allEvents={processedEvents}
          onResolve={handleResolveConflict}
          onClose={() => setIsConflictResolverOpen(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Calendar;
