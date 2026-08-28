# Placement Application Tracker

A full-stack web application for organising placement and internship applications, tracking progress, managing deadlines, and recording interview details.

## Live Application

[Open the live application](https://placement-application-tracker.vercel.app)

> The backend uses Render's free tier, so the first request may take up to one minute while the service wakes up.

## Features

- User registration and token-based authentication
- Private, user-specific application data
- Create, view, edit, and delete applications
- Track application status, dates, deadlines, job links, and notes
- Search by company or role
- Filter applications by status
- Sort applications by application date
- Responsive dashboard with automatically calculated statistics
- Persistent PostgreSQL storage
- Backend validation and automated API tests

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Fetch API
- Vercel

### Backend

- Python
- Django
- Django REST Framework
- Token authentication
- Gunicorn
- WhiteNoise
- Render

### Database

- PostgreSQL
- Neon

## Architecture

```text
React frontend
      |
      | HTTPS / JSON
      v
Django REST API
      |
      v
PostgreSQL database
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register/` | Register a user |
| POST | `/api/auth/login/` | Log in and receive a token |
| GET | `/api/applications/` | List the user's applications |
| POST | `/api/applications/` | Create an application |
| PATCH | `/api/applications/:id/` | Update an application |
| DELETE | `/api/applications/:id/` | Delete an application |

The application endpoints require token authentication.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/YacoubZabaneh/placement-application-tracker.git
cd placement-application-tracker
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies and initialise the database:

```bash
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8765
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Testing

Run the backend tests:

```bash
cd backend
python manage.py test
```

Run the frontend quality checks:

```bash
cd frontend
npm run lint
npm run build
```

## Security

- Passwords are hashed using Django's authentication system.
- Applications are restricted to their owners.
- Protected API requests require token authentication.
- Secrets and database credentials are stored in environment variables.
- Sensitive and generated files are excluded through `.gitignore`.

## What I Learned

This project strengthened my understanding of:

- Building and connecting React and Django applications
- Designing REST APIs and relational database models
- Implementing authentication and authorisation
- Type-safe frontend development with TypeScript
- Asynchronous API requests and React state management
- Writing automated backend tests
- Using Git and GitHub through a structured commit workflow
- Deploying a full-stack application with production environment variables

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## Author

**Yacoub Zabaneh**

BSc Computer Science student at the University of Bath.