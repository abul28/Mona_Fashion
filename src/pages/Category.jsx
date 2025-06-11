import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { firestore } from "../firebase/FirebaseService";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesWithImages = async () => {
      try {
        const categorySnapshot = await getDocs(collection(firestore, "categories"));
        if (categorySnapshot.empty) {
          console.warn("No categories found in Firestore.");
          setCategories([]);
          return;
        }

        const fetchedCategories = await Promise.all(
          categorySnapshot.docs.map(async (doc) => {
            const categoryData = doc.data();
        
            // Fetch all products in the category
            const productQuery = query(
              collection(firestore, "products"),
              where("category", "==", categoryData.name),
              orderBy("timestamp", "desc"),  
              limit(1) // Fetch only the latest product
            );
        
            const productSnapshot = await getDocs(productQuery);
            const productList = productSnapshot.docs.map(doc => doc.data());
        
            return {
              ...categoryData,
              img: productList.length > 0
                ? (productList[0]?.imageUrls?.length > 0 
                  ? productList[0]?.imageUrls[0] 
                  : productList[0]?.imageUrl) // First image from imageUrls or fallback to imageUrl
                : "", 
            };
          })
        );

        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithImages();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/home?category=${categoryName}`);
  };

  return (
    <div>
      <h2 className="section-title">Categories</h2>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="category-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-item" onClick={() => handleCategoryClick(category.name)}>
              <div className="category-image">
                {category.img ? (
                  <img src={category.img} alt={category.name} />
                ) : (
                  <span>No image</span>
                )}
              </div>
              <p className="category-name">{category.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;