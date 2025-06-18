import React, { useEffect, useState } from 'react';
import './Orders.css';
import { Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/FirebaseService';

const Orders = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { productData, buildingNo, streetName, city, stateName, pincode, status, id } = state || {};

  if (!productData) {
    return <p>Loading order details...</p>;
  }

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
  
    try {
      if (id) {
        const orderRef = doc(firestore, 'orders', id);
        await updateDoc(orderRef, { status: newStatus }); // ✅ Updates tracking status too
      }
      navigate("/manageOrders");
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="orders-container">
      <div className="summary-content">
        <img src={productData.imageUrls?.[0] || productData.imageUrl} alt={productData.name} className="product-image" />
        <div className="details">
          <h4>{productData.name}</h4>
          <Typography variant="body2" color="textSecondary">{productData.color}</Typography>
          <div className="discount-info">
            <span className="discount">↓ {productData.discount}%</span>
            <span className="original-price">₹{productData.originalPrice}</span>
            <span className="final-price">₹{productData.price}</span>
          </div>
          <Typography variant="body2">Delivery Charges <s>₹70</s> <span className="free">FREE</span></Typography>
        </div>
      </div>

      {/* Order Status */}
      <div className="status-section">
        <Typography variant="h6" style={{ marginTop: '1rem' }}>Order Status</Typography>
        <div className="radio-buttons">
  {["Order", "Shipped", "Delivered"].map((statusOption) => (
    <label key={statusOption}>
      <input
        type="radio"
        name="status"
        value={statusOption}
        checked={status ? status === statusOption : statusOption === "Order"} // ✅ Ensures default selection
        onChange={handleStatusChange}
      />
      {statusOption}
    </label>
  ))}
</div>
      </div>

      {/* Shipping Details */}
      <div className="shipping-details">
        <Typography variant="h6"  style={{ marginTop: '1rem', fontSize: 17, fontWeight: 600, }}>Shipping Details</Typography>
        <p><strong>Building No:</strong> {buildingNo}</p>
        <p><strong>Street Name:</strong> {streetName}</p>
        <p><strong>City:</strong> {city}</p>
        <p><strong>State:</strong> {stateName}</p>
        <p><strong>Pincode:</strong> {pincode}</p>
      </div>
    </div>
  );
};

export default Orders;