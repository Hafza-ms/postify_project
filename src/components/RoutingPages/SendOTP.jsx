import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

function SendOTP() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
  emailjs.init("rdLTQTmQjG9xh_SQk");
  }, []);

  useEffect(() => {
    
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && showOtpField) {
      setStatus("OTP expired. Please request a new one.");
      setShowOtpField(false);
    }
    return () => clearInterval(interval);
  }, [timer, showOtpField]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendOtp = async () => {
    if (!email || !username) {
      setStatus("Please enter both username and email.");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", newOtp);
    setGeneratedOtp(newOtp);
    setLoading(true);

    const templateParams = {
      to_email: email,
      generated_otp: newOtp, // changed from otp to generated_otp
      to_name: username
      
    };
    console.log("templateParams:", templateParams);
      
    try {
      await emailjs.send(
        "service_llrz65k",         // ✅ Your EmailJS service ID
        "template_uq7hsyk",        // ✅ Your EmailJS template ID
        templateParams,
        "rdLTQTmQjG9xh_SQk"        // ✅ Your EmailJS public key
      );
      setStatus("OTP sent to your email.");
      setShowOtpField(true);
      setTimer(900); // 15 minutes = 900 seconds
    } catch (error) {
      console.error("Failed to send OTP", error);
      setStatus("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setStatus("✅ User verified. Redirecting...");
      setTimeout(() => navigate("/reset-password"), 1500);
    } else {
      if (retryCount === 0) {
        setRetryCount(1);
        setStatus("❌ Wrong OTP entered. You have one more attempt.");
      } else {
        setStatus("⚠️ You have exhausted the OTP retry limit.");
        setShowOtpField(false);
        setTimer(0);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="container  text-dark mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">🔒 Verify Your Identity</h3>
      {status && <Alert variant="info">{status}</Alert>}

      <Form className="text-dark" onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username-input">Username</Form.Label>
          <Form.Control
            id="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email-input">Email</Form.Label>
          <Form.Control
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
          />
        </Form.Group>

        <Button type="submit" disabled={loading || timer > 0}>
          {loading ? <Spinner animation="border" size="sm" /> : "Send OTP"}
        </Button>
      </Form>

      {showOtpField && (
        <Form className="text-dark mt-4">
          <Form.Group className="mb-3">
            <Form.Label htmlFor="otp-input">Enter OTP</Form.Label>
            <Form.Control
              id="otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              placeholder="Enter the OTP sent to your email"
              autoComplete="one-time-code"
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center">
            <Button onClick={verifyOtp}>Verify OTP</Button>
            <span className="text-muted small">
              ⏳ Expires in: {formatTime(timer)}
            </span>
          </div>
        </Form>
      )}
    </div>
  );
}

export default SendOTP;
