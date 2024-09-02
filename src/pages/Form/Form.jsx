import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "./api"; // Adjust the path as necessary
import "./Form.css";

const Form = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (isSignUp && (!formData.name || !nameRegex.test(formData.name))) {
      newErrors.name = "Invalid name";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email";
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Weak password";
      valid = false;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the error when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    // Update the form data with the user input
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isSignUp) {
          // Sign up request
          await signup(formData);
          setIsSignUp(false); // Switch to login view
        } else {
          // Login request
          const response = await login({
            email: formData.email,
            password: formData.password,
          });
          // Store JWT token in localStorage
          localStorage.setItem("userToken", response.token);
          navigate("/dashboard"); // Navigate to dashboard after login
        }
      } catch (error) {
        // Display the error message
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: error.message,
        }));
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h1>QUIZZIE</h1>
        <div className="form-tabs">
          <button
            className={isSignUp ? "active-tab" : ""}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className={!isSignUp ? "active-tab" : ""}
            onClick={() => setIsSignUp(false)}
          >
            Log In
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error-input" : ""}
                placeholder="Enter your name"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error-input" : ""}
              placeholder="Enter your password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error-input" : ""}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          {errors.form && <p className="error-text">{errors.form}</p>}
          <button type="submit" className="submit-button">
            {isSignUp ? "Sign-Up" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
