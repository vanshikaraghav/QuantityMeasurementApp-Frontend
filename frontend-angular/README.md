# Quantity Measurement System (QMA) – Frontend

A modern, scalable, and responsive frontend application built using Angular for performing quantity conversions, arithmetic operations, and tracking user activity. The application is designed with clean architecture and seamless integration with backend microservices.

---

## Overview

The frontend of the Quantity Measurement System provides an intuitive and efficient interface for users to perform measurement-related operations.

It supports:

* Unit conversions across multiple categories
* Arithmetic operations on quantities
* Secure user authentication
* Operation history tracking
* Responsive UI for all devices

---

## Key Features

### Real-Time Operations

* Fast and accurate unit conversions
* Seamless arithmetic calculations

### Authentication & Security

* JWT-based authentication
* Route protection using guards
* Token handling using HTTP interceptors

### Operation History

* User-specific history tracking
* Clean and structured display

### Responsive UI

* Optimized for mobile, tablet, and desktop
* Clean and consistent UI

### Scalable Architecture

* Modular folder structure
* Separation of concerns

---

## Technology Stack

| Category         | Technology                 |
| ---------------- | -------------------------- |
| Framework        | Angular                    |
| Styling          | CSS / Tailwind CSS         |
| Routing          | Angular Router             |
| State Management | Angular (Signals/Services) |
| API Handling     | HttpClient + Interceptors  |
| Build Tool       | Angular CLI                |
| Deployment       | Render                     |

---

## Architecture & Design

The application follows a **modular and scalable architecture**:

* Component-based design
* Centralized API handling via services
* Authentication handled via guards & interceptors
* Reusable UI components
* Clean separation of logic and UI

---

## Project Structure

```bash
src/
│
├── app/
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   ├── history/
│   │   ├── login/
│   │   └── navbar/
│   │
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   ├── services/
│   │
│   ├── app.config.ts
│   └── app.routes.ts
│
├── environments/
│
├── index.html
├── main.ts
└── styles.css
```

---

## API Integration

Backend communication is handled using Angular HttpClient.

* Base URL configured in environment files
* JWT token automatically attached via interceptors

### Example

```ts
export const environment = {
  production: false,
  apiUrl: 'http://YOUR_BACKEND_URL'
};
```

---

## Setup and Installation

### Prerequisites

* Node.js
* Angular CLI

### Clone Repository

```bash
git clone https://github.com/RaiAkarsh/QuantityMeasurementApp-Frontend.git
```

### Install Dependencies

```bash
npm install
```

### Run Application

```bash
ng serve
```

Application runs on:

```
http://localhost:4200
```

---

## Production Build

```bash
ng build --configuration production
```

---

## Deployment

The frontend is deployed using:

* Render (Static Site Hosting)

---

## Design Principles

* Clean and maintainable code
* Reusable components
* Scalable architecture
* Secure API handling
* Separation of concerns

---

## Future Enhancements

* Google OAuth Login
* Advanced dashboard analytics
* More unit conversion categories
* PWA support
* Multi-language support

---

## Author

**Akarsh Rai**
B.Tech CSE
