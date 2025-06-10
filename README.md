# Workboard Lite - Task & Team Dashboard

A modern, responsive web application for managing team members, projects, and tasks with real-time collaboration features. Built with React.js and Firebase Realtime Database.

![Workboard Lite](https://img.shields.io/badge/React-18%2B-blue) ![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-orange) ![Responsive](https://img.shields.io/badge/Design-Responsive-green)

## 🚀 Features

### ✅ **Team Member Management**
- View all team members with their roles and contact information
- Add new team members with form validation
- Edit member roles with real-time updates
- Responsive grid layout for optimal viewing on all devices

### ✅ **Project Overview**
- List all projects with owner and status information
- Create new projects with detailed descriptions
- Filter projects by owner or status
- Click-through navigation to project task boards

### ✅ **Task Board (Kanban-style)**
- Visual kanban board with To Do, In Progress, and Done columns
- Drag-and-drop functionality via dropdown status changes
- Task cards showing title, assignee, and due dates
- Create, edit, and delete tasks with full CRUD operations
- Task detail modal with comprehensive information

### ✅ **Comments & Feedback System**
- Add comments to any task with author attribution
- Real-time comment updates and sorting by timestamp
- Clean, threaded comment display
- Auto-refresh on comment submission

### ✅ **Responsive Design**
- Mobile-first approach with breakpoints at 768px and 480px
- Tablet and desktop optimized layouts
- Touch-friendly interfaces for mobile devices
- Consistent UI across all screen sizes

## 🛠️ Tech Stack

- **Frontend Framework:** React.js 18+
- **Routing:** React Router v6
- **Database:** Firebase Realtime Database
- **Styling:** Pure CSS with CSS Grid and Flexbox
- **HTTP Client:** Fetch API
- **State Management:** React Hooks (useState, useEffect)

## 📁 Project Structure
  ```
  workboard-lite/
  ├── public/
  │ ├── index.html
  │ └── favicon.ico
  ├── src/
  │ ├── components/
  │ │ ├── Team/
  │ │ │ ├── index.js # Team management component
  │ │ │ └── index.css # Team-specific styles
  │ │ ├── Projects/
  │ │ │ ├── index.js # Project overview component
  │ │ │ └── index.css # Project-specific styles
  │ │ ├── TaskBoard/
  │ │ │ ├── index.js # Kanban task board component
  │ │ │ └── index.css # Task board styles
  │ │ ├── Comments/
  │ │ │ ├── index.js # Comments system component
  │ │ │ └── index.css # Comments styles
  │ │ ├── Layout/
  │ │ │ ├── index.js # App layout and navigation
  │ │ │ └── index.css # Layout styles
  │ │ └── Modal/
  │ │ ├── index.js # Reusable modal component
  │ │ └── index.css # Modal styles
  │ ├── App.js # Main app component with routing
  │ ├── App.css # Global styles and utilities
  │ └── index.js # App entry point
  ├── package.json # Dependencies and scripts
  └── README.md # Project documentation
  ```

## 🔗 API Integration

### Firebase Realtime Database Structure

```json
{
  "team_members": {
    "member_id": {
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Developer"
    }
  },
  "projects": {
    "project_id": {
      "title": "Project Name",
      "owner": "member_id",
      "status": "active",
      "description": "Project description",
      "created_at": "2024-01-01T10:00:00Z"
    }
  },
  "tasks": {
    "task_id": {
      "title": "Task Name",
      "project_id": "project_id",
      "assigned_to": "member_id",
      "status": "todo",
      "due_date": "2024-01-15",
      "description": "Task description",
      "created_at": "2024-01-01T10:00:00Z"
    }
  },
  "comments": {
    "comment_id": {
      "task_id": "task_id",
      "author": "member_id",
      "comment_text": "Comment content",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  }
}
```
## API Endpoints Used
```
  GET https://workboardlite-default-rtdb.firebaseio.com/team_members.json - Fetch all team members
  POST https://workboardlite-default-rtdb.firebaseio.com/team_members.json - Create new team member
  PATCH https://workboardlite-default-rtdb.firebaseio.com/team_members/{id}.json - Update team member
  GET https://workboardlite-default-rtdb.firebaseio.com/projects.json - Fetch all projects
  POST https://workboardlite-default-rtdb.firebaseio.com/projects.json - Create new project
  GET https://workboardlite-default-rtdb.firebaseio.com/tasks.json - Fetch all tasks
  POST https://workboardlite-default-rtdb.firebaseio.com/tasks.json - Create new task
  PATCH https://workboardlite-default-rtdb.firebaseio.com/tasks/{id}.json - Update task
  DELETE https://workboardlite-default-rtdb.firebaseio.com/tasks/{id}.json - Delete task
  GET https://workboardlite-default-rtdb.firebaseio.com/comments.json - Fetch all comments
  POST https://workboardlite-default-rtdb.firebaseio.com/comments.json - Create new comment
```

# 🚀 Getting Started

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Firebase account (database already configured)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/seshu362/Workboard-Lite-Task-Team-Dashboard
   cd workboard-lite
2. **Install dependencies**
   ```bash
   npm install
3. **Start the development server**
   ```bash
   npm start
4. **Open your browser**
   ```bash
   Navigate to http://localhost:3000

## 📱 Responsive Breakpoints

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px  
- **Desktop:** 1024px and above

### Mobile Features
- Collapsible navigation
- Touch-optimized buttons and forms
- Single-column layouts
- Optimized modal sizes

### Tablet Features
- Two-column grid layouts
- Adaptive navigation
- Touch and mouse support

### Desktop Features
- Full multi-column layouts
- Hover states and transitions
- Optimized for keyboard navigation

## 🎯 Key Implementation Details

### Component Architecture
- **Modular Design:** Each feature is a self-contained component
- **API Integration:** Direct fetch calls within components using useEffect
- **State Management:** Local state with React hooks for simplicity
- **Responsive CSS:** Mobile-first approach with progressive enhancement

### Data Flow
1. Components fetch data on mount using useEffect
2. User interactions trigger API calls
3. Successful operations refresh the local state
4. UI updates automatically via React's reactive system

### Error Handling
- Form validation with user-friendly messages
- API error catching with console logging
- Loading states for better user experience
- Confirmation dialogs for destructive actions

## 🔮 Future Enhancements

### Potential Improvements
- **Real-time Updates:** WebSocket integration for live collaboration
- **User Authentication:** Firebase Auth integration
- **Drag & Drop:** Physical drag-and-drop for task status changes
- **File Attachments:** Upload and attach files to tasks
- **Notifications:** In-app notifications for task updates
- **Performance:** Data pagination for large datasets
- **Offline Support:** Service worker for offline functionality

### Known Limitations
- No real-time collaboration (requires manual refresh)
- Basic error handling (could be more sophisticated)
- No user authentication (open access)
- No data caching (fetches on every component mount)

## 🧪 Testing

Currently, the application includes:
- Basic form validation
- Error boundary handling
- Responsive design testing across devices

## 📄 License

This project is created for educational purposes as part of a frontend internship assignment.

## 👨‍💻 Developer

Built with ❤️ using modern React.js practices and Firebase integration.

---

**Note:** This application demonstrates real-world frontend development skills including API integration, responsive design, component architecture, and state management suitable for production applications.
