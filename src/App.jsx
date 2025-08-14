import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

// 🎬 Splash Screen
import LogoLoading from "./components/LogoLoading";

// 🔐 Authentication & Signup
import UserLogin from "./components/UserLogin";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import SendOTP from "./components/SendOtp";

// 🔑 Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/Firebase";

//Home Page and User Profile
import NavBar from './components/NavBar';
import Home from './components/Home';
import ReadMore from './components/ReadMore';
import Footer from './components/Footer';
import Bookmarked from './components/Bookmarked';
import Profile from './components/Profile';

// 📸 Profile Picture Upload
import ProfilePicUpload from "./components/ProfilePicUpload";

// 🔒 Admin Page
import UserDatabase from "./components/UserDatabase";

// 🌐 Styling
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

// 🔔 Toast Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [splash, setSplash] = useState(true);

  // 🔐 Listen to Firebase Auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          const userObj = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
          };
          setCurrentUser(userObj);
          localStorage.setItem("currentUser", JSON.stringify(userObj));
        } else {
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
        }
        setCheckingStatus(false);
      }, 3000); // 3 second delay for testing
    });

    return () => unsubscribe();
  }, []);

  // 🎬 Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Return after all hooks
  if (checkingStatus) {
    return <LogoLoading />;
  }

  return (
    <Router>
      {currentUser && <NavBar />}
      <div className="container mt-4">
        {splash ? (
          <LogoLoading />
        ) : (
          <>
            <Routes>
              <Route path="/login" element={!currentUser ? <UserLogin /> : <Navigate to="/" />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<SendOTP />} />
              <Route path="/profile-pic" element={<ProfilePicUpload />} />
              <Route path="/user-database" element={<UserDatabase />} />
              <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login" />} />
              <Route path="/readmore/:id" element={currentUser ? <ReadMore /> : <Navigate to="/login" />} />
              <Route path="/bookmarked" element={currentUser ? <Bookmarked /> : <Navigate to="/login" />} />
              <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
              <Route
                path="*"
                element={
                  <div style={{ textAlign: "center", marginTop: "100px" }}>
                    <h2>404 - Page Not Found</h2>
                  </div>
                }
              />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
            {currentUser && <Footer />}
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
