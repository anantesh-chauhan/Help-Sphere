import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../../../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // ✅ import framer motion

const ViewDonations = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all unclaimed donations
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

  // Handle item claim
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
      fetchItems(); // Refresh after claim
    } catch (err) {
      console.error("Claim error", err);
      toast.error("Failed to claim item");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
        Available Donations
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading donations...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">
          No items available for donation at the moment.
        </p>
      ) : (
        items.map((item, index) => (
          <motion.div
            key={item._id}
            className="border border-gray-300 rounded-lg bg-white shadow-md p-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            {/* Animated Image */}
            {item.imageUrls?.length > 0 && (
              <motion.img
                src={item.imageUrls[0]}
                alt={item.title}
                className="w-full object-contain rounded-md mb-3 bg-gray-100"
                style={{ height: "250px" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              />
            )}

            {/* Title & Basic Info */}
            <h3 className="text-lg font-semibold text-green-800">
              {item.title}
            </h3>
            <p className="text-gray-700">
              <strong>Description:</strong> {item.description}
            </p>
            <p className="text-gray-700">
              <strong>Category:</strong> {item.category}
            </p>
            <p className="text-gray-700">
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p className="text-gray-700">
              <strong>Pickup Address:</strong> {item.pickupAddress}
            </p>
            <p className="text-gray-700">
              <strong>Contact:</strong> {item.contactNumber}
            </p>

            {/* Category-specific fields */}
            {item.category === "food" && (
              <>
                {item.expiryDate && (
                  <p className="text-gray-700">
                    <strong>Expiry Date:</strong>{" "}
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                )}
                {item.cookedAt && (
                  <p className="text-gray-700">
                    <strong>Cooked At:</strong>{" "}
                    {new Date(item.cookedAt).toLocaleString()}
                  </p>
                )}
                {item.foodType && (
                  <p className="text-gray-700">
                    <strong>Food Type:</strong> {item.foodType}
                  </p>
                )}
                {item.storageInfo && (
                  <p className="text-gray-700">
                    <strong>Storage Info:</strong> {item.storageInfo}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Perishable:</strong> {item.isPerishable ? "Yes" : "No"}
                </p>
                <p className="text-gray-700">
                  <strong>Vegetarian:</strong> {item.isVeg ? "Yes" : "No"}
                </p>
                {item.allergens?.length > 0 && (
                  <p className="text-gray-700">
                    <strong>Allergens:</strong> {item.allergens.join(", ")}
                  </p>
                )}
              </>
            )}

            {item.category === "clothes" && (
              <>
                <p className="text-gray-700">
                  <strong>Size:</strong> {item.size}
                </p>
                <p className="text-gray-700">
                  <strong>Color:</strong> {item.color}
                </p>
                <p className="text-gray-700">
                  <strong>Gender:</strong> {item.gender}
                </p>
              </>
            )}

            {item.category === "electronics" && (
              <>
                <p className="text-gray-700">
                  <strong>Brand:</strong> {item.brand}
                </p>
                <p className="text-gray-700">
                  <strong>Power Requirement:</strong> {item.powerRequirement}
                </p>
                <p className="text-gray-700">
                  <strong>Working:</strong> {item.isWorking ? "Yes" : "No"}
                </p>
              </>
            )}

            {/* Common Field */}
            <p className="text-gray-700">
              <strong>Can Deliver:</strong> {item.canDeliver ? "Yes" : "No"}
            </p>

            {/* Claim Button */}
            {userData ? (
              <motion.button
                onClick={() => handleClaim(item._id)}
                style={{
                  backgroundColor: "#16a34a", // green-600
                  color: "#ffffff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  marginTop: "0.75rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease"
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#15803d" }} // green-700 on hover
                whileTap={{ scale: 0.95 }}
              >
                Claim
              </motion.button>
            ) : (
              <p style={{ color: "#b91c1c", marginTop: "0.5rem" }}>
                Login to claim this item
              </p>
            )}

          </motion.div>
        ))
      )}
    </div>
  );
};

export default ViewDonations;
