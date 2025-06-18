import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import ProductDetails from "./pages/ProductDetails";
import Tabview from "./pages/Tabview";
import Login from "./pages/Login";
import ConfirmOrder from "./pages/ConfirmOrder";
import Orders from './pages/Orders';
import TrackingOrders from "./pages/TrackingOrders"
import ManageOrders from './pages/ManageOrders';
import Category from "./pages/Category";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/FirebaseService";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );
  const [isGuest, setIsGuest] = useState(
    () => localStorage.getItem("isGuest") === "true"
  );
  

  useEffect(() => {
    // Ensure local storage is initialized properly
    if (localStorage.getItem("isGuest") === null) {
      localStorage.setItem("isGuest", "true"); // Set guest mode by default
    }
    if (localStorage.getItem("isAuthenticated") === null) {
      localStorage.setItem("isAuthenticated", "false"); // Ensure user is NOT authenticated by default
    }
  
    // Fetch stored authentication data
    const isGuestStored = localStorage.getItem("isGuest") === "true";
    const isAuthenticatedStored = localStorage.getItem("isAuthenticated") === "true";
  
    // Set initial state based on stored values
    setIsGuest(isGuestStored);
    setIsAuthenticated(isAuthenticatedStored);
  
    // Firebase listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Only set authentication if localStorage does NOT mark the user as a guest
        if (!isGuestStored) {
          setIsAuthenticated(true);
          setIsGuest(false);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("isGuest", "false");
        }
      } else {
        // Keep the guest state if it's already set in storage
        setIsAuthenticated(isAuthenticatedStored);
        setIsGuest(isGuestStored);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <MainContent 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery} 
      isAuthenticated={isAuthenticated} 
      setIsAuthenticated={setIsAuthenticated} 
      isGuest={isGuest} 
      setIsGuest={setIsGuest} 
    />
  );
}

const MainContent = ({ searchQuery, setSearchQuery, isAuthenticated, setIsAuthenticated, isGuest, setIsGuest }) => {
  const location = useLocation();

  const hideNavOnRoutes = ["/", "/login"];
  const shouldShowNavs = !hideNavOnRoutes.includes(location.pathname);

  return (
    <>
      {/* Top NavBar */}
      {shouldShowNavs && (
        <NavBar 
          onSearch={setSearchQuery} 
          isAuthenticated={isAuthenticated} 
          isGuest={isGuest} 
        />
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login setIsGuest={setIsGuest} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={<Home searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductDetails />} /> 
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/manageOrders" element={<ManageOrders />} />
        <Route path="/trackingOrders/:orderId" element={<TrackingOrders />} />
        <Route path="/categories" element={<Category />} />
        <Route 
          path="/products" 
          element={isAuthenticated ? <Tabview /> : <Navigate to="/login" />} 
        />
      </Routes>

      {/* Bottom Navigation */}
      {shouldShowNavs && (
        <BottomNav 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
        isGuest={isGuest} 
        setIsGuest={setIsGuest} 
      />      
      )}
    </>
  );
};

export default App;