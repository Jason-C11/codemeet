# CodeMeet&#8203;.io

CodeMeet is a mock coding interview platform designed to help users prepare for technical interviews. Users can practice data structures and algorithms questions independently or simulate real-time interview sessions with peers by simply sharing a link.

## Tech Stack

**Frontend**
- Next.js - React framework used to build the web application
- TypeScript - Type safety and improved code maintainability
- React - Component-based UI development
- Material UI - UI components and responsive styling
- Monaco Editor - In-browser code editor for writing and editing solutions

**Backend**
- Node.js - Backend runtime environment
- Express - REST API development and server-side request handling
- MongoDB - Database for storing users, problems, and submissions
- Mongoose - Object modeling and database schema management

**Code Execution**
- Python - Language used for executing submitted solutions
- Docker - Isolated sandbox environment for secure code execution

## Problem Dataset

[Problem Dataset](https://github.com/neenza/leetcode-problems/tree/master/problems)

A custom importer transforms the dataset into the CodeMeet database format by:
- Extracting Python function metadata
- Converting Python types into application-supported types
- Parsing sample test cases
- Validating supported problems before import

## In Progress

- Enhanced code evaluation and validation
- Real-time collaborative interview sessions
- AI-powered code feedback and suggestions
- Interview performance tracking
- Expanded problem support

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```