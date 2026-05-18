import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, User, LogOut, Search, Library } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentUser: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container flex" style={{ justifyContent: 'space-between', height: '70px' }}>
        <Link to="/" className="logo flex" style={{ fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none', color: 'inherit' }}>
          <Library size={32} color="var(--accent)" />
          <span>HollowInk</span>
        </Link>

        <nav className="flex" style={{ gap: '2rem' }}>
          <Link to="/" style={{ fontWeight: 600, textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <Link to="/catalog" style={{ fontWeight: 600, textDecoration: 'none', color: 'inherit' }}>Catalog</Link>
          {currentUser && (
            <Link to="/dashboard" style={{ fontWeight: 600, textDecoration: 'none', color: 'inherit' }}>Dashboard</Link>
          )}
        </nav>

        <div className="flex">
          {currentUser ? (
            <div className="flex" style={{ gap: '1.5rem' }}>
              <div className="flex" style={{ gap: '0.8rem', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent)' }}>
                  <img src={currentUser.avatarUrl} alt={currentUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="flex" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: '1' }}>{currentUser.name}</span>
                  <span className="badge" style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={onLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
      </div>
      <style>{`
        .navbar {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar nav a:hover {
          color: var(--accent);
        }
      `}</style>
    </header>
  );
};

export default Navbar;
