# 🏨 Hotel & Tourism Management System (MERN Stack)

A full-stack web application built using the **MERN (MongoDB, Express.js, React.js, Node.js)** stack to manage hotel bookings, tourism services, and user interactions in a seamless and efficient way.

---

## 🚀 Features

### 👤 User Side
- User registration and login (JWT authentication)
- Browse hotels and tourism packages
- View detailed hotel/tour information
- Book hotels and tour packages
- View booking history
- User profile management

### 🛠️ Admin Side
- Admin dashboard
- Add / update / delete hotels
- Manage tour packages
- View and manage bookings
- Manage users

---

## 🧑‍💻 Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- Tailwind CSS / Bootstrap (optional)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)

**Authentication:**
- JSON Web Token (JWT)

- bcrypt.js for password hashing

---

## 📁 Project Structure
client/
│
├── public/                     # Static assets
│   └── favicon.ico
│
├── src/
│   │
│   ├── assets/                # Images, icons, logos
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── HotelCard.jsx
│   │   └── Loader.jsx
│   │
│   ├── pages/                # Application pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Hotels.jsx
│   │   ├── HotelDetails.jsx
│   │   ├── Booking.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── routes/               # Route management
│   │   └── AppRoutes.jsx
│   │
│   ├── services/            # API calls (Axios)
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── hotelService.js
│   │   └── bookingService.js
│   │
│   ├── context/             # Global state (Context API)
│   │   ├── AuthContext.jsx
│   │   └── BookingContext.jsx
│   │
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.js
│   │
│   ├── utils/               # Helper functions
│   │   └── formatDate.js
│   │
│   ├── styles/              # Global styles
│   │   └── global.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
├── vite.config.js
└── README.md
- UI
- <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c7736907-967c-4f35-b63b-61b4506950c6" />

- Room Management
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/da14e040-00ac-4be5-8375-bf1af73dc2b4" />


- Equipment/Inventory Management
- <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b745a12e-b887-4f77-81d1-cbafc2c4aee3" />
