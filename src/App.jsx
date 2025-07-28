import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/RoutingPages/Home';
import UserLogin from './components/RoutingPages/UserLogin';
import ReadMore from './components/RoutingPages/ReadMore';
import Footer from './components/Footer';
import Bookmarked from './components/RoutingPages/Bookmarked';
import Profile from './components/RoutingPages/Profile';
import LogoLoading from './components/LogoLoading';
import SignUp from './components/RoutingPages/SignUp';
import ForgotPassword from "./components/RoutingPages/ForgotPassword";
import SendOTP from "./components/RoutingPages/SendOTP";
import ProfilePicUpload from "./components/RoutingPages/ProfilePicUpload";
import UserDatabase from "./components/RoutingPages/UserDatabase";


function App() {
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem("currentUser");

   useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LogoLoading />;
  }

  return (
    <>
 
    <BrowserRouter>
      <NavBar />
      <div className="container mt-4">
        <Routes>
         {/* Firebase-auth pages */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<SendOTP />} />
          <Route path="/profile-pic" element={<ProfilePicUpload />} />
          <Route path="/user-database" element={currentUser ? <UserDatabase /> : <Navigate to="/login" />} />

          {/* Blog pages (require currentUser from localStorage) */}
          <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/readmore/:id" element={currentUser ? <ReadMore /> : <Navigate to="/login" />} />
          <Route path="/bookmarked" element={currentUser ? <Bookmarked /> : <Navigate to="/login" />} />
          <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
    
    </>
  );
}

export default App;
