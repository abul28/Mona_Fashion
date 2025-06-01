import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./Navbar.css";
import logo from "/mf_logo.png";

const Navbar = ({ onSearch }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current page is "/home"
  const isHomePage = location.pathname === "/home";

  // Check authentication status on component load
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const guestStatus = localStorage.getItem("isGuest");

    setIsAuthenticated(authStatus === "true");
    setIsGuest(guestStatus === "true");
  }, []);

  const goToPage = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isGuest");
    setIsAuthenticated(false);
    setIsGuest(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
    <div className="container">
      {isHomePage ? (
        <>
          <img src={logo} alt="Logo" className="logo_icon" />
          <div className="logo">Mona Fashions</div>
          <div className="search-bar1">
            <input 
              type="text" 
              placeholder="Search products..." 
              onChange={(e) => onSearch(e.target.value)} 
            />
            <button><SearchIcon /></button>
          </div>
  
          {/* Account button added to the right corner */}
          <div className="account-section" onClick={() => goToPage("/login")}>
          <AccountCircleIcon sx={{ color: "white", fontSize: "30px" }} />
          </div>
        </>
      ) : (
        <div className="flex-layout">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </button>
          <div className="logo">Mona Fashions</div>

        </div>
        
      )}
    </div>
  </nav>

  );
};

export default Navbar;