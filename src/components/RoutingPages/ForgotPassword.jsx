import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import emailjs from "emailjs-com";
import { db } from "./Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import CryptoJS from "crypto-js";
import rightHalf from "../../assets/right_half.jpg";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    otpInput: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [otpTimer, setOtpTimer] = useState(900); // 15 mins
  const [attempt, setAttempt] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false); // <-- add
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // <-- add


  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    let timer;
    if (step === 2 && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && step === 2) {
      setError("OTP expired. Please try again.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [otpTimer, step, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const validatePassword = (value) => ({
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    specialChar: /[@$!%*?&]/.test(value),
  });

  const constraints = validatePassword(formData.newPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = async () => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpTimer(900);
    const templateParams = {
      to_name: formData.username,
      to_email: formData.email,
      otp_code: otp,
    };
    try {
      await emailjs.send(
        "service_llrz65k",
        "template_uq7hsyk",
        templateParams,
        "rdLTQTmQjG9xh_SQk"
      );
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const q = query(
      collection(db, "users"),
      where("username", "==", formData.username),
      where("email", "==", formData.email)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      setUserId(userDoc.id);
      await sendOtp();
      setStep(2);
      setError("");
    } else {
      setError("Username and Email do not match our records.");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (formData.otpInput === generatedOtp) {
      setSuccessMsg("User verified.");
      setStep(3);
      setError("");
    } else {
      if (attempt === 0) {
        setAttempt(1);
        setError("Wrong OTP entered. Try again.");
      } else {
        setError("Incorrect OTP. Redirecting...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const allValid = Object.values(constraints).every(Boolean);
    if (!allValid) {
      setError("Password does not meet all constraints.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const hashedPassword = CryptoJS.SHA256(formData.newPassword).toString();
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { password: hashedPassword });

      alert("Password changed successfully!");
      setFormData({
        username: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
        otpInput: "",
      });
      setGeneratedOtp("");
      setStep(1);
      setAttempt(0);
      setSuccessMsg("");
    } catch (err) {
      setError("Failed to update password. Try again.");
    }
  };

  const handleResendOtp = async () => {
    if (resendCount >= 3) {
      setError("Maximum OTP resend attempts reached.");
      return;
    }
    await sendOtp();
    setFormData({ ...formData, otpInput: "" });
    setResendCount((prev) => prev + 1);
    setError("");
  };

  return (
    <div className="split-container" style={{ display: "flex" }}>
      <div className="left-half" style={{ flex: 1 }}>
        <img
          src={rightHalf}
          alt="Better Half"
          className="left-image"
          style={{ width: "100%", height: "100vh", objectFit: "cover" }}
        />
      </div>

      <div
        className="right-half"
        style={{
          flex: 1,
          backgroundColor: "#f8f9fa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="registration-box"
          style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            width: "80%",
            maxWidth: "400px",
          }}
        >
          <h1 className="text-dark mb-4" style={{ textAlign: "center" }}>
            POSTIFY
          </h1>

          {step === 1 && (
            <>
              <h5 className="text-dark">Forgot Password</h5>
              <Form onSubmit={handleVerify} className="text-dark">
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Button type="submit" variant="primary" className="w-100">
                  Send OTP
                </Button>
              </Form>
            </>
          )}

          {step === 2 && (
            <>
              <h5>Enter OTP</h5>
              <Form onSubmit={handleOtpSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="otpInput"
                    value={formData.otpInput}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <div style={{ marginBottom: "10px", fontSize: "14px" }}>
                  Time left: <strong>{formatTime(otpTimer)}</strong>
                </div>
                {successMsg && (
                  <p style={{ color: "green" }}>{successMsg}</p>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Button type="submit" variant="success" className="w-100 mb-2">
                  Verify OTP
                </Button>
                <Button
                  onClick={handleResendOtp}
                  variant="secondary"
                  className="w-100"
                  disabled={resendCount >= 3}
                >
                  Resend OTP ({3 - resendCount} left)
                </Button>
              </Form>
            </>
          )}

          {step === 3 && (
            <>
              <h5>Create New Password</h5>
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                   <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    style={{ flex: 1 }}
                  />
                  <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  style={{ marginLeft: "8px", height: "38px" }}
                  tabIndex={-1}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </Button>
                </div>
                </Form.Group>
                <ul className="password-checklist" style={{ fontSize: "13px" }}>
                  <li style={{ color: constraints.length ? "green" : "red" }}>
                    At least 8 characters
                  </li>
                  <li style={{ color: constraints.uppercase ? "green" : "red" }}>
                    One uppercase letter
                  </li>
                  <li style={{ color: constraints.lowercase ? "green" : "red" }}>
                    One lowercase letter
                  </li>
                  <li style={{ color: constraints.number ? "green" : "red" }}>
                    One number
                  </li>
                  <li
                    style={{
                      color: constraints.specialChar ? "green" : "red",
                    }}
                  >
                    One special character (@$!%*?&)
                  </li>
                </ul>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{ flex: 1 }}
                  />
                  <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{ marginLeft: "8px", height: "38px" }}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </Button>
                </div>
                </Form.Group>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Button type="submit" variant="warning" className="w-100">
                  Change Password
                </Button>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
