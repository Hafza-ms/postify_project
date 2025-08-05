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

import SignUp from './components/RoutingPages/SignUp';
import ForgotPassword from "./components/RoutingPages/ForgotPassword";
import SendOTP from "./components/RoutingPages/SendOTP";
import ProfilePicUpload from "./components/RoutingPages/ProfilePicUpload";
import UserDatabase from "./components/RoutingPages/UserDatabase";
import LogoLoading from "./components/RoutingPages/LogoLoading";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/RoutingPages/Firebase";


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setTimeout(() => {
      if (user) {
        setCurrentUser(user.email);
        localStorage.setItem("currentUser", JSON.stringify(user.email));
      } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }
      setCheckingStatus(false);
    }, 3000); // 3 second delay for testing
  });

  return () => unsubscribe();
}, []);

  if (checkingStatus) {
    return <LogoLoading />;
  }



  

  return (
    <>
 
    <BrowserRouter>
      {currentUser && <NavBar />} {/* ✅ Show only if logged in */}
      <div className="container mt-4">
        <Routes>
          {/* Firebase-auth pages */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<SendOTP />} />
          <Route path="/profile-pic" element={<ProfilePicUpload />} />
          <Route path="/user-database" element={currentUser ? <UserDatabase /> : <Navigate to="/login" />} />

          {/* Blog pages (require currentUser) */}
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
