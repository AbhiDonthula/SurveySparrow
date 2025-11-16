import React from "react";
import ViewModeSelector from "./ViewModeSelector";

const CalendarHeader = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  viewMode,
  onViewChange,
  onCreateEvent,
  onOpenImportJson,
  onClearAllData,
  conflicts = [],
  onViewConflicts,
}) => {
  const monthYear = currentDate.format("MMMM YYYY");

  return (
    <div className="relative bg-gradient-to-r from-brand-700 via-royal-700 via-purple-700 to-brand-600 text-white p-6 md:p-8 shadow-2xl overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
                {monthYear}
              </h2>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <ViewModeSelector
              currentView={viewMode}
              onViewChange={onViewChange}
            />

            <button
              onClick={onToday}
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-sm font-semibold backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40 group"
            >
              <span className="inline-block group-hover:animate-bounce">
                📍
              </span>{" "}
              Today
            </button>

            <button
              onClick={onCreateEvent}
              className="px-5 py-2.5 bg-white text-brand-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">Add Event</span>
            </button>

            {onViewConflicts && conflicts.length > 0 && (
              <button
                onClick={onViewConflicts}
                className="px-4 py-2.5 bg-orange-500/90 hover:bg-orange-600 text-white rounded-xl transition-all duration-300 font-medium flex items-center gap-2 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40 group relative"
                title={`${conflicts.length} conflict${
                  conflicts.length > 1 ? "s" : ""
                } detected`}
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:scale-110"
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
                <span className="hidden sm:inline">Conflicts</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {conflicts.length}
                </span>
              </button>
            )}

            {onOpenImportJson && (
              <button
                onClick={onOpenImportJson}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-medium flex items-center gap-2 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40 group"
                title="Import events from JSON file"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="hidden sm:inline">Import</span>
              </button>
            )}
            {onClearAllData && (
              <button
                onClick={onClearAllData}
                className="px-4 py-2.5 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition-all duration-300 font-medium flex items-center gap-2 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40 group"
                title="Clear all events from calendar"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-12"
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
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPreviousMonth}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-lg group"
            aria-label="Previous"
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex-1 h-1 bg-white/20 rounded-full"></div>

          <button
            onClick={onNextMonth}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-lg group"
            aria-label="Next"
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
