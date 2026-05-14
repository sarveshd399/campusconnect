# 🎓 CampusConnect

A full-stack social media platform where students and residents can discover and join **real-time group chats** by city, college, or school.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-green?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=flat-square)
![WebSocket](https://img.shields.io/badge/Chat-WebSocket-purple?style=flat-square)

---

## 📌 About

CampusConnect lets users search for and join communities based on their city, college, or school. Once inside a community, members can chat with each other in real time. Users can also create new communities that don't exist yet.

Built as a portfolio project to demonstrate full-stack development skills including REST API design, JWT authentication, WebSocket integration, and a React SPA frontend.

---

## ✨ Features

- 🔐 **User Auth** — Register and login with JWT-based authentication
- 🔍 **Search Communities** — Filter by name, city, college, or school
- 👥 **Join & Leave** — Become a member of any community
- ➕ **Create Communities** — Add communities that don't exist yet
- 💬 **Real-time Chat** — Live group messaging using WebSockets (STOMP + SockJS)
- 👤 **Profile Page** — View your info and all joined communities
- 🌱 **Pre-seeded Data** — 22 communities across Indian cities, colleges, and schools loaded on startup

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 + Spring Boot 3.2 | Core framework |
| Spring Security + JWT | Authentication & authorization |
| Spring Data JPA + Hibernate | Database ORM |
| WebSocket + STOMP | Real-time chat |
| PostgreSQL | Relational database |
| Maven | Dependency management |
| Lombok | Reduce boilerplate code |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend |
| SockJS + STOMP.js | WebSocket client for live chat |
| Context API | Global auth state management |

---

## 📁 Project Structure

```
campusconnect/
├── backend/                        # Spring Boot application
│   └── src/main/java/.../
│       ├── entity/                 # JPA entities (User, Community, Message)
│       ├── repository/             # Spring Data JPA repositories
│       ├── service/                # Business logic
│       ├── controller/             # REST API endpoints
│       ├── dto/                    # Data Transfer Objects
│       ├── security/               # JWT filter and service
│       └── config/                 # Security, WebSocket, CORS, DataSeeder
│
├── frontend/                       # React application
│   └── src/
│       ├── pages/                  # Login, Register, Home, Search, Chat, Profile
│       ├── components/             # Navbar, CommunityCard
│       ├── context/                # AuthContext (global auth state)
│       └── services/               # api.js (all Axios calls)
│
└── README.md
```

---

## 🗄️ Database Schema

```
users
  id, name, email, password, city

communities
  id, name, type (CITY/COLLEGE/SCHOOL), description

memberships           ← join table
  user_id, community_id

messages
  id, content, sender_id, community_id, timestamp
```

---

## 🚀 Running Locally

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven

---

### Backend Setup

**1. Create the database**
```sql
CREATE DATABASE campusconnect;
```

**2. Update database credentials**

Open `backend/src/main/resources/application.yml` and update:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/campusconnect
    username: postgres
    password: YOUR_PASSWORD_HERE
```

**3. Run the application**
```bash
cd backend
./mvnw spring-boot:run
```

Backend starts on `http://localhost:8080`

On first startup, Hibernate auto-creates all tables and the DataSeeder inserts 22 communities automatically.

---

### Frontend Setup

**1. Install dependencies**
```bash
cd frontend
npm install
```

**2. Start the dev server**
```bash
npm run dev
```

Frontend starts on `http://localhost:3000`

> Make sure the backend is running before starting the frontend.

---

## 📡 API Endpoints

### Auth (Public)
| Method | URL | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |

### Communities (Protected — requires Bearer token)
| Method | URL | Description |
|---|---|---|
| GET | `/api/communities/search?query=&type=` | Search communities |
| GET | `/api/communities/mine` | Get joined communities |
| GET | `/api/communities/{id}` | Get one community |
| POST | `/api/communities` | Create a community |
| POST | `/api/communities/{id}/join` | Join a community |
| POST | `/api/communities/{id}/leave` | Leave a community |

### Chat (Protected)
| Method | URL | Description |
|---|---|---|
| GET | `/api/communities/{id}/messages` | Load message history |
| POST | `/api/communities/{id}/messages` | Send a message (broadcasts via WebSocket) |

### WebSocket
| Endpoint | Description |
|---|---|
| `ws://localhost:8080/ws` | SockJS connection endpoint |
| Subscribe: `/topic/community/{id}` | Receive live messages for a community |

### User (Protected)
| Method | URL | Description |
|---|---|---|
| GET | `/api/users/me` | Get logged-in user profile |

---

## 🔐 How Authentication Works

```
1. User registers or logs in
2. Backend validates credentials and returns a JWT token
3. React stores the token in localStorage
4. Every subsequent API request includes:
   Authorization: Bearer <token>
5. Spring's JwtAuthFilter validates the token on every request
6. Protected routes in React redirect to /login if no token found
```

---

## 💬 How Real-time Chat Works

```
1. User opens a community chat page
2. React loads old messages via REST (GET /messages)
3. React connects to WebSocket server via SockJS
4. React subscribes to /topic/community/{id}
5. User types and sends a message via REST (POST /messages)
6. Backend saves the message to PostgreSQL
7. Backend broadcasts the saved message to /topic/community/{id}
8. All connected subscribers receive the message instantly
```

---

## 📸 Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Email + password login |
| Register | `/register` | Create new account |
| Home | `/` | Your joined communities |
| Search | `/search` | Browse and search all communities |
| Community | `/community/:id` | Community detail, join/leave |
| Chat | `/community/:id/chat` | Real-time group chat |
| Profile | `/profile` | Your profile and communities |

---

## 👨‍💻 Author

**Sarvesh** — [@sarveshd399](https://github.com/sarveshd399)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
