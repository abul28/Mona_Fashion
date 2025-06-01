import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseService";
import "./Login.css"; // Import CSS for styling
import logo from "/mf_logo.png";
import GlitterBackground from "../components/GlitterBackground";
import { TextField, Button, Box, Typography } from "@mui/material";

const Login = ({ setIsGuest, setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isGuest", "false");
      setIsAuthenticated(true);  // ✅ Update state immediately
      setIsGuest(false);
      navigate("/home");
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  const handleContinueWithoutLogin = () => {
    localStorage.setItem("isGuest", "true");
    localStorage.setItem("isAuthenticated", "false");
    setIsGuest(true);
    setIsAuthenticated(false);
    navigate("/home");
  };
  
  return (
    <div className="admin-login-container">
        <GlitterBackground />
        <div className="login-header-wrapper">
        <div className="login-header">
        
  <img src={logo} alt="Logo" className="login-logo" />
  <h1 className="boutique-name">Mona Fashion</h1>
</div>
</div>

      <div className="admin-login-box">
        {/* Login Form */}
        <label className="loginlabel">Sign In</label>
        <form onSubmit={handleLogin}>
  <div className="input-group">
  <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "black",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused": {
                   backgroundColor: "transparent !important", // ✨ removes the grey focus bg
                }
              },
              "& .MuiInputBase-input": {
                 backgroundColor: "transparent !important",
              },
              "& label.Mui-focused": {
                color: "black",
              },
            }}
          />
  </div>

  <div className="input-group">
  <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "transparent",
                "& fieldset": {
                  borderColor: "black",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused": {
                   backgroundColor: "transparent !important", // ✨ removes the grey focus bg
                }
              },
              "& .MuiInputBase-input": {
                 backgroundColor: "transparent !important",
              },
              "& label.Mui-focused": {
                color: "black",
              },
            }}
          />
  </div>

  <button type="submit">Login</button>
</form>
        {error && <p className="error">{error}</p>}

        {/* Continue without Login */}
        <button className="guest-login" onClick={handleContinueWithoutLogin}>
  Continue Without Login
</button>
      </div>
    </div>
  );
};

export default Login;
