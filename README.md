# 🔐 NodeVault – A User Authentication System

A full-stack web application built using **Node.js, Express, MySQL, HTML, CSS, and JavaScript** that provides secure user authentication, personal data management, and an admin control panel.

---

## 🌟 Features

### 👤 User Features

* User Signup & Login (JWT-based authentication)
* Secure password hashing using bcrypt
* Personal dashboard to:

  * Add entries (notes)
  * View entries
  * Delete entries
* Session-based authentication using cookies

---

### 👑 Admin Features

* Separate Admin Login
* Dedicated Admin Dashboard
* View all registered users
* View all user entries
* Delete users
* Delete entries
* Role-based access control

---

### 🔐 Security Features

* JWT Authentication (user + admin separation)
* Password hashing (bcrypt)
* SQL Injection protection (parameterized queries)
* Session isolation (user token vs admin token)
* Protected API routes using middleware

---

## 🏗️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

---

## 📁 Project Structure

```
project/
│
├── public/
│   ├── css/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── admin.html
│   └── admin-login.html
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── db/
│
├── server.js
├── package.json
└── .env
```

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/itsrohitchavan05/NodeVault.git
cd NodeVault
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup MySQL Database

Create a database:

```sql
CREATE DATABASE auth_app;
```

Create tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(10) DEFAULT 'user'
);

CREATE TABLE user_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 4. Configure Database

Update:

```
src/db/mysql.js
```

```js
host: "localhost",
user: "root",
password: "yourpassword",
database: "auth_app"
```
Here, yourpassword refers to your system's password.
---

### 5. Run Server

```bash
node server.js
```

---

### 6. Open in Browser

```
http://localhost:5000
```

---

## 🔑 Default Roles

| Role  | Access              |
| ----- | ------------------- |
| User  | Dashboard only      |
| Admin | Full system control |

---

## 🔗 Important Routes

### User Routes

* `/login.html`
* `/signup.html`
* `/dashboard.html`

### Admin Routes

* `/admin-login.html`
* `/admin.html`
Admin can login using http://localhost:5000/admin-login.html
---

## 🧠 Key Highlights

* Role-based authentication system
* Separate sessions for admin and users
* Real-time validation of deleted users
* Clean UI with responsive design
* Structured backend (MVC pattern)

---

## 🚀 Future Improvements

* Deployment (Render / Railway / Vercel)
* Password reset feature
* Email verification
* Pagination for admin dashboard
* Search & filtering

---

## 👨‍💻 Author

Rohit Chavan

---

## 📌 Note

This project was built as part of a full-stack internship assessment to demonstrate:

* Backend development
* Authentication systems
* Database integration
* Deployment readiness
