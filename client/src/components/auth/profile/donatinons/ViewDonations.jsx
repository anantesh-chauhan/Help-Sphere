import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../../../context/AppContext";
import { toast } from "react-toastify";

const ViewDonations = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/items/unclaimed`, {
        withCredentials: true,
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (itemId) => {
    if (!userData) {
      toast.warn("Please login to claim this item");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/items/claim/${itemId}`,
        { userId: userData._id },
        { withCredentials: true }
      );
      toast.success("Item claimed successfully");
      fetchItems(); // Refresh the list
    } catch (err) {
      console.error("Claim error", err);
      toast.error("Failed to claim item");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "1rem",
    },
    card: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1.5rem",
      background: "#fefefe",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    image: {
      maxHeight: "200px",
      width: "100%",
      objectFit: "cover",
      borderRadius: "6px",
    },
    claimBtn: {
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "0.5rem",
    },
    heading: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      textAlign: "center",
      color: "#333",
    },
    label: {
      fontWeight: "bold",
      color: "#444",
    },
    section: {
      marginTop: "0.25rem",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Donations</h2>

      {loading ? (
        <p>Loading donations...</p>
      ) : items.length === 0 ? (
        <p>No items available for donation at the moment.</p>
      ) : (
        items.map((item) => (
          <div key={item._id} style={styles.card}>
            {item.imageUrls?.length > 0 && (
              <img src={item.imageUrls[0]} alt={item.title} style={styles.image} />
            )}
            <h3>{item.title}</h3>
            <p style={styles.section}><span style={styles.label}>Description:</span> {item.description}</p>
            <p style={styles.section}><span style={styles.label}>Category:</span> {item.category}</p>
            <p style={styles.section}><span style={styles.label}>Quantity:</span> {item.quantity}</p>
            <p style={styles.section}><span style={styles.label}>Pickup Address:</span> {item.pickupAddress}</p>
            <p style={styles.section}><span style={styles.label}>Contact:</span> {item.contactNumber}</p>

            {/* Food-specific details */}
            {item.category === "food" && (
              <>
                {item.expiryDate && (
                  <p style={styles.section}>
                    <span style={styles.label}>Expiry Date:</span> {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                )}
                {item.cookedAt && (
                  <p style={styles.section}>
                    <span style={styles.label}>Cooked At:</span> {new Date(item.cookedAt).toLocaleString()}
                  </p>
                )}
                {item.foodType && (
                  <p style={styles.section}><span style={styles.label}>Food Type:</span> {item.foodType}</p>
                )}
                {item.storageInfo && (
                  <p style={styles.section}><span style={styles.label}>Storage Info:</span> {item.storageInfo}</p>
                )}
                <p style={styles.section}><span style={styles.label}>Perishable:</span> {item.isPerishable ? "Yes" : "No"}</p>
                <p style={styles.section}><span style={styles.label}>Vegetarian:</span> {item.isVeg ? "Yes" : "No"}</p>
                {item.allergens?.length > 0 && (
                  <p style={styles.section}><span style={styles.label}>Allergens:</span> {item.allergens.join(", ")}</p>
                )}
              </>
            )}

            {/* Clothes-specific details */}
            {item.category === "clothes" && (
              <>
                <p style={styles.section}><span style={styles.label}>Size:</span> {item.size}</p>
                <p style={styles.section}><span style={styles.label}>Color:</span> {item.color}</p>
                <p style={styles.section}><span style={styles.label}>Gender:</span> {item.gender}</p>
              </>
            )}

            {/* Electronics-specific details */}
            {item.category === "electronics" && (
              <>
                <p style={styles.section}><span style={styles.label}>Brand:</span> {item.brand}</p>
                <p style={styles.section}><span style={styles.label}>Power Requirement:</span> {item.powerRequirement}</p>
                <p style={styles.section}><span style={styles.label}>Working:</span> {item.isWorking ? "Yes" : "No"}</p>
              </>
            )}

            {/* Common field */}
            <p style={styles.section}><span style={styles.label}>Can Deliver:</span> {item.canDeliver ? "Yes" : "No"}</p>

            {userData ? (
              <button onClick={() => handleClaim(item._id)} style={styles.claimBtn}>
                Claim
              </button>
            ) : (
              <p style={{ color: "red", marginTop: "0.5rem" }}>Login to claim this item</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ViewDonations;
