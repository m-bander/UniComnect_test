# UniConnect 🎓

> An all-in-one academic management platform that combines Google Classroom, Google Drive, and WhatsApp into a unified web experience.

## 📌 Overview

Managing college courses shouldn't require juggling 5+ different apps. UniConnect consolidates course announcements, materials, assignments, group chats, and calendars into one seamless platform designed specifically for academic workflows.

Built as our Database Systems course project, UniConnect addresses the common frustration of switching between Google Classroom, Drive, WhatsApp, and various calendar apps just to stay on top of coursework.

---

## 💡 System Description

UniConnect connects multiple types of users through one integrated platform:

* **Students**: Browse courses, access materials, submit assignments, participate in group chats, and track deadlines
* **Course Heads**: Students responsible for uploading and managing course materials
* **Class Representatives**: Student representatives with additional course management capabilities
* **Instructors**: Full course control, create assignments, post announcements, manage course content
* **Teaching Assistants (TAs)**: Assist instructors with course management and student support

All interactions are handled through a **central PostgreSQL database**, accessed securely via the application interface.

---

## ✨ Features

### 📚 Course Management
- **Announcements**: Post course updates, important notices, and even create Polls & Votes
- **Materials**: Upload and organize lecture slides, sheets, solutions, and other resources
- **Assignments & Submissions**: Create assignments, set deadlines, collect and grade student submissions
- **Course Calendar**: Unified view of all events (quizzes, submissions, projects, etc.) across enrolled courses with filtering options

### 💬 Communication
- **Built-in Group Chat**: Every course has its own group chat
- **Real-time Notifications**: Stay updated on new announcements, assignments, and messages

### 👥 Role-Based Access Control
Support for multiple user roles with specific privileges:
- **Students**: Access course materials, submit assignments, participate in discussions
- **Course Heads**: Students responsible for managing and uploading course materials
- **Class Representatives**: Student representatives with additional management capabilities
- **Instructors/TAs**: Full course control, create assignments, manage announcements

### 📊 Analytics & Reporting
- Reports and statistics dashboard for instructors and admins
- Track student engagement and assignment completion
- Monitor course activity

---

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.JPG)
*Main dashboard showing enrolled courses and recent activity*

### Course Page
![Course Page](screenshots/course-page.JPG)
![Course Page](screenshots/course-page2.JPG)
![Course Page](screenshots/course-page3.JPG)
*Course view with announcements, materials, and assignments*

### Group Chat
![Group Chat](screenshots/group-chat.JPG)
*Built-in group chat for course discussions*

### Calendar View
![Calendar](screenshots/calendar.JPG)
*Unified calendar showing all course events*

### Assignment Submission
![Assignment Submission](screenshots/assignment-submission.JPG)
![Assignment Submission](screenshots/assignment-submission2.JPG)
*Assignment submission interface*

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Shadcn
- Tailwind CSS

**Backend:**
- Node.js
- Express.js

**Database:**
- PostgreSQL

**Features:**
- RESTful API architecture
- File upload handling
- Real-time notifications
- Authentication & authorization
- Role-based access control

---

## 🔧 Backend

* RESTful backend handling all system logic
* Role-based authorization for different user types
* Secure authentication with hashed passwords
* Business logic implemented manually
* All database access is done through the backend API
* Separate backend repository: [Add backend repo link if applicable]

---

## 👨‍💻 Team

- **Moslem Ahmed** - [GitHub](https://github.com/MoslemAhmed1) | [LinkedIn](https://www.linkedin.com/in/moslem-ahmed-153bb1312/)
- **Marwan Mohammed** - [GitHub](https://github.com/Marwan878) | [LinkedIn](#https://www.linkedin.com/in/marwanmoh/)
- **Abdulrhman Jalal** - [GitHub](#https://github.com/abdulrhman-dev) | [LinkedIn](#https://www.linkedin.com/in/abdulrhman-jalal-9a139a36b/)

---

## 📝 Course Context

This project was developed as part of the **Database Systems** course at Cairo University, Faculty of Engineering - Computer Engineering Department.

---

## 📄 License

This project was developed for educational purposes.
