import React, { useEffect, useState } from 'react';
import './ConfirmOrder.css';
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Typography } from '@mui/material';
import { doc, getDoc, addDoc, runTransaction, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from '../firebase/FirebaseService';
import CircularProgress from '@mui/material/CircularProgress';

const ConfirmOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [showPacking, setShowPacking] = useState(false);
const [orderSuccess, setOrderSuccess] = useState(false);


  const [loading, setLoading] = useState(false);

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

 const handleConfirmOrder = async () => {
  if (!name || !phone || !buildingNo || !streetName || !city || !stateName || !pincode) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);
  setShowPacking(true);

  try {
    const orderId = await runTransaction(firestore, async (transaction) => {
      const counterRef = doc(firestore, "counters", "orderCounter");
      const counterSnap = await transaction.get(counterRef);
      if (!counterSnap.exists()) throw "Counter document does not exist!";
      const newCount = (counterSnap.data().count || 0) + 1;
      transaction.update(counterRef, { count: newCount });
      return newCount;
    });

    const formattedOrderId = `#${String(orderId).padStart(4, "0")}`;
    const orderData = {
      orderId: formattedOrderId,
      name,
      phone,
      address: `${buildingNo}, ${streetName}, ${city}, ${stateName} - ${pincode}`,
      buildingNo, streetName, city, stateName, pincode,
      productId: product.id,
      quantity,
      size: selectedSize,
      productName: productData.name,
      price: productData.price,
      totalPrice: productData.price * quantity,
      image: productData.imageUrls?.[0] || productData.imageUrl,
      status: "Order",
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(firestore, "orders"), orderData);

    // ✅ Show Packing first, then Success
    setOrderSuccess(true); // This will show the success UI

setTimeout(() => {
  setShowPacking(false); // Hide packing and show success
}, 5000); // 3-second delay for packing animation

setTimeout(() => {
  navigate("/"); // Navigate to homepage after 6 seconds total
}, 1000); // 3s for packing + 3s for success screen

  } catch (error) {
    console.error("Order failed", error);
    alert("Failed to place order. Please try again.");
    setShowPacking(false); // Hide packing if error
  } finally {
    setLoading(false);
  }
};



  if (!productData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  const generateTrackingLink = (orderId) => {
    return `https://monafashion.vercel.app/trackingOrders/${orderId}`;
  };
  
  const generateWhatsAppLink = (phone, orderId, productName, totalPrice) => {
    const trackingLink = generateTrackingLink(orderId);
  
    const message = encodeURIComponent(
      `🌟 Great news! We have received your order *${orderId}* amounting *₹${totalPrice}*. \n🚚 Your order is on its way! \n\n📍 Track your shipment here: \n👉 ${trackingLink}`
    );
  
    return `https://wa.me/${phone}?text=${message}`;
  };

  const totalOriginalPrice = productData.originalPrice * quantity;
  const totalFinalPrice = productData.price * quantity;
  const totalDiscount = totalOriginalPrice - totalFinalPrice;
  const totalAmount = totalFinalPrice; 

  if (showPacking && !orderSuccess) {
  return (
    <div className="packing-container">
      <img src="/packing.gif" alt="Packing your order..." className="packing-animation" />
      <h3>Packing your order...</h3>
    </div>
  );
}

// ✅ Show success confirmation message
if (orderSuccess) {
  return (
    <div className="success-container">
      <img src="/success.gif" alt="Order Confirmed" className="success-animation" />
      <h2>🎉 Order Confirmed!</h2>
      <p>Your order has been successfully placed. We’ll notify you once it's shipped.</p>
    </div>
  );
}
  return (
    <div className="confirm-container">
      
      {/* Form Fields */}
      <div className="order-form">
        
        <TextField label="Name" variant="outlined" fullWidth margin="normal" size='small' value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Phone Number" variant="outlined" fullWidth margin="normal" value={phone} size='small'
                    inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
                    onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, '');
                    if (onlyNums.length <= 10) {
                        setPhone(onlyNums);
                    }
                }}
        />
        <TextField label="Building No" variant="outlined" fullWidth margin="normal" size='small' value={buildingNo} onChange={(e) => setBuildingNo(e.target.value)} />
        <TextField label="Street Name" variant="outlined" fullWidth margin="normal" size='small' value={streetName} onChange={(e) => setStreetName(e.target.value)} />
        <TextField label="City" variant="outlined" fullWidth margin="normal" size='small' value={city} onChange={(e) => setCity(e.target.value)} />
        <TextField label="State" variant="outlined" fullWidth margin="normal" size='small' value={stateName} onChange={(e) => setStateName(e.target.value)} />
        <TextField label="Pincode" variant="outlined" fullWidth margin="normal" size='small' value={pincode} onChange={(e) => setPincode(e.target.value)} />
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
        <button onClick={handleConfirmOrder} disabled={loading}>
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
