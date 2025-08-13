import { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AppContent } from '../../context/AppContext';

export default function AllUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { backendUrl } = useContext(AppContent);
    const defaultAvatar = 'https://res.cloudinary.com/dlixtmy1x/image/upload/v1755115315/avatar_izmj6c.webp'

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/api/friends/users`, { withCredentials: true });
            console.log(res.data);
            setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };


    const sendFriendRequest = async (id) => {
        try {
            await axios.post(`${backendUrl}/api/friends/request`, { toUserId: id }, { withCredentials: true });
            fetchUsers(); // Refresh to update status
        } catch (err) {
            console.error('Error sending request:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <div className="text-center p-6">Loading users...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">All Users</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
                        <img
                            src={defaultAvatar}
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
                                    onClick={() => sendFriendRequest(user._id)}
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
        </div>
    );
}
