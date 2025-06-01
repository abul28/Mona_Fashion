import React, { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import ListIcon from "@mui/icons-material/List";
import PersonIcon from "@mui/icons-material/Person";
import "./BottomNav.css";

const BottomNav = ({ isAuthenticated, isGuest, setIsAuthenticated, setIsGuest }) => {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true); // Track visibility of BottomNav
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNav(false); // Hide when scrolling down
    } else {
      setShowNav(true); // Show when scrolling up
    }
    lastScrollY = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
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

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={`bottom-nav ${showNav ? "visible" : "hidden"}`}>
      
      <div onClick={() => goToPage("/home")}>
        <HomeIcon sx={{ color: "black" }} />
        <span>Home</span>
      </div>

      <div onClick={() => goToPage("/categories")}>
        <CategoryIcon sx={{ color: "black" }} />
        <span>Categories</span>
      </div>

      {/* Show Manage Products only if authenticated and not a guest */}
      {isAuthenticated && !isGuest && (
        <div onClick={() => goToPage("/products")}>
          <ListIcon sx={{ color: "black" }} />
          <span>Manage</span>
        </div>
      )}

      {(isAuthenticated || isGuest) ? (
        <div onClick={handleLogout}>
          <PersonIcon sx={{ color: "black" }} />
          <span>Account</span>
        </div>
      ) : (
        <div onClick={() => goToPage("/login")}>
          <PersonIcon sx={{ color: "black" }} />
          <span>Account</span>
        </div>
      )}
    </div>
  );
};

export default BottomNav;