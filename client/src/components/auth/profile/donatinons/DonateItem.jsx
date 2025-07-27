import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../../../context/AppContext";
import { toast } from "react-toastify";

const DonateItem = () => {
    const { backendUrl, userData } = useContext(AppContent);

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
        if (!file) return toast.error("Please select a file first.");

        const data = new FormData();
        data.append("file", file);

        try {
            const res = await axios.post(`${backendUrl}/upload`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Image uploaded successfully");
            setImageUrl(res.data.url);
        } catch (err) {
            console.error("Upload error", err);
            toast.error("Image upload failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageUrl) return toast.error("Upload image first");

        // Prepare payload
        const payload = {
            ...formData,
            imageUrls: [imageUrl],
            allergens: formData.allergens
                ? formData.allergens.split(",").map((a) => a.trim())
                : [],
        };

        // Remove empty string or null/undefined fields
        Object.keys(payload).forEach((key) => {
            if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
                delete payload[key];
            }
        });

        try {
            const res = await axios.post(`${backendUrl}/api/items/create`, payload, {
                withCredentials: true,
            });

            toast.success("Item donated successfully");
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
        } catch (err) {
            console.error("Submit error", err);
            toast.error("Failed to donate item. Are you logged in?");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-green-700">Donate an Item</h1>

            {/* Image Upload */}
            <form onSubmit={handleUpload} className="mb-6">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit" className="ml-4 bg-green-600 text-white px-4 py-2 rounded">
                    Upload Image
                </button>
                {imageUrl && (
                    <div className="mt-4">
                        <img
                            src={imageUrl}
                            alt="Uploaded Item"
                            style={{ maxWidth: "100%", height: "35vh" }} />
                        {/* <p className="text-blue-500 mt-2 break-words">{imageUrl}</p> */}
                    </div>
                )}
            </form>

            {/* Donation Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Title" value={formData.title} required
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="p-2 border rounded"
                />
                <input placeholder="Quantity (e.g., 2 kg, 5 items)" required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="p-2 border rounded"
                />
                <textarea placeholder="Description" required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="p-2 border rounded col-span-full"
                />
                <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="p-2 border rounded"
                >
                    <option value="">Select Category</option>
                    <option value="food">Food</option>
                    <option value="clothes">Clothes</option>
                    <option value="books">Books</option>
                    <option value="toys">Toys</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="household">Household</option>
                    <option value="others">Others</option>
                </select>

                {/* Dynamic Fields */}
                {formData.category === "food" && (
                    <>
                        <input type="datetime-local" value={formData.cookedAt}
                            onChange={(e) => setFormData({ ...formData, cookedAt: e.target.value })}
                            className="p-2 border rounded"
                            placeholder="Cooked At"
                        />
                        <input type="date" value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            className="p-2 border rounded"
                            placeholder="Expiry Date"
                        />
                        <input
                            type="text"
                            placeholder="Food Type (dry/cooked/packaged)"
                            value={formData.foodType}
                            onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Allergens (comma separated)"
                            value={formData.allergens}
                            onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                            className="p-2 border rounded col-span-full"
                        />
                        <input
                            type="text"
                            placeholder="Storage Info"
                            value={formData.storageInfo}
                            onChange={(e) => setFormData({ ...formData, storageInfo: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <label className="flex items-center gap-2">
                            <input type="checkbox"
                                checked={formData.isPerishable}
                                onChange={(e) => setFormData({ ...formData, isPerishable: e.target.checked })}
                            />
                            Is Perishable?
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox"
                                checked={formData.isVeg}
                                onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                            />
                            Vegetarian?
                        </label>
                    </>
                )}

                {formData.category === "clothes" && (
                    <>
                        <input placeholder="Size (S/M/L/XL)"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <input placeholder="Color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="p-2 border rounded"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </>
                )}

                {formData.category === "electronics" && (
                    <>
                        <input placeholder="Brand"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <input placeholder="Power Requirement"
                            value={formData.powerRequirement}
                            onChange={(e) => setFormData({ ...formData, powerRequirement: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <label className="flex items-center gap-2">
                            <input type="checkbox"
                                checked={formData.isWorking}
                                onChange={(e) => setFormData({ ...formData, isWorking: e.target.checked })}
                            />
                            Is Working?
                        </label>
                    </>
                )}

                {/* Common Pickup Fields */}
                <input placeholder="Pickup Address"
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    className="p-2 border rounded col-span-full"
                />
                <input placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="p-2 border rounded"
                />
                <label className="flex items-center gap-2 col-span-full">
                    <input type="checkbox"
                        checked={formData.canDeliver}
                        onChange={(e) => setFormData({ ...formData, canDeliver: e.target.checked })}
                    />
                    I can deliver this item
                </label>

                <button type="submit" className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 col-span-full mt-2">
                    Submit Donation
                </button>
            </form>
        </div>
    );
};

export default DonateItem;
