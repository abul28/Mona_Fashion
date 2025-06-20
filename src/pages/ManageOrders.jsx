import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query  } from 'firebase/firestore';
import { firestore } from '../firebase/FirebaseService';
import { useNavigate } from "react-router-dom";
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
  try {
    const ordersRef = collection(firestore, 'orders');
    const q = query(ordersRef, orderBy("timestamp", "desc")); // newest first
    const querySnapshot = await getDocs(q);

    const orderList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(orderList);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    navigate("/orders", {
        state: {
          ...order,
          buildingNo: order.buildingNo,
          streetName: order.streetName,
          city: order.city,
          stateName: order.stateName,
          pincode: order.pincode,
          status: order.status,
          id: order.id,
          productData: {
            name: order.productName,
            price: order.price,
            originalPrice: order.originalPrice,
            discount: order.discount,
            imageUrls: [order.image],
            color: order.color,
          },
        },
      });
      
  };

  const filteredOrders = orders.filter(order =>
    order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBackgroundColor = (status) => {
    switch (status) {
      case "Order":
        return "#FF9F9F";
      case "Shipped":
        return "#FFCF81";
      case "Delivered":
        return "#C6EBC9";
      default:
        return "white";
    }
  };

  return (
    <div className="list-container">
  <input
    type="text"
    placeholder="Search order by customer or product name..."
    className="search-bar"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {filteredOrders.length === 0 ? (
    <p>No orders found.</p>
  ) : (
    filteredOrders.map((order) => (
      <div key={order.id} className="list-item" onClick={() => handleViewOrder(order)}>
        {/* Background color wrapper */}
        <div className="status-background" style={{ backgroundColor: getBackgroundColor(order.status) }}>
          <img src={order.image || "/placeholder.png"} alt={order.productName} className="item-image" />
          <div className="item-details">
            <p className="item-name">Product: {order.productName || "N/A"}</p>
            <p className="item-status">Customer: {order.name || "N/A"}</p>
            <p className="item-leads">Phone: {order.phone || "N/A"}</p>
          </div>
        </div>
      </div>
    ))
  )}
</div>
  );
};

export default ManageOrders;