# 🏨 Hotel & Tourism Management System (MERN Stack)

A full-stack web application built using the **MERN (MongoDB, Express.js, React.js, Node.js)** stack to streamline hotel operations, tourism services, booking management, and customer interactions. The system provides a modern user experience for travelers while offering powerful administrative tools for managing hotels, restaurants, packages, vehicles, equipment, reviews, and events.

---

## 🌟 Features

### 👤 User Features

* User Registration & Login
* Secure JWT Authentication
* Browse Hotel Rooms
* Explore Tourism Packages
* Safari Vehicle Booking
* Equipment Booking
* Restaurant Information & Menus
* View Tourist Destinations
* Google Maps Integration
* Booking History Management
* User Profile Management
* Submit Reviews & Ratings

### 🛠️ Admin Features

* Admin Dashboard
* Hotel Room Management
* Restaurant Management
* Menu Management
* Equipment & Inventory Management
* Safari Vehicle Management
* Tourism Package Management
* User Management
* Booking Management
* Review Management
* Event Calendar Management

---

## 🏗️ Technology Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* JavaScript (ES6+)

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose ODM

### Authentication & Security

* JSON Web Token (JWT)
* bcrypt.js

### Third-Party Services

* Google Maps API

---

## 📂 Project Structure
# 📂 Project Structure

```text
TOURISM-AND-HOTEL-FRONTEND/
├── dist/                          # Production build files
├── node_modules/                  # Project dependencies
├── public/                        # Static assets
│   ├── _redirects
│   ├── 4login.jpeg
│   ├── 123.webp
│   ├── backback.jpg
│   ├── couple-hiking-mountains.jpg
│   ├── elephant.jpeg
│   ├── kadiraalogo.png
│   ├── log1.jpeg
│   ├── result_0.jpeg
│   ├── vite.svg
│   └── wmremove-transformed (1).jpeg
│
├── src/
│   ├── assets/                    # Images, icons, and other resources
│   │
│   ├── components/                # Reusable UI components
│   │   ├── bookingItem.jsx
│   │   ├── header.jsx
│   │   ├── imageSlider.jsx
│   │   ├── productCard.jsx
│   │   ├── productCard.css
│   │   └── testing.jsx
│   │
│   ├── pages/
│   │
│   │   ├── admin/                 # Admin management pages
│   │   │   ├── AddFooditem.jsx
│   │   │   ├── AddFooditemPage.jsx
│   │   │   ├── addItemPage.jsx
│   │   │   ├── AddMenuPages.jsx
│   │   │   ├── AddRestaurantPage.jsx
│   │   │   ├── AddVehiclePage.jsx
│   │   │   ├── AdminAddRoom.jsx
│   │   │   ├── adminBookingPage.jsx
│   │   │   ├── adminDashboard.jsx
│   │   │   ├── AdminEditRoom.jsx
│   │   │   ├── adminItemPage.jsx
│   │   │   ├── AdminMenuPage.jsx
│   │   │   ├── adminPackageBookingsPage.jsx
│   │   │   ├── adminPackagesPage.jsx
│   │   │   ├── adminPackageVehiclesPage.jsx
│   │   │   ├── adminPage.jsx
│   │   │   ├── AdminRestaurantPage.jsx
│   │   │   ├── Adminroompage.jsx
│   │   │   ├── AdminRooms.jsx
│   │   │   ├── adminUsersPage.jsx
│   │   │   ├── AdminVehiclepage.jsx
│   │   │   ├── adminVehiclesPage.jsx
│   │   │   ├── EventManagement.jsx
│   │   │   ├── GoogleMapComponent.jsx
│   │   │   ├── HotelRoomManagement.jsx
│   │   │   ├── MyRoomBookingsPage.jsx
│   │   │   └── ReviewsManagement.jsx
│   │
│   │   ├── home/                  # User-facing pages
│   │   │   ├── contact.jsx
│   │   │   ├── equipmentBookingPage.jsx
│   │   │   ├── error.jsx
│   │   │   ├── gallery.jsx
│   │   │   ├── GoogleMapsPage.jsx
│   │   │   ├── home.jsx
│   │   │   ├── homePage.jsx
│   │   │   ├── myBookings.jsx
│   │   │   ├── placeDetails.jsx
│   │   │   ├── productOverview.jsx
│   │   │   ├── Resortrooms.jsx
│   │   │   ├── Restaurants.jsx
│   │   │   ├── reviews.jsx
│   │   │   ├── SafariVehicles.jsx
│   │   │   ├── SafariVehicles.css
│   │   │   ├── services.jsx
│   │   │   └── VehicleBookingDetails.jsx
│   │
│   │   ├── login/
│   │   │   ├── login.css
│   │   │   └── login.jsx
│   │
│   │   ├── packages/
│   │   │   ├── packageOverview.jsx
│   │   │   └── packagesPage.jsx
│   │
│   │   └── register/
│   │       └── register.css
│
├── package.json                   # Project metadata and dependencies
├── vite.config.js                 # Vite configuration
└── README.md                     


---

## 🧑‍💻 System Modules

### 🏨 Hotel Management

* Add, Update, Delete Rooms
* Room Availability Tracking
* Room Booking Management

### 🍽️ Restaurant Management

* Restaurant Information Management
* Menu Management
* Food Item Management

### 🚙 Safari Vehicle Management

* Vehicle Registration
* Vehicle Availability Tracking
* Vehicle Booking System

### 🎒 Equipment Management

* Inventory Management
* Equipment Booking
* Stock Monitoring

### 🗺️ Tourism Package Management

* Create Tour Packages
* Package Booking Management
* Destination Information

### ⭐ Review Management

* Customer Reviews
* Ratings System
* Review Moderation

### 📅 Event Management

* Event Creation
* Event Calendar
* Event Tracking

---

## 🔐 Authentication

The application uses:

* JWT (JSON Web Token) Authentication
* Password Hashing using bcrypt.js
* Protected Routes
* Role-Based Access Control

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/tourism-and-hotel-frontend.git
```

