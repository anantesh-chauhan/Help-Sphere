import { useState, useEffect } from 'react';
import axios from 'axios';

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const res = await axios.get('/api/friends/incoming', { withCredentials: true });
    setRequests(res.data);
  };

  const accept = async (id) => {
    await axios.post(`/api/friends/accept/${id}`, {}, { withCredentials: true });
    load();
  };

  const reject = async (id) => {
    await axios.post(`/api/friends/reject/${id}`, {}, { withCredentials: true });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-2">
      {requests.map(r => (
        <div key={r._id} className="flex items-center justify-between bg-gray-100 p-3 rounded">
          <div className="flex items-center space-x-3">
            <img src={r.from.avatar || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
            <span>{r.from.name}</span>
          </div>
          <div className="space-x-2">
            <button onClick={() => accept(r._id)} className="bg-green-500 text-white px-3 py-1 rounded">Accept</button>
            <button onClick={() => reject(r._id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
