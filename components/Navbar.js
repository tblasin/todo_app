import React from 'react';
import Link from 'next/link';
import './Navbar.css';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">TODO App</h1>
        <div className="navbar-links">
          <Link href="/admin" className="admin-button">Admin</Link>
        </div>
      </div>
    </nav>
  );
}