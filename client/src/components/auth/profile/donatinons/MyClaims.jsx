import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../../../context/AppContext";


const MyClaims = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/items/my-claims/${userData._id}`);
      console.log("Result in my claims", res.data);
      setClaims(res.data);
    } catch (err) {
      toast.error("Failed to fetch claimed items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchClaims();
    }
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">My Claimed Donations</h2>
      {claims.length === 0 ? (
        <p className="text-center text-gray-500">You haven't claimed any items yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {claims.map((item) => (
            <div key={item._id} className="border p-4 rounded-md shadow hover:shadow-lg transition">
              <img
                src={item.imageUrls?.[0] || "/placeholder.jpg"}
                alt={item.title}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-700 mt-1">Category: {item.category}</p>
              <p className="text-xs text-gray-500 mt-2">Claimed on: {new Date(item.claimedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
