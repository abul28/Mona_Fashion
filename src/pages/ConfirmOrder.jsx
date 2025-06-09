import React, { useEffect, useState } from 'react';
import './ConfirmOrder.css';
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Typography } from '@mui/material';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from '../firebase/FirebaseService';
import CircularProgress from '@mui/material/CircularProgress';

const ConfirmOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);

  const { product, selectedSize, quantity = 1 } = state || {};

  useEffect(() => {
    const fetchProduct = async () => {
      if (!product?.id) return;

      const docRef = doc(firestore, "products", product.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProductData(docSnap.data());
      }
    };

    fetchProduct();
  }, [product]);

  if (!productData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  // 👉 Dynamic Calculations
  const totalOriginalPrice = productData.originalPrice * quantity;
  const totalFinalPrice = productData.price * quantity;
  const totalDiscount = totalOriginalPrice - totalFinalPrice;
//   const platformFee = 4;
  const totalAmount = totalFinalPrice;

  return (
    <div className="confirm-container">
      {/* Form Fields */}
      <div className="order-form">
        <TextField label="Name" variant="outlined" fullWidth margin="normal" />
        <TextField label="Phone Number" type="tel" variant="outlined" fullWidth margin="normal" />
        <TextField label="Address" variant="outlined" multiline rows={3} fullWidth margin="normal" />
      </div>

      {/* Product Summary Section */}
      <div className="product-summary">
        <div className="tag">Top Discount of the Sale</div>
        <div className="summary-content">
          <img
            src={productData.imageUrls?.[0] || productData.imageUrl}
            alt={productData.name}
            className="product-image"
          />
          <div className="details">
            <h4>{productData.name}</h4>
            <Typography variant="body2" color="textSecondary">{productData.color || 'Color: Blue'}</Typography>
            <div className="discount-info">
              <span className="discount">↓ {productData.discount}%</span>
              <span className="original-price">₹{productData.originalPrice}</span>
              <span className="final-price">₹{productData.price}</span>
            </div>
            <Typography variant="body2">
              Delivery Charges <s>₹70</s> <span className="free">FREE</span>
            </Typography>
          </div>
        </div>
      </div>

      {/* Price Box */}
      <div className="price-box">
        <h3>Price Details</h3>
        <div className="price-detail-row"><span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span><span>₹{totalOriginalPrice}</span></div>
        <div className="price-detail-row"><span>Discount</span><span className="green">- ₹{totalDiscount}</span></div>
        <div className="price-detail-row"><span>Delivery Charges</span><span><s>₹70</s> <span className="green">FREE</span></span></div>
        <div className="total-row"><span>Total Amount</span><span>₹{totalAmount}</span></div>
        <div className="save-message">💰 You'll save ₹{totalDiscount} on this order!</div>
      </div>

      {/* Confirm Order Button */}
      <div className="confirm-btn-container">
        <button>Confirm Order</button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
