# 🚀 MeetSync Backend

> **A scalable backend powering MeetSync — a real-time video conferencing platform built with Node.js, Express.js, MongoDB, Socket.IO, and WebRTC signaling.**

The MeetSync backend manages authentication, meeting scheduling, instant meeting creation, participant management, WebRTC signaling, and real-time communication. It is designed using a modular, production-inspired architecture with a strong focus on scalability, maintainability, and clean separation of concerns.

---

# 🏗️ System Architecture

```text
                        ┌──────────────────────────────┐
                        │      React Frontend          │
                        └──────────────┬───────────────┘
                                       │
                             REST APIs │ Socket.IO
                                       │
                        ┌──────────────▼───────────────┐
                        │      Express Backend         │
                        └──────────────┬───────────────┘
                                       │
         ┌─────────────────────────────┼────────────────────────────┐
         │                             │                            │
         ▼                             ▼                            ▼
 ┌────────────────┐          ┌────────────────┐          ┌─────────────────┐
 │   MongoDB      │          │ JWT + Cookies  │          │   Nodemailer    │
 │ (Meeting Data) │          │ Authentication │          │ Email Services  │
 └────────────────┘          └────────────────┘          └─────────────────┘
                                       │
                                       ▼
                              Socket.IO Signaling
                                       │
                                       ▼
                              WebRTC Peer Network
```

---

# ✨ Features

## 🔐 Authentication & Security

* User Registration
* Secure Login & Logout
* JWT Authentication
* HTTP-only Cookie Authentication
* Protected Routes
* Forgot Password
* Password Reset
* Email Services with Nodemailer
* Request Validation
* Centralized Error Handling

---

## 📅 Meeting Management

* Instant Meeting Creation
* Schedule Meetings
* Join Existing Meetings
* Fetch User Meetings
* Fetch Meeting Details
* Unique Room ID Generation
* Organizer & Participant Management
* Duplicate Join Prevention
* Meeting Status Tracking
* Shareable Meeting Links

---

## 🎥 Meeting Room

The backend serves as the **WebRTC signaling server**, coordinating peer-to-peer connections between participants.

### WebRTC Signaling

* SDP Offer Exchange
* SDP Answer Exchange
* ICE Candidate Exchange
* Peer Connection Negotiation
* Multi-participant Mesh Architecture

### Meeting Events

* Participant Joined
* Participant Left
* Existing Participant Synchronization
* Live Participant Count
* Live Participant List
* Screen Share Notifications

---

## 💬 Real-Time Collaboration

Implemented using **Socket.IO**

* Live Chat
* Typing Indicators
* Participant Synchronization
* Room Presence
* Screen Sharing Events
* Real-time Meeting Updates

---

# 📡 REST APIs

### Authentication

* Signup
* Login
* Logout
* Forgot Password
* Reset Password
* Current User

### Meetings

* Start Instant Meeting
* Schedule Meeting
* Join Meeting
* Get My Meetings
* Get Meeting Details

---

# 🛠️ Tech Stack

### Runtime

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* bcrypt
* cookie-parser

### Real-Time Communication

* Socket.IO
* WebRTC Signaling

### Email

* Nodemailer

### Validation

* express-validator

### Utilities

* dotenv
* crypto
* cors

---

# 📦 Major Packages

```text
express
mongoose
jsonwebtoken
bcrypt
cookie-parser
socket.io
express-validator
nodemailer
dotenv
cors
crypto
```

---

# ⚙️ Socket.IO Events

### Room Management

* join-room
* participant-joined
* existing-participants
* participant-count
* room-users
* user-left

### WebRTC Signaling

* offer
* answer
* ice-candidate

### Collaboration

* send-message
* receive-message
* user-typing

### Media

* screen-share-status

---

# 📌 Current Progress

## ✅ Implemented

### Authentication

* JWT Authentication
* Cookie-based Sessions
* Protected Routes
* Password Hashing
* Forgot Password Flow

### Meeting Management

* Instant Meetings
* Meeting Scheduling
* Join Meetings
* Meeting Retrieval APIs
* Organizer Detection
* Participant Tracking
* Meeting Status Management

### Real-Time Communication

* Socket.IO Integration
* WebRTC Signaling
* Multi-user Mesh Architecture
* Live Chat
* Typing Indicators
* Participant Count Synchronization
* Participant List Synchronization
* Join / Leave Notifications
* Screen Sharing Events

### Backend Architecture

* Modular Folder Structure
* Middleware Layer
* Validation Layer
* Centralized Error Handling
* RESTful API Design

---

# 🚧 In Progress

### Meeting Management

* Dashboard Meeting Management APIs
* Edit Scheduled Meetings
* Cancel Scheduled Meetings
* Delete Meetings
* Automatic Meeting Status Updates

### Authentication

* Email Verification
* Enhanced Password Recovery Flow

### Host Features

* Host Dashboard Improvements
* Meeting Lifecycle Management

---

# 🚀 Upcoming Features

## Meeting Experience

* Waiting Lobby
* Raise Hand
* Emoji Reactions
* Meeting Recording
* Virtual Background Support
* Breakout Rooms
* Polls
* Live Captions
* Speaker View
* Grid View

## Host Controls

* Remove Participants
* Mute Participants
* Lock Meeting
* Admit / Reject Users
* Participant Permissions
* Co-host Support

## Scheduling

* Calendar Integration
* Email Invitations
* Reminder Emails
* Meeting Rescheduling
* Recurring Meetings

## Dashboard

* Meeting History
* Recent Meetings
* Upcoming Meetings
* Dashboard Analytics
* Advanced Search & Filters

## Scalability & Performance

* SFU-based Media Architecture
* Redis-backed Socket Scaling
* Presence Service
* Horizontal Scaling
* Optimized Signaling Pipeline

---

# 💻 Local Setup

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URI=<your_mongodb_connection_string>

JWT_SECRET=<your_jwt_secret>

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

EMAIL_USER=<your_email>

EMAIL_PASS=<your_email_password>
```

---

# 🤝 Contributing

Contributions, feature suggestions, and feedback are welcome. Feel free to open an issue or submit a pull request.

---

# 📄 License

This project is built for educational purposes, portfolio showcasing, and continuous learning.

---

## ⭐ If you found this project interesting, consider giving it a star!

Your support motivates me to continue improving MeetSync with more production-grade features and scalable real-time architecture.
