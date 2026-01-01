# Vendra – Online Car Marketplace

Vendra is a full-stack web-based car marketplace application that enables users to buy and sell cars through a structured, secure, and user-friendly platform. The system supports car listings, user authentication, messaging, reviews, favorites, and a full administrative dashboard for moderation and management.

---

## Course Information
- **Course:** CSCI313 – Software Engineering  
- **University:** Nile University  
- **Semester:** Fall 2025  

---

## Team Members
- **Anas Abdelhakim Abdelgayed** – Authentication, Messaging & Project Setup  
- **Abdelrhman Akram Omar** – Main Marketplace & Listings  
- **Abdullah Sayed Maher** – Admin Dashboard & Moderation System  

---

## Features

### User Features
- User registration and login  
- OTP verification and password recovery  
- User profile and settings  
- Browse car listings  
- Create, edit, and manage listings  
- Explore listings by category and location  
- Save favorite listings  
- Chat with other users  
- Leave and view seller reviews  
- Receive notifications  

### Admin Features
- Admin dashboard  
- Approve or reject listings  
- Manage users  
- View analytics  
- Handle reported listings  
- Moderate platform content  

---

## Technology Stack

### Frontend
- HTML, CSS, Bootstrap  
- JavaScript / React / Next.js  
- UI design using **Stitch**

### Backend
- Java Spring Boot  
- RESTful APIs  
- Spring MVC architecture  

### Database
- PostgreSQL  
- JPA / Hibernate  

### DevOps & Tools
- GitHub for version control  
- GitHub Actions for CI  
- Maven  
- npm  

---

## Software Architecture

The backend follows a **feature-first architecture** and applies the **MVC (Model–View–Controller)** design pattern:

- **Model:** JPA entities and repositories  
- **Controller:** REST controllers handling HTTP requests  
- **Service:** Business logic layer  

### Design Patterns Used
- MVC (Model–View–Controller)  
- Repository Pattern  
- Service Layer Pattern  
- DTO Pattern (where applicable)  

This architecture improves modularity, maintainability, and scalability.

---

## Project Structure (Simplified)

backend/
├── controllers/
├── services/
├── repositories/
├── models/
└── config/

frontend/
├── components/
├── pages/
├── styles/
└── hooks/


---

## Agile Methodology

The project was developed using **Agile (Scrum-inspired)** practices:
- Work divided into weekly sprints  
- Tasks tracked using a Google Sheets backlog  
- Story points used for effort estimation  
- Clear task ownership per team member  
- Continuous integration via GitHub Actions  

---

## Testing & CI
- Unit testing implemented using **JUnit**  
- Automated tests executed via **GitHub Actions CI pipeline**  
- CI runs automatically on push and pull requests  

---

## Deployment
The application was developed and tested in a local environment. Public deployment was not part of the required scope for this phase. The system architecture supports future cloud deployment without major changes.

---

## How to Run the Project

### Backend
1. Install Java 17+ and Maven  
2. Configure PostgreSQL database  
3. Update `application.properties`  
4. Run:
   ```bash
   mvn spring-boot:run


### Frontend

1. Install Node.js
2. Navigate to frontend directory
3. Run:
  ```bash
  npm install
  npm run dev
```

### License

This project was developed for academic purposes as part of the Software Engineering course.

### Acknowledgments

Special thanks to the course instructors and teaching assistants for their guidance and support.
