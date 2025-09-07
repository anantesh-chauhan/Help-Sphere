import React from 'react'

const YogaHealix = () => {
  return (
    <div>
     {/* YogaHealix Promo Section */}
      <div
        style={{
          maxWidth: '900px',
          margin: '60px auto',
          padding: '40px',
          borderRadius: '24px',
          background: '#ffffff',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        }}
      >
        <h2
          style={{
            color: '#205072',
            marginBottom: '15px',
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          🧘 Discover <span style={{ color: '#2b7a78' }}>YogaHealix</span> – 
          Our Platform for Wellness & Inner Peace
        </h2>

        <p
          style={{
            color: '#555',
            fontSize: '16px',
            lineHeight: '1.7',
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          <b>YogaHealix</b> is part of the <b>HelpSphere family</b>, created with one vision – 
          <span style={{ color: '#2b7a78' }}> building a healthier, happier, and balanced community</span>.  
          While HelpSphere connects and supports people through services,  
          YogaHealix focuses on <b>mental peace, yoga, and holistic wellness</b>. 🌿
        </p>

        {/* Features Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          {[
            {
              title: '🎶 Music Player',
              desc: 'Calming music to create the perfect environment for yoga & meditation.',
            },
            {
              title: '🧘 Meditation Corner',
              desc: 'A dedicated space to practice mindfulness and guided meditation.',
            },
            {
              title: '🔥 Daily Streaks',
              desc: 'Stay consistent with gamified streaks and daily yoga challenges.',
            },
            {
              title: '🏋️ Asanas by Need',
              desc: 'Choose asanas based on body part or health condition.',
            },
            {
              title: '👩‍🏫 Instructor-led Sessions',
              desc: 'Live and recorded sessions from certified yoga instructors.',
            },
            {
              title: '📢 Admin Notifications',
              desc: 'Stay updated with community-wide announcements & wellness tips.',
            },
            {
              title: '🌟 Become an Instructor',
              desc: 'Users can apply to become certified instructors within the platform.',
            },
            {
              title: '📧 Email Verification',
              desc: 'Secure onboarding with verified email-based user accounts.',
            },
            {
              title: '🔑 Role-based Login',
              desc: 'Separate access for users and instructors for a seamless experience.',
            },
            {
              title: '👤 Profile Management',
              desc: 'Update password, edit details, and manage your personal profile.',
            },
            {
              title: '💬 Reviews & Feedback',
              desc: 'Share your experiences and help others discover better sessions.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: '#f9f9f9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  color: '#205072',
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a
            href="https://yogahealix.com" // Replace with your real YogaHealix link
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#2b7a78',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '16px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#205072')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#2b7a78')}
          >
            Explore YogaHealix 🌿
          </a>
        </div>

        </div>
      </div>
  )
}

export default YogaHealix
