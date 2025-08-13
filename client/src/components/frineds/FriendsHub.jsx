import { useState } from 'react';
import SearchUsers from './SearchUsers';
import IncomingRequests from './IncomingRequests';
import AllUsersPage from './AllUsers';
// import OutgoingRequests from './OutgoingRequests';
// import FriendsList from './FriendsList';

export default function FriendsHub() {
  const [tab, setTab] = useState('search');

  const tabs = [
    { id: 'search', label: 'Search' },
    { id: 'all-users', label: 'All Users' },
    { id: 'incoming', label: 'Incoming' },
    { id: 'outgoing', label: 'Outgoing' },
    { id: 'friends', label: 'Friends' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex space-x-2 border-b mb-4">
        {/* hello friends */}
        {tabs.map(t => (
          <button
            key={t.id}
            className={`px-4 py-2 ${tab === t.id ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'search' && <SearchUsers />}
      {tab === 'all-users' && <AllUsersPage />}
      {/* {tab === 'incoming' && <IncomingRequests />} */}
      {/* {tab === 'outgoing' && <OutgoingRequests />} */}
      {/* {tab === 'friends' && <FriendsList />} */}
    </div>
  );
}
