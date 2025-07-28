import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import rightHalf from "../../assets/right_half.jpg";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function UserLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignUp = () => navigate("/signup");

  const handleForgotPassword = () => navigate("/forgot-password");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user = userCredential.user;
      localStorage.setItem("userId", user.uid); // 🔐 Store UID

      // Optional: Fetch full profile from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : {};

      toast.success("Login successful!");
      navigate("/dashboard", { state: userData });
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        toast.error("User not found.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="split-container">
      <div className="left-half">
        <img src={rightHalf} alt="Better Half" className="left-image" />
      </div>

      <div className="right-half">
        <div className="registration-box">
          <h1 className="text-light mb-4">POSTIFY</h1>
          <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{ color: "#fff", fontWeight: 500 }}>
                Email address
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
              <small className="helper-text">
                We'll never share your email with anyone else.
              </small>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{ color: "#fff", fontWeight: 500 }}>
                Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your Password"
              />
              <small className="helper-text">
                Never share your password with anyone else.
              </small>
            </Form.Group>

            <div className="signup-text">
              Forgot Password?{" "}
              <span
                style={{ color: "#0d6efd", cursor: "pointer" }}
                onClick={handleForgotPassword}
              >
                Reset
              </span>
            </div>

            <div className="signup-text">
              Not a user?{" "}
              <span
                style={{ color: "#0d6efd", cursor: "pointer" }}
                onClick={handleSignUp}
              >
                Sign Up
              </span>
            </div>

            <Button type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? "Logging in..." : <b>LOGIN</b>}
            </Button>
          </Form>

          <footer>
            <div style={{ fontWeight: "500", marginBottom: "5px" }}>
              Speak. Share. Inspire.
            </div>
            <div>© {new Date().getFullYear()} Postify. All rights reserved.</div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
