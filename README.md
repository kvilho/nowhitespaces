# nowhitespaces

[![Backend CI](https://github.com/kvilho/nowhitespaces/actions/workflows/backend.yml/badge.svg)](https://github.com/kvilho/nowhitespaces/actions/workflows/backend.yml)
[![Frontend CI](https://github.com/kvilho/nowhitespaces/actions/workflows/frontend.yml/badge.svg)](https://github.com/kvilho/nowhitespaces/actions/workflows/frontend.yml)

# Hourbook
Hourbook - Work Hour Management System

![alt text](./documents/hourbook.jpg "Logo")


## About the project
This application is designed to help employers and employees track and manage work hours efficiently. It consists of a Java Spring Boot back-end that handles business logic, database interactions, and APIs, paired with a React front-end for a user-friendly interface. The system aims to streamline time tracking and reporting. 

## Use cases
### Approve Work Hours

Actors: Employer

Description: Employers can review and approve work hours submitted by employees.

Preconditions:

* Employers are logged in.
Postconditions:
* Work hours are marked as approved or rejected.
Basic Flow:

1. Employer navigates to the "Pending Work Hours" page.
2. Reviews submitted hours by employees.
3. Approves or rejects the submission with optional comments.
4. System updates the status in the database.

Alternate Flows:

* Employers can filter by employee, date, or project for faster review.

### Edit Work Hours

Actors: Employee

Description: Employees can edit work hour entries that have not yet been approved.

Preconditions:

* Employees are logged in.
* The entry status is "Pending."

Postconditions:

* System updates the entry with the new details.

Basic Flow:

1. Employee navigates to the "My Work Hours" page.
2. Selects an entry with "Pending" status.
3. Updates the relevant fields.
4. Saves the changes.
5. System validates and updates the entry in the database.

## Database

![alt text](./documents/HourbookDiagram.png "Relational diagram")

## 🚀 Deployment

The application consists of a Spring Boot backend and a Vite-based frontend.

### 🛠 Backend (Spring Boot)

✅ Deployed and running at:

🔗 [https://hourbook-hourbook.2.rahtiapp.fi/](https://hourbook-hourbook.2.rahtiapp.fi/)

The backend provides the core REST API used by the application.  
See [📚 REST API Documentation](#-rest-api-documentation) for available endpoints and usage.

### 🎨 Frontend (Vite)

✅ Deployed and running at:

🔗 [https://hourbook-frontend-hourbook.2.rahtiapp.fi/](https://hourbook-frontend-hourbook.2.rahtiapp.fi/)

## 📘 Project Documentation

### 🛠 Technologies Used

#### Frontend
- **Language:** TypeScript
- **Framework:** React (with Vite)
- **Key Libraries:**
  - `react-router-dom` – Client-side routing
  - `@mui/material` – Material UI component library
  - `@emotion/react`, `@emotion/styled` – Styling support
  - `date-fns` – Date utility library
  - `react-big-calendar` – Calendar and scheduling

#### Backend
- **Language:** Java
- **Framework:** Spring Boot
- **Key Frameworks/Libraries:**
  - `Spring Security` – Authentication and authorization
  - `Spring Data JPA` – ORM and database operations

---

### 📁 Project Structure

#### Frontend

#### Backend

## ⚙️ Setup Instructions

To run the project locally, follow the steps below for both frontend and backend.

### 🔧 Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Java JDK 17](https://jdk.java.net/17/)
- [Maven](https://maven.apache.org/)
- [Git](https://git-scm.com/)

---

### 🎨 Frontend Setup (React + TypeScript with Vite)

```bash
cd frontend
npm install
npm run dev
```

After running, the frontend will be available at:
🌐 http://localhost:5173

### 🛠 Backend Setup (Spring Boot)

```bash
cd backend
./mvnw package
./mvnw spring-boot:run
```

Once started, the backend will be available at:
🌐 http://localhost:8080

## 📚 REST API Documentation

This application provides a RESTful API for managing:

- `users`
- `roles`
- `permissions`
- `organizations`
- `entries`

The API is fully documented and testable via Swagger.

### 🔗 Swagger Documentation

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)  
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

Using Swagger UI, you can:
- Browse and test all endpoints interactively
- View input and output schemas
- Inspect validation rules and error responses

---

### 🧭 Endpoint Overview

| Resource        | GET (/{id}, list) | POST | PUT /{id} | DELETE /{id} |
|----------------|-------------------|------|-----------|---------------|
| `/users`       | ✅                | ✅   | ✅        | ✅            |
| `/roles`       | ✅                | ✅   | ✅        | ✅            |
| `/permissions` | ✅                | ✅   | ✅        | ✅            |
| `/organizations` | ✅              | ✅   | ✅        | ✅            |
| `/entries`     | ✅                | ✅   | ✅        | ✅            |

---


## Team Members
- Vilho Karhu https://github.com/kvilho
- Julius Luhtala https://github.com/juliusluhtala
- Nikolas Kataja https://github.com/bhi049
- Kasperi Kuusanmäki https://github.com/kapseri
- Ville Kotilainen https://github.com/villekotilainen

## Backlog Link
https://app.clickup.com/9012737518/v/l/8ck6xfe-732
