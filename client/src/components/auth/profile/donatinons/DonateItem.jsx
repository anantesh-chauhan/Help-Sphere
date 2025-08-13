import React, { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AppContent } from "../../../../context/AppContext";
import { toast } from "react-toastify";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05 },
  }),
};

const DonateItem = () => {
  const { backendUrl } = useContext(AppContent);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    quantity: "",
    expiryDate: "",
    isPerishable: false,
    cookedAt: "",
    storageInfo: "",
    isVeg: true,
    foodType: "",
    allergens: "",
    size: "",
    color: "",
    gender: "",
    brand: "",
    isWorking: true,
    powerRequirement: "",
    pickupAddress: "",
    contactNumber: "",
    canDeliver: false,
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("📷 Please select a file first.");
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await axios.post(`${backendUrl}/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Image uploaded successfully");
      setImageUrl(res.data.url);
    } catch (err) {
      toast.error("❌ Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) return toast.error("📤 Upload image first");

    const payload = {
      ...formData,
      imageUrls: [imageUrl],
      allergens: formData.allergens
        ? formData.allergens.split(",").map((a) => a.trim())
        : [],
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" || payload[key] === null) {
        delete payload[key];
      }
    });

    try {
      await axios.post(`${backendUrl}/api/items/create`, payload, {
        withCredentials: true,
      });
      toast.success("🎁 Item donated successfully");
      setFormData({
        title: "",
        description: "",
        category: "",
        quantity: "",
        expiryDate: "",
        isPerishable: false,
        cookedAt: "",
        storageInfo: "",
        isVeg: true,
        foodType: "",
        allergens: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        isWorking: true,
        powerRequirement: "",
        pickupAddress: "",
        contactNumber: "",
        canDeliver: false,
      });
      setImageUrl("");
      setFile(null);
    } catch {
      toast.error("⚠️ Failed to donate item. Are you logged in?");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <motion.h1
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#2e7d32",
        }}
      >
        🎁 Donate an Item
      </motion.h1>

      {/* Upload Form */}
      <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold", display: "block" }}>
          📷 Upload Item Image
        </label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginTop: "8px" }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            background: "#2e7d32",
            color: "#fff",
            padding: "6px 14px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ⬆️ Upload Image
        </button>
        {imageUrl && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{ maxWidth: "100%", height: "200px", borderRadius: "5px" }}
            />
          </div>
        )}
      </form>

      {/* Donation Form */}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        {[
          { placeholder: "🏷️ Title", key: "title", type: "text", required: true },
          {
            placeholder: "📦 Quantity",
            key: "quantity",
            type: "text",
            required: true,
          },
        ].map((field, i) => (
          <motion.input
            key={field.key}
            variants={fieldVariants}
            custom={i}
            initial="hidden"
            animate="visible"
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.key]}
            onChange={(e) =>
              setFormData({ ...formData, [field.key]: e.target.value })
            }
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        ))}

        <motion.textarea
          variants={fieldVariants}
          custom={3}
          initial="hidden"
          animate="visible"
          placeholder="🖋️ Description"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            minHeight: "80px",
          }}
        />

        {/* Category Select */}
        <motion.select
          variants={fieldVariants}
          custom={4}
          initial="hidden"
          animate="visible"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="">📂 Select Category</option>
          <option value="food">🍲 Food</option>
          <option value="clothes">👕 Clothes</option>
          <option value="books">📚 Books</option>
          <option value="toys">🧸 Toys</option>
          <option value="electronics">💻 Electronics</option>
          <option value="furniture">🛋️ Furniture</option>
          <option value="household">🏠 Household</option>
          <option value="others">✨ Others</option>
        </motion.select>

        {/* Submit */}
        <motion.button
          variants={fieldVariants}
          custom={5}
          initial="hidden"
          animate="visible"
          type="submit"
          style={{
            marginTop: "10px",
            background: "#f9a825",
            color: "#fff",
            padding: "10px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ✅ Submit Donation
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DonateItem;
