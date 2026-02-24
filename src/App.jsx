import './App.css';
import AdminPage from './pages/admin/adminPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/register/register';
import Testing from './components/testing';

// Room imports
import RoomList from './pages/rooms/RoomList';
import RoomSearch from './pages/rooms/RoomSearch';
import RoomDetails from './pages/rooms/RoomDetails';
import RoomBooking from './pages/rooms/RoomBooking';

// Admin Room imports
import AdminRooms from './pages/admin/AdminRooms';
import AdminAddRoom from './pages/admin/AdminAddRoom';
import AdminEditRoom from './pages/admin/AdminEditRoom';

function App() {
  return (
    <BrowserRouter>
      <Toaster/>

      <Routes path="/*">

        {/* Existing Routes */}
        <Route path="/testing" element={<Testing/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>

        {/* Room Routes */}
        <Route path="/rooms" element={<RoomList/>}/>
        <Route path="/rooms/search" element={<RoomSearch/>}/>
        <Route path="/rooms/:key" element={<RoomDetails/>}/>
        <Route path="/rooms/:key/book" element={<RoomBooking/>}/>

        {/* Admin Room Routes */}
        <Route path="/admin/rooms" element={<AdminRooms/>}/>
        <Route path="/admin/rooms/add" element={<AdminAddRoom/>}/>
        <Route path="/admin/rooms/edit/:key" element={<AdminEditRoom/>}/>

        {/* Keep these LAST - catch-all routes */}
        <Route path="/admin/*" element={<AdminPage/>}/>
        <Route path="/*" element={<HomePage/>}/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;

