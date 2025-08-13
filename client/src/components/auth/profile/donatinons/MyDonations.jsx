import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../../../context/AppContext";

const MyDonations = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyDonations = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/items/my-donations/${userData._id}`,
        { withCredentials: true }
      );
      setDonations(res.data);
    } catch (err) {
      console.error("Failed to fetch donations", err);
      toast.error("❌ Could not load your donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  if (loading) return <div className="text-center mt-8">⏳ Loading your donations...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        🎁 My Donations
      </h2>

      {donations.length === 0 ? (
        <p className="text-center text-gray-500">
          🙁 You haven’t donated anything yet. Let’s spread some kindness!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {donations.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-md shadow hover:shadow-lg transition bg-white"
            >
              {item.imageUrls?.[0] && (
                <img
                src={item.imageUrls[0]}
                alt={item.title}
                className="w-full object-contain rounded-md mb-3 bg-gray-100"
                style={{ height: "250px" }}
              />
              )}
              <h3 className="text-lg font-semibold text-green-800">📦 {item.title}</h3>
              <p className="text-sm text-gray-700 mt-1">
                📝 <strong>Description:</strong> {item.description}
              </p>
              <p className="text-sm text-gray-700">
                🏷️ <strong>Category:</strong> {item.category}
              </p>
              <p className="text-sm text-gray-700">
                🔢 <strong>Quantity:</strong> {item.quantity}
              </p>
              <p className="text-sm text-gray-700">
                📍 <strong>Pickup Address:</strong> {item.pickupAddress}
              </p>
              <p className="text-sm text-gray-700">
                📞 <strong>Contact:</strong> {item.contactNumber}
              </p>
              <p className="mt-2 font-medium text-sm text-blue-700">
                📌 <strong>Status:</strong>{" "}
                {item.claimedBy
                  ? `✅ Claimed by user ID: ${item.claimedBy}`
                  : "❌ Not claimed yet"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
