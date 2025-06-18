import React, { useEffect, useState } from 'react';
import './TrackingOrders.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useParams } from 'react-router-dom'; 
import { query, where, getDocs, collection } from "firebase/firestore";
import { firestore } from '../firebase/FirebaseService';

const TrackingOrders = () => {
  const { orderId } = useParams(); // ✅ Get orderId from URL
  const [orderData, setOrderData] = useState(null);

  // Assuming you have the order ID
useEffect(() => {
  const fetchOrder = async () => {
    const q = query(
      collection(firestore, "orders"),
      console.log(orderId),
      where("orderId", "==", orderId) // no "#" if your orderId is just "0009"
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      setOrderData(snapshot.docs[0].data());
    } else {
      console.warn("No order found with orderId:", orderId);
    }
  };

  fetchOrder();
}, [orderId]);



  if (!orderData) return <p>Loading tracking details...</p>;

  const steps = [
    { label: 'Order Confirmed', key: 'Order' },
    { label: 'Shipped', key: 'Shipped' },
    { label: 'Delivered', key: 'Delivered' }
  ];

  const getStepClass = (stepKey) => {
    const orderStages = ['Order', 'Shipped', 'Delivered'];
    return orderStages.indexOf(orderData.status) >= orderStages.indexOf(stepKey) ? 'completed' : '';
  };

  return (
    <div className="tracking-container no-nav"> {/* ✅ Hide navbar/footer */}
      <h2>Tracking Order</h2>

      <div className="summary-content">
        <img src={orderData.image || orderData.productImage} alt={orderData.productName} className="product-image" />
        <div className="details">
          <h4>{orderData.productName}</h4>
          <p>{orderData.color}</p>
          <div className="discount-info">
            <span className="discount">↓ {orderData.discount}%</span>
            <span className="original-price">₹{orderData.originalPrice}</span>
            <span className="final-price">₹{orderData.price}</span>
          </div>
        </div>
      </div>

      {/* ✅ Tracking Timeline - Updates Dynamically */}
      <div className="tracking-timeline">
        {steps.map((step, index) => (
          <div key={index} className={`tracking-step ${getStepClass(step.key)}`}>
            <div className="icon">
              {getStepClass(step.key) === 'completed' ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
            </div>
            <div className="step-details">
              <p className="label">{step.label}</p>
            </div>
            {index < steps.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      {/* Shipping Details */}
      <div className="shipping-details">
        <h4>Shipping Details</h4>
        <p><strong>Building No:</strong> {orderData.buildingNo}</p>
        <p><strong>Street Name:</strong> {orderData.streetName}</p>
        <p><strong>City:</strong> {orderData.city}</p>
        <p><strong>State:</strong> {orderData.state}</p>
        <p><strong>Pincode:</strong> {orderData.pincode}</p>
      </div>
    </div>
  );
};

export default TrackingOrders;