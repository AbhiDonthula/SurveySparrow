# SurveySparrow Calendar Application

A modern, feature-rich calendar web application built with React, Tailwind CSS, and Day.js. Manage your events with ease, import from JSON files, and intelligently resolve scheduling conflicts.

## ✨ Key Features

### 📅 Calendar Views

- **Month View**: Full month grid with all events
- **Week View**: 7-day detailed view for focused planning
- **Day View**: Single day view for hourly scheduling
- **Quick Navigation**: Jump to today, navigate between periods

### 🎯 Event Management

- **Create Events**: Add events manually with full details
- **Edit Events**: Click any event to modify details
- **Delete Events**: Remove unwanted events
- **Event Categories**: Meeting, Work, Deadline, Personal, Reminder
- **Priority Levels**: High, Medium, Low with visual indicators
- **Rich Details**: Title, description, time, location, category

### 📥 Import & Export

- **JSON Import**: Upload event data from JSON files
- **Preview Before Import**: Review and edit events before adding
- **Merge or Replace**: Choose to add to existing events or start fresh
- **Sample Data**: Includes [`sample-events.json`](sample-events.json) with 29 example events

### ⚠️ Intelligent Conflict Resolution

- **Automatic Detection**: Instantly identifies overlapping events
- **Visual Indicators**: Red borders and conflict badges on calendar
- **Conflict Modal**: Dedicated interface to review and resolve conflicts
- **Smart Suggestions**: Recommends 5 alternative time slots
- **Resolution Options**:
  - **Reschedule**: Pick from suggested times
  - **Edit**: Manually adjust event details
  - **Delete**: Remove conflicting events
- **Working Hours**: Respects 8 AM - 6 PM schedule with lunch break

### 🔍 Search & Filter

- **Keyword Search**: Find events by title or description
- **Category Filter**: Show only specific event types
- **Priority Filter**: Focus on high-priority items
- **Conflict Filter**: View only conflicting events

### 💾 Data Management

- **Local Storage**: Events persist across sessions
- **Clear Data**: Reset calendar with one click
- **Import/Export**: Easy data portability

### 🎨 Beautiful UI/UX

- **Modern Design**: Clean gradient backgrounds
- **Dark Mode Ready**: Automatic theme detection
- **Responsive**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions
- **Color-Coded Events**: Visual distinction by category
- **Today Highlighting**: Current date stands out

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SurveySparrow

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### First Steps

1. **Import Sample Data**: Click "Import" → Select [`sample-events.json`](sample-events.json)
2. **View Conflicts**: Check the orange "Conflicts" button if any appear
3. **Resolve Issues**: Click conflicts to see resolution options
4. **Add Your Events**: Use "Add Event" to create custom events
5. **Switch Views**: Try Month/Week/Day views for different perspectives

## 📋 Sample Events

The included [`sample-events.json`](sample-events.json) demonstrates:

- ✅ Multiple event categories
- ✅ Different priority levels
- ✅ Time conflicts (Nov 17: 9:00 AM overlaps)
- ✅ All-day and timed events
- ✅ Various time slots throughout the day

## 🏗️ Project Structure

```
SurveySparrow/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Calendar.js           # Main calendar logic
│   │   ├── CalendarHeader.js     # Navigation & controls
│   │   ├── CalendarGrid.js       # Month/Week/Day layouts
│   │   ├── CalendarCell.js       # Individual date cells
│   │   ├── EventModal.js         # Event creation/editing
│   │   ├── JsonImport.js         # JSON file import
│   │   ├── ConflictResolver.js   # Conflict management
│   │   └── EventList.js          # Event details display
│   ├── utils/
│   │   └── eventStorage.js       # Storage & conflict detection
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── sample-events.json            # Example events
├── package.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Tech Stack

- **React 18.2.0**: Modern hooks-based architecture
- **Tailwind CSS 3.4.1**: Utility-first styling
- **Day.js 1.11.10**: Lightweight date manipulation
- **LocalStorage API**: Client-side persistence

## 📅 Event Data Format

Events use this JSON structure:

```json
{
  "date": "2025-11-17",
  "startTime": "09:00",
  "endTime": "10:00",
  "title": "Team Standup",
  "description": "Daily sync meeting",
  "category": "Meeting",
  "priority": "High",
  "location": "Conference Room A",
  "color": "#3b82f6"
}
```

**Required Fields:**

- `date` (YYYY-MM-DD)
- `startTime` (HH:MM, 24-hour)
- `endTime` (HH:MM, 24-hour)
- `title` (string)

**Optional Fields:**

- `description`, `category`, `priority`, `location`, `color`

## 🎯 Conflict Resolution Algorithm

The app uses a multi-step approach:

1. **Detection**: Compares all events on each date

   ```javascript
   start1 < end2 && start2 < end1; // Overlap formula
   ```

2. **Grouping**: Groups conflicts by date for easy management

3. **Suggestion**: Finds free slots in working hours (8 AM - 6 PM)

   - Checks 30-minute intervals
   - Respects lunch break (12 PM - 1 PM)
   - Returns top 5 alternatives

4. **Resolution**: User chooses action (Reschedule/Edit/Delete)

## 🧪 Testing

```bash
# Run test suite
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📦 Build & Deploy

### Production Build

```bash
npm run build
```

Outputs optimized files to `build/` folder.

### Deployment Options

**Netlify:**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Vercel:**

```bash
npm install -g vercel
vercel --prod
```

**GitHub Pages:**

```bash
npm install --save-dev gh-pages

# Add to package.json:
"homepage": "https://<username>.github.io/SurveySparrow",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

npm run deploy
```

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)**: Comprehensive user guide
- **[CONFLICT_RESOLVER_GUIDE.md](CONFLICT_RESOLVER_GUIDE.md)**: Conflict resolution details
- **[JSON_IMPORT_GUIDE.md](JSON_IMPORT_GUIDE.md)**: Import feature documentation

## 🎨 Design Philosophy

- **User-Centric**: Intuitive interface requiring minimal learning
- **Proactive**: Detects issues before they become problems
- **Flexible**: Multiple ways to accomplish tasks
- **Responsive**: Adapts to any screen size
- **Performant**: Optimized rendering with React best practices

## 🐛 Troubleshooting

**Events not saving?**

- Check browser localStorage is enabled
- Clear data and re-import

**Conflicts not detected?**

- Verify event times are in 24-hour format
- Ensure dates match exactly

**Import failing?**

- Validate JSON format
- Check required fields are present

## 📝 Best Practices

- **Regular Imports**: Back up your events as JSON
- **Resolve Conflicts Early**: Check conflicts before busy periods
- **Use Categories**: Organize events for easier filtering
- **Set Priorities**: Mark important events as High priority
- **Add Descriptions**: Include meeting links and notes

## 📄 License

Created as an assignment submission for SurveySparrow.

## 👤 Author

Developed with attention to detail, modern best practices, and user experience in mind.

---
