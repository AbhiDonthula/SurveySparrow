import React from "react";

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  onFilterChange,
  filters,
}) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-500 focus:scale-[1.01]"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.category || "all"}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="px-4 py-2.5 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-500 font-medium cursor-pointer hover:scale-105 active:scale-95"
        >
          <option value="all">Filter by Category</option>
          <option value="meeting">Meeting</option>
          <option value="deadline">Deadline</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="reminder">Reminder</option>
        </select>

        <select
          value={filters.priority || "all"}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          className="px-4 py-2.5 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-500 font-medium cursor-pointer hover:scale-105 active:scale-95"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {(filters.category !== "all" || filters.priority !== "all") && (
          <button
            onClick={() => onFilterChange("reset", null)}
            className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
