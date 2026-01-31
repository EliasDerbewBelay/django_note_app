# 📝 E-Nota — Notes Application

E-Nota is a full-stack notes application built with **Django REST Framework** and **Next.js**.
It allows users to securely register, log in, and manage personal notes through a clean and responsive interface.

---

## 🚀 Features

- User authentication using **JWT (access & refresh tokens)**
- Secure login and logout
- Create, read, update, and delete notes
- Protected routes for authenticated users
- Dynamic UI updates based on authentication state
- Responsive design (desktop & mobile)
- Clean and modern user interface

---

## 🛠 Tech Stack

### Backend

- Django
- Django REST Framework
- Simple JWT
- SQLite (development database)

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI

---

## 📁 Project Structure

```
django_note_app/
├── backend/
│   ├── backend/        # Django project settings
│   ├── notes/          # Notes app
│   ├── manage.py
│   └── db.sqlite3
│
├── frontend/
│   ├── app/            # Next.js app router
│   ├── components/
│   └── public/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd django_note_app
```

---

### 2️⃣ Backend Setup (Django)

#### Create and activate virtual environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
```

#### Install dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
```

#### Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Start backend server

```bash
python manage.py runserver
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

### 3️⃣ Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

- User logs in with username and password
- Backend returns **access** and **refresh** tokens
- Tokens are stored in `localStorage`
- Protected API requests use the access token
- UI updates dynamically based on login state

---

## 🧪 Status

✅ UI cleaned and finalized
✅ Authentication working correctly
✅ Notes CRUD fully functional
✅ Tested across all major flows

---

[Live Demo](https://e-nota.vercel.app/)

---

## 👤 Author

**Elias**
Built as a full-stack learning and productivity project.

---
