import React from 'react';
import dayjs from 'dayjs';

const EventList = ({ selectedDate, events, onEditEvent, onDeleteEvent }) => {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateDuration = (startTime, endTime) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${minutes} min`;
    }
  };

  const isToday = selectedDate.isSame(dayjs(), 'day');
  const dateDisplay = isToday
    ? 'Today'
    : selectedDate.format('MMMM D, YYYY');

  return (
    <div className="event-list-sidebar bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-6 shadow-lg card-hover">
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          {dateDisplay}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {selectedDate.format('dddd')}
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-3 opacity-50"
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
          <p className="text-sm">No events scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => {
            const priorityColors = {
              high: '#ef4444',    // Red for HIGH
              medium: '#eab308',  // Yellow for MEDIUM
              low: '#22c55e',     // Green for LOW
            };
            const priorityColor = priorityColors[event.priority] || '#6b7280';

            return (
              <div
                key={event.id || index}
                className="event-card p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-l-8 cursor-pointer group card-hover hover:z-10 relative"
                style={{
                  borderLeftColor: event.color,
                  backgroundColor: `${event.color}12`,
                }}
                onClick={() => onEditEvent && onEditEvent(event)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 dark:text-white text-base mb-2">
                      {event.title}
                    </h4>
                    {event.priority && (
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-medium rounded-full text-white mb-1"
                        style={{ backgroundColor: priorityColor }}
                      >
                        {event.priority.toUpperCase()}
                      </span>
                    )}
                    {event.category && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700 ml-1">
                        {event.category}
                      </span>
                    )}
                    {event.recurring && event.recurring !== 'none' && (
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 ml-1">
                        🔁 {event.recurring}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {onEditEvent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(event);
                        }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                        title="Edit"
                      >
                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {onDeleteEvent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(event.id);
                        }}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                        title="Delete"
                      >
                        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
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
                    <span>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span>Duration: {calculateDuration(event.startTime, event.endTime)}</span>
                  </div>
                  
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;

