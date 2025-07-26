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


function App() {
  const currentUser = localStorage.getItem("currentUser");

  return (
    <>
    {loading? (
      <LogoLoading/>
    ) : (
    <BrowserRouter>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/readmore/:id" element={<ReadMore />} />
          <Route path="/bookmarked" element={currentUser ? <Bookmarked /> : <Navigate to="/login" />} />
           <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
    )}
    </>
  );
}

export default App;
