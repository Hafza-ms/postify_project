import React, { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { auth,db } from "./Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import CryptoJS from "crypto-js";
import signUpBg from '../assets/sign_up_bg.jpg';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const countryCodes = [
  { name: "United States", code: "+1" },
  { name: "India", code: "+91" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
];

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    countryCode: "+1",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    about: "",
  });

  const [usernameStatus, setUsernameStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const is18OrOlder = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  const evaluatePasswordStrength = (password) => {
    if (password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      setPasswordStrength("Strong");
    } else if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      setPasswordStrength("Moderate");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formatted = value.replace(/\D/g, "").slice(0, 10);
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

  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email.trim() === "") return;
      const q = query(collection(db, "users"), where("email", "==", formData.email.trim()));
      const snapshot = await getDocs(q);
      setEmailStatus(snapshot.empty ? "available" : "used");
    };
    const delayDebounce = setTimeout(checkEmail, 500);
    return () => clearTimeout(delayDebounce);
  }, [formData.email]);

  const handleReset = () => {
    setFormData({
      username: "", email: "", countryCode: "+2", phone: "", dob: "", password: "", confirmPassword: "", about: ""
    });
    setUsernameStatus(null);
    setEmailStatus(null);
    setPasswordStrength("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (!formData.username || !formData.email || !formData.phone || !formData.dob || !formData.password || !formData.confirmPassword) {
    toast.error("Please fill all required fields.");
    return;
  }

  if (!/^\d{10}$/.test(formData.phone)) {
    toast.error("Phone number must be 10 digits.");
    return;
  }

  if (!is18OrOlder(formData.dob)) {
    toast.error("You must be at least 18 years old.");
    return;
  }

  if (usernameStatus === "taken") {
    toast.error("Username is already taken.");
    return;
  }

  if (emailStatus === "used") {
    toast.error("Email is already used.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  setIsSubmitting(true);
  setLoading(true);

  try {
    // 🔑 Step 1: Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const uid = userCredential.user.uid;

    // 🔒 Step 2: Hash password for Firestore (optional, for display only – don't reuse this hash for auth)
    const hashedPassword = CryptoJS.SHA256(formData.password).toString();

    // 📝 Step 3: Store user details in Firestore under document with UID
    await setDoc(doc(db, "users", uid), {
      username: formData.username,
      email: formData.email,
      phone: `${formData.countryCode}-${formData.phone}`,
      dob: formData.dob,
      profilePicUrl: formData.profilePicUrl || "", // fallback if empty
      password: hashedPassword, // optional
      createdAt: new Date().toISOString(),
    });

    toast.success("Signup successful!");
    setTimeout(() => navigate("/"), 2000);
  } catch (err) {
    console.error("Signup error:", err);
    toast.error(err.message || "Signup failed.");
  }

  setIsSubmitting(false);
  setLoading(false);
};

  return (
    <div className="form-background" style={{ backgroundImage: `url(${signUpBg})`, backgroundSize: "cover", minHeight: "100vh", position: "relative" }}>
      <div className="dull-overlay" style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1
      }}></div>
      <div className="form-container" style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "10px",
        position: "relative",
        zIndex: 2
      }}>
        <h1 className="text-center mb-4"><strong>POSTIFY</strong></h1>
        <h2 className="text-center mb-4">Create Your Account</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" value={formData.username} onChange={handleChange} required autoComplete="username" />
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
            <div className="d-flex">
              <Form.Select name="countryCode" value={formData.countryCode} onChange={handleChange} style={{ width: "35%" }}>
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                ))}
              </Form.Select>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1234567890"
                required
                style={{ width: "65%", marginLeft: "10px" }}
                autoComplete="tel"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <span onClick={() => setShowPassword(!showPassword)} style={{ marginLeft: "10px", cursor: "pointer" }}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <small>
              Password strength:{" "}
              <b style={{ color: passwordStrength === "Strong" ? "green" : passwordStrength === "Moderate" ? "orange" : "red" }}>
                {passwordStrength}
              </b>
            </small>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ marginLeft: "10px", cursor: "pointer" }}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
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
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "Sign Up"}
            </Button>
          </div>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