```bash
cd tourism-and-hotel-frontend
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Application will run on:

```bash
http://localhost:5173
```

---

## 🚀 Build for Production

```bash
npm run build
```

Preview Production Build:

```bash
npm run preview
```

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCgb1e1Rk8V1Hiy-4I3Kuy7-zs6wxLXjCg
```

---

## 📸 Application Screenshots

### 🏠 Home Page

<img width="1579" height="758" alt="Home Page" src="https://github.com/user-attachments/assets/f4a61baa-bbd2-4d0e-81f5-74fc42d16b2c" />

---

### 🏨 Room Management

<img width="1540" height="764" alt="Room Management" src="https://github.com/user-attachments/assets/1fff8deb-2cd5-4f03-97e5-7f7f1d4bec5a" />

---

### 🎒 Equipment Management

<img width="1573" height="756" alt="Equipment Management" src="https://github.com/user-attachments/assets/cc8ec7c2-b7bf-458d-9dd4-ff9d3cf81fdb" />

---

### ⭐ Review Management

<img width="1544" height="753" alt="Review Management" src="https://github.com/user-attachments/assets/84aa3fb4-a783-4f4b-a1c3-1ea8c0660c21" />

---

## 🎯 Future Enhancements

* Online Payment Gateway Integration
* SMS Notifications
* AI-based Hotel Recommendations
* Advanced Analytics Dashboard
---

## 👨‍💻 Developer

**Kusal Kolambage |**
**Migara Basuru |**
**Kasundi Vethmini |**
**Vihaga Nethmika |**
**Yasindu Samapath |**
**Teshan Chathurya**

---
## 📄 License

This project is developed for educational and academic purposes.

© 2026 Hotel & Tourism Management System. All Rights Reserved.
