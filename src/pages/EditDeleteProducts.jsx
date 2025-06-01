import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/FirebaseService";
import { collection, getDocs, deleteDoc, doc } from "@firebase/firestore";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import "./EditDeleteProducts.css";

const EditDeleteProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(firestore, "products"));
    const productList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(productList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(firestore, "products", productToDelete.id));
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      //alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setOpenConfirm(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (product) => {
    navigate("/products", { state: { productToEdit: product, selectedTab: 0 } });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      <input
        type="text"
        placeholder="Search product..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredProducts.map((product) => (
        <div key={product.id} className="list-item">
          <img src={product.imageUrl} alt={product.name} className="item-image" />
          <div className="item-details">
            <p className="item-name">{product.name}</p>
            <p className="item-status">Description: {product.description || "N/A"}</p>
            <p className="item-leads">Price: ₹{product.price}</p>
          </div>
          <div className="item-actions">
            <IconButton onClick={() => handleEditProduct(product)} className="edit-btn">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(product)} className="delete-btn">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the product "{productToDelete?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditDeleteProducts;
