import React from 'react';

const Achievements = () => {
  const badges = [
    { id: 1, label: 'Top Donor', description: 'Donated more than 10 times' },
    { id: 2, label: 'Reviewer Pro', description: 'Wrote 100+ reviews' },
    { id: 3, label: 'Verified Helper', description: 'Verified by NGO team' },
  ];

  return (
    <div>
      <h3>Your Achievements</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {badges.map((badge) => (
          <div key={badge.id} style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px', minWidth: '120px' }}>
            <strong>{badge.label}</strong>
            <p style={{ fontSize: '12px', color: '#666' }}>{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
