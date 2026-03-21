import './App.css';
import AdminPage from './pages/admin/adminPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/register/register';
import Testing from './components/testing';
import BookingPage from './pages/home/equipmentBookingPage';
import { GoogleOAuthProvider } from '@react-oauth/google';



function App() {
  return (
    <GoogleOAuthProvider clientId="262363908883-3pi34p5rk7mj588547ckqlvo267c1h0n.apps.googleusercontent.com">
    <BrowserRouter>
    <Toaster/>

    <Routes path="/*">
      <Route path="/testing" element={<Testing/>}/>  
      <Route path="/login" element={<LoginPage/>}/>  
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/admin/*" element={<AdminPage/>}/>
      <Route path="/*" element={<HomePage/>}/>
      

    </Routes>

    </BrowserRouter>
    </GoogleOAuthProvider>
    
  );
}

export default App
