import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High', color: '#ef4444' },    // Red for HIGH
  { value: 'medium', label: 'Medium', color: '#eab308' }, // Yellow for MEDIUM
  { value: 'low', label: 'Low', color: '#22c55e' },      // Green for LOW
];

const CATEGORY_OPTIONS = [
  { value: 'meeting', label: 'Meeting', color: '#3b82f6' },
  { value: 'deadline', label: 'Deadline', color: '#ef4444' },
  { value: 'personal', label: 'Personal', color: '#8b5cf6' },
  { value: 'work', label: 'Work', color: '#10b981' },
  { value: 'reminder', label: 'Reminder', color: '#f59e0b' },
];

const RECURRING_OPTIONS = [
  { value: 'none', label: 'No Repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const EventModal = ({ isOpen, onClose, onSave, event, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    category: 'meeting',
    priority: 'medium',
    color: '#3b82f6',
    recurring: 'none',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        date: event.date || dayjs().format('YYYY-MM-DD'),
        startTime: event.startTime || '09:00',
        endTime: event.endTime || '10:00',
        description: event.description || '',
        category: event.category || 'meeting',
        priority: event.priority || 'medium',
        color: event.color || '#3b82f6',
        recurring: event.recurring || 'none',
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
      }));
    }
  }, [event, selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-update color based on category
      if (name === 'category') {
        const category = CATEGORY_OPTIONS.find(c => c.value === value);
        if (category) {
          updated.color = category.color;
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter an event title');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const selectedCategory = CATEGORY_OPTIONS.find(c => c.value === formData.category);
  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === formData.priority);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-brand-700 via-royal-700 via-purple-700 to-brand-600 text-white p-6 md:p-8 rounded-t-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                {PRIORITY_OPTIONS.map(pri => (
                  <option key={pri.value} value={pri.value}>
                    {pri.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recurring */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat
            </label>
            <select
              name="recurring"
              value={formData.recurring}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
            >
              {RECURRING_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
              placeholder="Add event description..."
            />
          </div>

          {/* Color Preview */}
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <div className="flex gap-2 mt-6">
                {selectedCategory && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: selectedCategory.color }}
                  >
                    {selectedCategory.label}
                  </span>
                )}
                {selectedPriority && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: selectedPriority.color }}
                  >
                    {selectedPriority.label} Priority
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-brand-600 via-royal-600 to-brand-500 text-white rounded-xl hover:from-brand-700 hover:via-royal-700 hover:to-brand-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;

