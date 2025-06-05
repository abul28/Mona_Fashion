import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { firestore } from "../firebase/FirebaseService";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom"; // Make sure this is imported at the top
import "./Home.css";

const Home = ({ searchQuery = "", onSearch }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "products"));
        const productsArray = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "categories"));
        const categoriesArray = querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
        setCategories(categoriesArray);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category") || "";
    setSelectedCategory(categoryParam);
  
    let updatedProducts = [...products];
  
    // Filter by category only if a category is selected
    if (categoryParam) {
      updatedProducts = updatedProducts.filter((product) => product.category === categoryParam);
    }
  
    // Apply search filter
    if (searchQuery.trim()) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }
  
    setFilteredProducts(updatedProducts);
  }, [location.search, products, searchQuery]);
  
  

  const handleCategoryClick = (category) => {
    if (category === "") {
      navigate("/home"); // removes ?category= from URL
    } else {
      navigate(`/home?category=${category}`);
    }
  };

  return (
    <div>
      <div className="category-bar">
        <span className={`category-item ${selectedCategory === "" ? "active" : ""}`} onClick={() => handleCategoryClick("")}>
          All
        </span>
        {categories.map((category) => (
          <span key={category.id} className={`category-item ${selectedCategory === category.name ? "active" : ""}`} onClick={() => handleCategoryClick(category.name)}>
            {category.name}
          </span>
        ))}
      </div>

      <div className="clothes-container">
        <h2 className="section-title">Explore Our Collection</h2>
        <div className="card-grid">
        {filteredProducts.length > 0 ? (
  filteredProducts.map((item) => (
    <Link to={`/product/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="clothing-card">
  <div className="image-container">
    {item.tag && (
      <span
      className="tag-badge"
      style={{
        backgroundColor:
          item.tag === "Sold Out"
            ? "#CD5656"
            : item.tag === "New Arrival"
            ? "#55AD9B"
            : "#A594F9" // Default for Best Selling
      }}
    >
      {item.tag.toUpperCase()}
    </span>
    )}

    {item.imageUrls && item.imageUrls.length > 0 ? (
      <img
        src={item.imageUrls[0]}
        alt={item.name}
        className="card-image"
      />
    ) : item.imageUrl ? (
      <img
        src={item.imageUrl}
        alt={item.name}
        className="card-image"
      />
    ) : null}
  </div>

  <div className="card-info">
    <h3 className="product-name">{item.name}</h3>
    <div className="price-info">
      <span className="current-price">₹{item.price}</span>
      <span className="original-price">₹{item.originalPrice}</span>
      <span className="discount">{item.discount}% off</span>
    </div>
    <span className="free-delivery">🚚 Free Delivery</span>
  </div>
</div>
    </Link>
  ))
) : (
  <div className="search-filter-alert">
    <p>No products found for "{selectedCategory}"</p>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default Home;