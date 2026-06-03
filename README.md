# SAPS – Student Academic & Placement System

## 🚀 Overview

SAPS (Student Academic & Placement System) is a full-stack web application designed to help students manage academics, track placement preparation, monitor skills, and improve overall career readiness. The platform also provides dedicated dashboards for faculty members and placement officers to monitor student progress and placement analytics.

The system bridges the gap between academic learning and placement preparation by offering a centralized platform for progress tracking, skill development, project management, and performance analytics.

---

## ✨ Features

### 👨‍🎓 Student Module

- Secure authentication and authorization using JWT
- Personalized student dashboard
- Placement readiness score tracking
- Skills management and proficiency tracking
- Project portfolio management
- Academic study plan creation
- Daily task management
- Progress analytics and performance insights
- Responsive and user-friendly interface

### 👨‍🏫 Faculty Module

- Faculty dashboard for student monitoring
- Subject management
- Unit and syllabus tracking
- Academic content management
- Student performance analysis

### 🏢 Placement Cell Module

- Placement analytics dashboard
- Institution-wide readiness monitoring
- Student placement preparedness tracking
- Top-performing student insights
- Placement progress reports
- Readiness distribution visualization

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Express Validator
- bcrypt.js

### Database

- MongoDB Atlas / MongoDB

---

## 🏗️ Architecture

### Frontend Architecture

- Component-based React architecture
- Protected routes
- Context API for authentication state management
- Responsive design with Tailwind CSS
- Dynamic dashboards and analytics visualizations

### Backend Architecture

- RESTful API design
- Modular controller-route structure
- JWT-based authentication middleware
- Role-based access control
- MongoDB integration using Mongoose ODM

---

## 📊 Core Functionalities

### Placement Readiness Score

The platform calculates a student's placement readiness using:

- Academic progress
- Skills acquired
- Project portfolio completion
- Study plan completion
- Consistency in task completion

### Analytics Dashboard

Provides insights into:

- Task completion rates
- Academic progress
- Placement readiness trends
- Skill development metrics
- Student performance comparison

### Project Portfolio

Students can:

- Add personal projects
- Track project progress
- Showcase technical skills
- Maintain a portfolio for placements

### Skill Tracking

- Add technical and non-technical skills
- Track proficiency levels
- Monitor growth over time
- Visual skill analytics

---

## 🔐 Authentication & Authorization

SAPS implements secure authentication using:

- JWT Access Tokens
- Password hashing with bcrypt
- Protected API routes
- Role-based access control

Supported roles:

- Student
- Faculty
- Placement Officer

---

## 📁 Project Structure

```bash
SAPS
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── context
│   └── services
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── utils
│   └── config
└── README.md
```

## ⚙️ Installation

### Clone Repository

bash 
git clone https://github.com/paawansaxna/Saps.git
cd Saps 

### Backend Setup

bash 
cd backend
npm install 
npm run dev 

### Frontend Setup

bash
cd frontend
npm install
npm run dev 

## 🔑 Environment Variables

Create a .env file inside the backend folder:

env PORT=5000  
MONGODB_URI=your_mongodb_connection_string  
ACCESS_TOKEN_SECRET=your_secret_key  
ACCESS_TOKEN_EXPIRY=1d 

## 🎯 Use Cases

- Student placement preparation
- Academic progress monitoring
- Skill development tracking
- Faculty performance monitoring
- Placement cell analytics
- Career readiness assessment

---

## 🚀 Future Enhancements

- AI-powered study recommendations
- Resume analyzer and ATS scoring
- Mock interview module
- Company-specific preparation paths
- Email notifications
- Advanced placement prediction analytics
- Leaderboards and gamification

---

## 💡 Key Highlights

- Full-stack MERN application
- Role-based dashboards
- JWT authentication
- Placement readiness scoring
- Analytics and visualization
- Responsive design
- Scalable architecture
- RESTful APIs

---

## 👨‍💻 Developed By

Paawan Saxena

B.Tech Computer Science Engineering

Jabalpur Engineering College (JEC)

Focused on building solutions that enhance student productivity, placement preparation, and academic success.

---

## 📄 License

This project is developed for educational and placement preparation platform
