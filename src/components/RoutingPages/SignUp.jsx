import React, { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./Firebase";
import CryptoJS from "crypto-js";
import signUpBg from '../../assets/sign_up_bg.jpg';


function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    about: "",
  });

  const [usernameStatus, setUsernameStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Helper: Age Check
  const is18OrOlder = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  // Password Strength Checker
  const evaluatePasswordStrength = (password) => {
    if (password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      setPasswordStrength("Strong");
    } else if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      setPasswordStrength("Moderate");
    } else {
      setPasswordStrength("Weak");
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{0,4})/, "$1-$2-$3")
        .slice(0, 12);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "about") {
      const words = value.trim().split(/\s+/);
      if (words.length <= 100) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "password") evaluatePasswordStrength(value);
  };

  // Username Availability Check
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.trim() === "") return;
      const q = query(collection(db, "users"), where("username", "==", formData.username));
      const snapshot = await getDocs(q);
      setUsernameStatus(snapshot.empty ? "available" : "taken");
    };
    const delayDebounce = setTimeout(checkUsername, 500);
    return () => clearTimeout(delayDebounce);
  }, [formData.username]);

  // Email Availability Check
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email.trim() === "") return;
      const q = query(collection(db, "users"), where("email", "==", formData.email));
      const snapshot = await getDocs(q);
      setEmailStatus(snapshot.empty ? "available" : "used");
    };
    const delayDebounce = setTimeout(checkEmail, 500);
    return () => clearTimeout(delayDebounce);
  }, [formData.email]);

  const handleReset = () => {
    setFormData({ username: "", email: "", phone: "", dob: "", password: "", about: "" });
    setUsernameStatus(null);
    setEmailStatus(null);
    setPasswordStrength("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.phone || !formData.dob || !formData.password) {
      alert("Please fill all required fields.");
      return;
    }

    if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      alert("Phone number must be in format 123-456-7890.");
      return;
    }

    if (!is18OrOlder(formData.dob)) {
      alert("You must be at least 18 years old.");
      return;
    }

    if (usernameStatus === "taken") {
      alert("Username is already taken.");
      return;
    }

    if (emailStatus === "used") {
      alert("Email is already used.");
      return;
    }

    setIsSubmitting(true);
    try {
      const hashedPassword = CryptoJS.SHA256(formData.password).toString();
      const userData = { ...formData, password: hashedPassword };
      navigate("/profile-pic", { state: userData });
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="form-background">
    <div className="form-container" style={{ maxWidth: "500px", margin: "auto", padding: "30px" }}>
      <h1 className="text-center mb-4"><strong>POSTIFY</strong></h1>
      <h2 className="text-center mb-4">Create Your Account</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" value={formData.username} onChange={handleChange} required />
          {usernameStatus === "available" && <div className="text-success">Username available</div>}
          {usernameStatus === "taken" && <div className="text-danger">Username taken</div>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          {emailStatus === "available" && <div className="text-success">Email is available</div>}
          {emailStatus === "used" && <div className="text-danger">Email already used</div>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="123-456-7890" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ flex: 1 }}
            />
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ marginLeft: "8px", height: "38px" }}
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </div>
          <small>
            Password strength:{" "}
            <b style={{ color: passwordStrength === "Strong" ? "green" : passwordStrength === "Moderate" ? "orange" : "red" }}>
              {passwordStrength}
            </b>
          </small>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>About (max 100 words)</Form.Label>
          <Form.Control as="textarea" rows={3} name="about" value={formData.about} onChange={handleChange} />
          <div style={{ fontSize: "12px", color: "#888" }}>
            {formData.about.trim().split(/\s+/).filter(Boolean).length} / 100 words
          </div>
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleReset}>Reset</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" size="sm" /> : "Continue"}
          </Button>
        </div>
      </Form>
    </div>
    </div>
  );
}

export default SignUp;
