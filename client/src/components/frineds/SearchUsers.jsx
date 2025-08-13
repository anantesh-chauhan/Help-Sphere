import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AppContent } from '../../context/AppContext';

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContent);
  const defaultAvatar = 'https://res.cloudinary.com/dlixtmy1x/image/upload/v1755115315/avatar_izmj6c.webp';

  const search = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/friends/search?q=${query}`, { withCredentials: true });
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (id) => {
    try {
      await axios.post(`${backendUrl}/api/friends/request`, { toUserId: id }, { withCredentials: true });
      search(); // Refresh list after sending request
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Search Users</h1>

      {/* Search Bar */}
      <div className="flex mb-6">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border p-2 flex-1 rounded-l"
          placeholder="Search users..."
        />
        <button
          onClick={search}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center p-6">Searching users...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(user => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
            >
              <img
                src={user.avatar || defaultAvatar}
                alt={user.name || 'User'}
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>

              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                <span>Donations: {user.donations ?? 0}</span>
                <span>Helps: {user.helpRequests ?? 0}</span>
              </div>

              <div className="mt-4">
                {user.friendStatus === 'not_friend' && (
                  <button
                    onClick={() => sendRequest(user._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Add Friend
                  </button>
                )}
                {user.friendStatus === 'pending' && (
                  <span className="bg-yellow-400 text-white px-3 py-1 rounded">Pending</span>
                )}
                {user.friendStatus === 'friend' && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded">Friends</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
