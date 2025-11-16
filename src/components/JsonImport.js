import React, { useRef, useState } from 'react';

const JsonImport = ({ isOpen, onClose, onImport }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvents, setEditedEvents] = useState([]);

  const validateAndParseJson = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);
          
          // Validate JSON structure
          if (!Array.isArray(jsonContent)) {
            throw new Error('JSON file must contain an array of events');
          }

          // Validate each event has required fields
          const requiredFields = ['title', 'date', 'startTime', 'endTime'];
          const invalidEvents = jsonContent.filter(event => {
            return requiredFields.some(field => !event.hasOwnProperty(field));
          });

          if (invalidEvents.length > 0) {
            throw new Error(
              `Some events are missing required fields. Each event must have: ${requiredFields.join(', ')}`
            );
          }

          resolve(jsonContent);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file. Please try again.'));
      };

      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Reset messages
    setError(null);
    setSuccess(null);
    setPreviewData(null);
    setIsEditing(false);
    setEditedEvents([]);

    // Check if file is JSON
    if (!file.name.toLowerCase().endsWith('.json')) {
      setError('Please select a JSON file (.json)');
      return;
    }

    setIsImporting(true);

    try {
      const jsonContent = await validateAndParseJson(file);
      setPreviewData({
        fileName: file.name,
        eventCount: jsonContent.length,
        events: jsonContent,
        totalEvents: jsonContent.length,
      });
      setEditedEvents(jsonContent.map((e, idx) => ({ ...e, _index: idx })));
      setIsImporting(false);
    } catch (err) {
      setError(err.message || 'Failed to parse JSON file. Please check the file format.');
      setIsImporting(false);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleEditEvent = (index, field, value) => {
    const updated = editedEvents.map((event, idx) => {
      if (idx === index) {
        return { ...event, [field]: value };
      }
      return event;
    });
    setEditedEvents(updated);
  };

  const handleDeleteEvent = (index) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updated = editedEvents.filter((_, idx) => idx !== index);
      setEditedEvents(updated);
      setPreviewData(prev => ({
        ...prev,
        eventCount: updated.length,
        totalEvents: updated.length,
      }));
    }
  };

  const handleImport = (replaceExisting) => {
    if (!previewData || editedEvents.length === 0) return;

    // Remove _index field before importing
    const eventsToImport = editedEvents.map(({ _index, ...event }) => event);
    
    onImport(eventsToImport, replaceExisting);
    setSuccess(`Successfully imported ${eventsToImport.length} event(s)!`);
    
    // Clear and close after a delay
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setError(null);
    setSuccess(null);
    setPreviewData(null);
    setIsEditing(false);
    setEditedEvents([]);
    setIsDragOver(false);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  const eventsToDisplay = isEditing ? editedEvents : (previewData?.events || []).slice(0, 5);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-brand-700 via-royal-700 via-purple-700 to-brand-600 text-white p-6 md:p-8 rounded-t-2xl shadow-lg z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm transition-transform hover:scale-110 hover:rotate-3 duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Import Events from JSON</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-300 hover:scale-110 active:scale-95"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isImporting}
          />

          {!previewData && !error && !success && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                ${isDragOver
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-105 shadow-xl shadow-brand-500/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-lg'
                }
                ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={handleButtonClick}
            >
              {isImporting ? (
                <div className="flex flex-col items-center gap-4">
                  <svg className="animate-spin h-12 w-12 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Processing file...</p>
                </div>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110 hover:rotate-6 duration-300">
                    <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Drag & drop your JSON file here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    or click to browse
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleButtonClick();
                    }}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    Select File
                  </button>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                    JSON files only (.json)
                  </p>
                </>
              )}
            </div>
          )}

          {/* Preview/Edit */}
          {previewData && !error && !success && (
            <div className="space-y-4 fade-in">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        File loaded successfully!
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {previewData.fileName} • {previewData.eventCount} event(s) found
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {isEditing ? 'Cancel Edit' : 'Edit Events'}
                  </button>
                </div>
              </div>

              {/* Event List - Edit or Preview */}
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {isEditing ? (
                  // Edit Mode
                  editedEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 transition-all hover:shadow-md hover:border-l-8"
                      style={{ borderLeftColor: event.color || '#3b82f6' }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Title *</label>
                          <input
                            type="text"
                            value={event.title || ''}
                            onChange={(e) => handleEditEvent(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date *</label>
                          <input
                            type="date"
                            value={event.date || ''}
                            onChange={(e) => handleEditEvent(index, 'date', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Start Time *</label>
                          <input
                            type="time"
                            value={event.startTime || ''}
                            onChange={(e) => handleEditEvent(index, 'startTime', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">End Time *</label>
                          <input
                            type="time"
                            value={event.endTime || ''}
                            onChange={(e) => handleEditEvent(index, 'endTime', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Color:</label>
                          <input
                            type="color"
                            value={event.color || '#3b82f6'}
                            onChange={(e) => handleEditEvent(index, 'color', e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform"
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(index)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover:scale-105 active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Preview Mode
                  eventsToDisplay.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 transition-all hover:shadow-md hover:scale-[1.02] hover:border-l-8"
                      style={{ borderLeftColor: event.color || '#3b82f6' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.date} • {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {!isEditing && previewData.totalEvents > 5 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                    +{previewData.totalEvents - 5} more event(s)
                  </p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-all hover:shadow-md">
                <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold mb-2">
                  <strong>Import Options:</strong>
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                  <li><strong>Replace:</strong> Removes all existing events and imports only the new ones</li>
                  <li><strong>Merge:</strong> Adds the new events to your existing calendar</li>
                </ul>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 fade-in transition-all hover:shadow-md">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-red-800 dark:text-red-300 mb-1">
                    Import Failed
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 fade-in transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-green-800 dark:text-green-300">{success}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!success && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-end gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              {previewData && (
                <>
                  <button
                    type="button"
                    onClick={() => handleImport(false)}
                    className="px-6 py-3 border-2 border-brand-500 text-brand-600 dark:text-brand-400 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all font-medium hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Merge
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImport(true)}
                    className="px-8 py-3 bg-gradient-to-r from-brand-600 via-royal-600 to-brand-500 text-white rounded-xl hover:from-brand-700 hover:via-royal-700 hover:to-brand-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    Replace & Import
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonImport;
