import React from "react";

export default function OnlineUsers({ onlineUsers, friends }) {
  return (
    <div>
      <h2 className="p-2 font-semibold">Online</h2>
      {friends
        .filter(f => onlineUsers.includes(f._id))
        .map(f => (
          <div key={f._id} className="p-2 text-green-600">
            {f.name} ●
          </div>
        ))}
    </div>
  );
}
