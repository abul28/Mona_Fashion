import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase/FirebaseService";
import { doc, getDoc } from "firebase/firestore";
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M"); // Default size is 'M'
  const [availableSizes, setAvailableSizes] = useState([]); // Store fetched sizes

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(firestore, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct(productData);
          setAvailableSizes(productData.sizes || []); // Fetch available sizes
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2>Loading product details...</h2>;
  }

  const whatsappGroupLink = "https://chat.whatsapp.com/BBkmScIBR1y0fZbLiP2WsI";

  const handlePurchaseClick = () => {
    if (whatsappGroupLink) {
      window.open(whatsappGroupLink, "_blank");
    } else {
      alert("WhatsApp group link is not set.");
    }
  };

  return (
    <div className="product-details-container">
  <div className="product-scrollable-content">
    {/* Desktop Layout Wrapper */}
    <div className="product-layout">
      
      {/* Left - Image Section */}
      <div className="product-image-section">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </div>

      {/* Right - Product Details */}
      <div className="product-info-container">
        <h1 className="product-title">{product.name}</h1>

        <div className="price-section">
          <span className="current-price">₹{product.price}</span>
          <span className="original-price">₹{product.originalPrice}</span>
          <span className="discount">{product.discount}% off</span>
        </div>

        {/* Size Selection */}
        <div className="size-selection">
          <label>Select Size</label>
          <div className="size-options">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={`size-button ${selectedSize === size ? "selected" : ""}`}
                onClick={() => availableSizes.includes(size) && setSelectedSize(size)}
                disabled={!availableSizes.includes(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Assurance Section */}
        <div className="assurance-section">
          <div className="assurance-item">
            <WorkspacePremiumIcon sx={{ fontSize: 28, color: "#3f51b5" }} />
            <p><span className="assurance-line">Original</span><br /><span className="assurance-line">Product</span></p>
          </div>

          <div className="assurance-item">
            <VerifiedIcon sx={{ fontSize: 28, color: "#3f51b5" }} />
            <p><span className="assurance-line">Quality</span><br /><span className="assurance-line">Assured</span></p>
          </div>

          <div className="assurance-item">
            <StorefrontIcon sx={{ fontSize: 28, color: "#3f51b5" }} />
            <p><span className="assurance-line">Verified</span><br /><span className="assurance-line">Seller</span></p>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <h2 className="product-info-title">Product details</h2>
          <div className="product-info-grid">
            <div className="product-info-item">
              <span className="info-label">Fabric</span>
              <span className="info-value">{product.fabric}</span>
            </div>
            <div className="product-info-item">
              <span className="info-label">Color</span>
              <span className="info-value">{product.color}</span>
            </div>
            <div className="product-info-item">
              <span className="info-label">Sleeve</span>
              <span className="info-value">{product.sleeve}</span>
            </div>
            <div className="product-info-item">
              <span className="info-label">Pattern</span>
              <span className="info-value">{product.pattern}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button className="place-order-btn" onClick={handlePurchaseClick}>Place Order</button>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProductDetails;
