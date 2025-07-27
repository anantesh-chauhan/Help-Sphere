import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../../../context/AppContext";

const MyDonations = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyDonations = async () => {
    // if (!userData) return;
    try {
      const res = await axios.get(`${backendUrl}/api/items/my-donations/${userData._id}`, {
        withCredentials: true,
      });
      setDonations(res.data);
    } catch (err) {
      console.error("Failed to fetch donations", err);
      toast.error("Could not load your donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        My Donations
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : donations.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t donated anything yet.</p>
      ) : (
        donations.map((item) => (
          <div
            key={item._id}
            className="border border-gray-300 rounded-md bg-white shadow-sm p-4 mb-5"
          >
            {item.imageUrls?.[0] && (
              <img
                src={item.imageUrls[0]}
                alt={item.title}
                className="w-full max-h-64 object-cover rounded mb-3"
              />
            )}
            <h3 className="text-xl font-semibold text-green-800">{item.title}</h3>
            <p className="text-gray-700 mt-1"><strong>Description:</strong> {item.description}</p>
            <p className="text-gray-700"><strong>Category:</strong> {item.category}</p>
            <p className="text-gray-700"><strong>Quantity:</strong> {item.quantity}</p>
            <p className="text-gray-700"><strong>Pickup Address:</strong> {item.pickupAddress}</p>
            <p className="text-gray-700"><strong>Contact Number:</strong> {item.contactNumber}</p>
            <p className="mt-2 font-medium text-sm text-blue-700">
              Status:{" "}
              {item.claimedBy
                ? `Claimed by user ID: ${item.claimedBy}`
                : "Not claimed yet"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyDonations;
