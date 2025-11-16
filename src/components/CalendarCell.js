import React, { useMemo } from 'react';
import dayjs from 'dayjs';

const CalendarCell = ({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onDateSelect,
  onCreateEvent,
}) => {
  // Detect overlapping events
  const { overlappingGroups, nonOverlappingEvents } = useMemo(() => {
    if (events.length === 0) {
      return { overlappingGroups: [], nonOverlappingEvents: [] };
    }

    // Convert time strings to minutes for easier comparison
    const eventsWithMinutes = events.map(event => {
      const [startH, startM] = event.startTime.split(':').map(Number);
      const [endH, endM] = event.endTime.split(':').map(Number);
      return {
        ...event,
        startMinutes: startH * 60 + startM,
        endMinutes: endH * 60 + endM,
      };
    });

    // Find overlapping events
    const processed = new Set();
    const overlappingGroups = [];
    const nonOverlappingEvents = [];

    eventsWithMinutes.forEach((event, index) => {
      if (processed.has(index)) return;

      const overlaps = [event];
      processed.add(index);

      // Find all events that overlap with this one
      eventsWithMinutes.forEach((otherEvent, otherIndex) => {
        if (processed.has(otherIndex)) return;

        const overlapsWithAny = overlaps.some(e => {
          return (
            (otherEvent.startMinutes < e.endMinutes &&
             otherEvent.endMinutes > e.startMinutes) ||
            (e.startMinutes < otherEvent.endMinutes &&
             e.endMinutes > otherEvent.startMinutes)
          );
        });

        if (overlapsWithAny) {
          overlaps.push(otherEvent);
          processed.add(otherIndex);
        }
      });

      if (overlaps.length > 1) {
        overlappingGroups.push(overlaps);
      } else {
        nonOverlappingEvents.push(event);
      }
    });

    return { overlappingGroups, nonOverlappingEvents };
  }, [events]);

  const handleClick = (e) => {
    // If clicking on empty space (not on an event), allow creating event
    if (e.target === e.currentTarget || e.target.closest('.calendar-cell')) {
      onDateSelect(day);
    }
  };

  const handleDoubleClick = () => {
    if (onCreateEvent) {
      onCreateEvent(day);
    }
  };

  // Calculate how many events we're showing
  const displayedEventCount = Math.min(
    nonOverlappingEvents.length + overlappingGroups.length,
    3
  );
  const remainingCount = events.length - displayedEventCount;

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`
        calendar-cell
        min-h-[120px] sm:min-h-[140px] md:min-h-[150px]
        p-3
        border-2 rounded-xl
        cursor-pointer
        transition-all duration-300
        group
        ${!isCurrentMonth 
          ? 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/50' 
          : isToday
            ? 'bg-gradient-to-br from-brand-50 to-royal-50 dark:from-brand-900/30 dark:to-royal-900/30 border-brand-400 dark:border-brand-500 shadow-lg ring-4 ring-brand-500 dark:ring-brand-400 ring-offset-2 dark:ring-offset-gray-900 hover:bg-gradient-to-br hover:from-brand-100 hover:to-royal-100 dark:hover:from-brand-900/50 dark:hover:to-royal-900/50 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-200 dark:hover:shadow-brand-900/40 hover:border-brand-500 dark:hover:border-brand-400 hover:z-10'
            : isSelected
              ? 'ring-2 ring-royal-400 dark:ring-royal-500 ring-offset-1 dark:ring-offset-gray-800 bg-royal-50 dark:bg-royal-900/20 border-royal-300 dark:border-royal-600 hover:bg-royal-100 dark:hover:bg-royal-900/30 hover:scale-[1.02] hover:shadow-xl hover:shadow-royal-200 dark:hover:shadow-royal-900/40 hover:border-royal-400 dark:hover:border-royal-500 hover:z-10'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-brand-50/30 dark:hover:from-gray-700 dark:hover:to-brand-900/20 hover:border-brand-400 dark:hover:border-brand-500 hover:shadow-xl hover:shadow-brand-100 dark:hover:shadow-brand-900/30 hover:scale-[1.02] hover:z-10 hover:-translate-y-1'
        }
      `}
    >
      {/* Date number */}
      <div className="flex items-center justify-between mb-2">
        <div
          className={`
            text-base md:text-lg font-bold transition-colors duration-300
            ${isToday 
              ? 'text-brand-600 dark:text-brand-400 pulse-today group-hover:text-brand-700 dark:group-hover:text-brand-300' 
              : isSelected 
                ? 'text-royal-600 dark:text-royal-400 group-hover:text-royal-700 dark:group-hover:text-royal-300' 
                : 'text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400'
            }
            ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500' : ''}
          `}
        >
          {day.format('D')}
        </div>
        {isToday && (
          <div className="w-2 h-2 bg-brand-500 dark:bg-brand-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
        )}
        {!isToday && isCurrentMonth && (
          <div className="w-2 h-2 bg-transparent group-hover:bg-brand-400 dark:group-hover:bg-brand-500 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        )}
      </div>

      {/* Events */}
      <div className="space-y-1">
        {/* Non-overlapping events */}
        {nonOverlappingEvents.slice(0, 2).map((event, idx) => {
          const priorityColors = {
            high: '#ef4444',    // Red for HIGH
            medium: '#eab308',  // Yellow for MEDIUM
            low: '#22c55e',     // Green for LOW
          };
          const priorityDot = event.priority ? (
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1"
              style={{ backgroundColor: priorityColors[event.priority] || '#6b7280' }}
            />
          ) : null;

          return (
            <div
              key={event.id || idx}
              className="event-item text-xs p-1.5 rounded-lg truncate shadow-sm dark:shadow-none transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:z-10 cursor-pointer group/event"
              style={{
                backgroundColor: `${event.color}15`,
                borderLeft: `3px solid ${event.color}`,
                color: '#1f2937',
              }}
              title={`${event.title} (${event.startTime} - ${event.endTime})${event.priority ? ` [${event.priority}]` : ''}`}
            >
              <div className="font-semibold truncate flex items-center gap-1 group-hover/event:text-brand-600 dark:group-hover/event:text-brand-400 transition-colors">
                {priorityDot}
                <span className="truncate">{event.title}</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5 opacity-75 group-hover/event:opacity-100 transition-opacity">
                {event.startTime} - {event.endTime}
              </div>
            </div>
          );
        })}

        {/* Overlapping events groups */}
        {overlappingGroups.slice(0, 1).map((group, groupIdx) => (
          <div
            key={`overlap-${groupIdx}`}
            className="event-item text-xs p-1 rounded transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:z-10 cursor-pointer group/overlap animate-pulse hover:animate-none"
            style={{
              backgroundColor: '#fee2e220',
              borderLeft: '3px solid #ef4444',
              color: '#1f2937',
            }}
            title={`${group.length} overlapping events`}
          >
            <div className="font-medium truncate group-hover/overlap:text-red-600 transition-colors">
              {group[0].title}
              {group.length > 1 && ` +${group.length - 1}`}
            </div>
            <div className="text-gray-500 text-[10px] opacity-75 group-hover/overlap:opacity-100 transition-opacity">
              {group[0].startTime} - {group[0].endTime}
            </div>
          </div>
        ))}

        {/* Show count if more events */}
        {remainingCount > 0 && (
          <div className="text-xs text-brand-600 dark:text-brand-400 font-medium pt-1 hover:underline hover:text-brand-700 dark:hover:text-brand-300 transition-all cursor-pointer hover:scale-105 inline-block">
            +{remainingCount} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarCell;

