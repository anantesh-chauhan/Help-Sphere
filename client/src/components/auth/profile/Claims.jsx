import React from 'react';

const Claims = () => {
  const claims = [
    { id: 1, date: '2025-06-01', status: 'Approved' },
    { id: 2, date: '2025-06-10', status: 'Pending' },
  ];

  return (
    <div>
      <h3>Your Claims</h3>
      <ul>
        {claims.map(claim => (
          <li key={claim.id}>
            <strong>Date:</strong> {claim.date} — <strong>Status:</strong> {claim.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Claims;
