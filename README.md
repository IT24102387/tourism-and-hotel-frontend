# 🏨 Hotel & Tourism Management System (MERN Stack)

A full-stack web application built using the **MERN (MongoDB, Express.js, React.js, Node.js)** stack to manage hotel bookings, tourism services, and user interactions in a seamless and efficient way.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🚀 Features

### 👤 User Side
- ✅ User registration and login (JWT authentication)
- ✅ Browse hotels and tourism packages
- ✅ View detailed hotel/tour information
- ✅ Book hotels and tour packages
- ✅ View booking history
- ✅ User profile management
- ✅ Search and filter hotels by location, price, and ratings
- ✅ Real-time booking confirmation
- ✅ Payment gateway integration

### 🛠️ Admin Side
- ✅ Admin dashboard with analytics
- ✅ Add / update / delete hotels
- ✅ Manage tour packages
- ✅ View and manage bookings
- ✅ Manage users
- ✅ Room management
- ✅ Equipment and inventory management
- ✅ Generate reports

---

## 🧑‍💻 Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS / Bootstrap** - CSS framework
- **Vite** - Build tool
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (JSON Web Token)** - Token-based authentication
- **bcrypt.js** - Password hashing

---

## 📁 Project Structure

tourism-and-hotel-frontend/ │ ├── public/ # Static assets │ └── favicon.ico │ ├── src/ │ │ │ ├── assets/ # Images, icons, logos │ │ ├── images/ │ │ └── icons/ │ │ │ ├── components/ # Reusable UI components │ │ ├── Navbar.jsx │ │ ├── Footer.jsx │ │ ├── HotelCard.jsx │ │ ├── Loader.jsx │ │ ├── Sidebar.jsx │ │ └── Modal.jsx │ │ │ ├── pages/ # Application pages │ │ ├── Home.jsx │ │ ├── Login.jsx │ │ ├── Register.jsx │ │ ├── Hotels.jsx │ │ ├── HotelDetails.jsx │ │ ├── Booking.jsx │ │ ├── Dashboard.jsx │ │ ├── RoomManagement.jsx │ │ ├── InventoryManagement.jsx │ │ └── BookingHistory.jsx │ │ │ ├── routes/ # Route management │ │ ├── AppRoutes.jsx │ │ ├── PrivateRoute.jsx │ │ └── AdminRoute.jsx │ │ │ ├── services/ # API calls (Axios) │ │ ├── api.js │ │ ├── authService.js │ │ ├── hotelService.js │ │ ├── bookingService.js │ │ └── inventoryService.js │ │ │ ├── context/ # Global state (Context API) │ │ ├── AuthContext.jsx │ │ ├── BookingContext.jsx │ │ └── AdminContext.jsx │ │ │ ├── hooks/ # Custom hooks │ │ ├── useAuth.js │ │ ├── useBooking.js │ │ └── useAdmin.js │ │ │ ├── utils/ # Helper functions │ │ ├── formatDate.js │ │ ├── validators.js │ │ ├── constants.js │ │ └── helpers.js │ │ │ ├── styles/ # Global styles │ │ └── global.css │ │ │ ├── App.jsx │ ├── main.jsx │ └── index.css │ ├── .env # Environment variables ├── .gitignore ├── package.json ├── vite.config.js └── README.md

Code

---

## 💻 Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn** (v6.0.0 or higher)
- **Git**
- **MongoDB** (for backend)

### Frontend Setup

1. **Clone the repository:**
```bash
git clone https://github.com/IT24102387/tourism-and-hotel-frontend.git
cd tourism-and-hotel-frontend
Install dependencies:
bash
npm install
# or
yarn install
Create environment file:
bash
cp .env.example .env
⚙️ Configuration
Frontend Environment Variables (.env)
Create a .env file in the root directory with the following variables:

env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Hotel & Tourism Management
VITE_JWT_TOKEN_KEY=auth_token
Backend Configuration (if applicable)
Make sure your backend is running on the correct port (default: 5000).

🏃 Running the Application
Development Mode
bash
# Start the development server
npm run dev
# or
yarn dev
The application will be available at: http://localhost:5173

Production Build
bash
# Build for production
npm run build
# or
yarn build
Preview Production Build
bash
npm run preview
# or
yarn preview
🔌 API Endpoints
Authentication
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
GET /api/auth/profile - Get user profile
Hotels
GET /api/hotels - Get all hotels
GET /api/hotels/:id - Get hotel details
POST /api/hotels - Create hotel (Admin)
PUT /api/hotels/:id - Update hotel (Admin)
DELETE /api/hotels/:id - Delete hotel (Admin)
Bookings
POST /api/bookings - Create booking
GET /api/bookings - Get user bookings
GET /api/bookings/:id - Get booking details
PUT /api/bookings/:id - Update booking
DELETE /api/bookings/:id - Cancel booking
Rooms
GET /api/rooms - Get all rooms
POST /api/rooms - Add room (Admin)
PUT /api/rooms/:id - Update room (Admin)
DELETE /api/rooms/:id - Delete room (Admin)
Inventory
GET /api/inventory - Get inventory
POST /api/inventory - Add inventory (Admin)
PUT /api/inventory/:id - Update inventory (Admin)
DELETE /api/inventory/:id - Delete inventory (Admin)
📸 Screenshots (UI)
Home Page
Home Page

Room Management
Room Management

Equipment and Inventory Management
Equipment and Inventory Management

📖 Usage Guide
For Users
Registration & Login

Click on "Register" to create a new account
Fill in your details and submit
Login with your credentials
Browse Hotels

Navigate to the "Hotels" page
Use filters to search by location, price range, and ratings
Click on a hotel card to view detailed information
Make a Booking

Select your check-in and check-out dates
Choose your room type
Click "Book Now"
Complete the payment process
View Booking History

Go to your profile
Click on "My Bookings"
View all your current and past bookings
For Admins
Access Admin Dashboard

Login with admin credentials
Navigate to the admin panel
Manage Hotels

Add new hotels with details and images
Edit existing hotel information
Delete hotels as needed
Manage Rooms

Add rooms to hotels
Set room availability and pricing
Update room status
Manage Inventory

Track equipment and supplies
Update inventory quantities
Monitor low-stock items
View Bookings

See all user bookings
Update booking status
Generate booking reports
🤝 Contributing
We welcome contributions from the community! Here's how you can help:

Fork the repository

bash
git clone https://github.com/YOUR_USERNAME/tourism-and-hotel-frontend.git
Create a feature branch

bash
git checkout -b feature/your-feature-name
Commit your changes

bash
git commit -m "Add your meaningful commit message"
Push to your branch

bash
git push origin feature/your-feature-name
Open a Pull Request

Describe your changes clearly
Link any related issues
Wait for review and approval
Code Standards
Follow the existing code style
Use meaningful variable and function names
Add comments for complex logic
Test your changes thoroughly
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

📞 Contact
For questions, suggestions, or support, please reach out:

Email: it24102387@gmail.com
GitHub: @IT24102387
GitHub Repository: tourism-and-hotel-frontend
🙏 Acknowledgments
React.js documentation
Express.js community
MongoDB documentation
Tailwind CSS framework
All contributors and supporters
