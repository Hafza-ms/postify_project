import React from 'react'
import logo from '../assets/postify_standard_logo.jpg'

function Footer() {
  return (
    <div style={{ backgroundColor: '#1c1e21', width: '100%' }}>
        <footer
     style={{
        backgroundColor: '#1c1e21',
        color: '#ccc',
        padding: '2rem 1rem',
        margin: '0 auto',
        textAlign: 'center',
        maxWidth:'1000px'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <img
          src={logo}
          alt="Postify Logo"
           style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            marginBottom: '0.8rem',
            border: '2px solid #555',
          }}
        />
        <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Postify</h4>
        <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: '#bbb' }}>
          Where your thoughts <span style={{ color: '#0d6efd' }}>find their voice.</span>
        </p>

        <hr style={{ borderColor: '#333', margin: '1.5rem 0' }} />

        <p style={{ fontSize: '0.85rem', color: '#888' }}>
          &copy; {new Date().getFullYear()} Postify. All rights reserved.
        </p>
      </div>
    </footer>
    </div>
  )
}

export default Footer
