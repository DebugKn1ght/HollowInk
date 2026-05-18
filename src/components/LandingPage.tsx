import React from 'react';
import { Search, BookOpen, Users, Bell, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
  onViewCatalog: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onViewCatalog }) => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1>Advanced Library Management with HollowInk</h1>
            <p>Effortlessly track your catalog, manage member accounts, and handle book circulations with our modern library system.</p>
            <div className="flex" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              <button className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }} onClick={onStart}>
                Enter Library <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary" style={{ padding: '15px 30px', fontSize: '1.1rem' }} onClick={onViewCatalog}>
                View Catalog
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="features container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', margin: '4rem 0' }}>
          <div className="card feature-card">
            <Search size={40} color="var(--accent)" />
            <h3>Smart Search</h3>
            <p>Find books by title, author, subject, or publication date instantly.</p>
          </div>
          <div className="card feature-card">
            <BookOpen size={40} color="var(--accent)" />
            <h3>Circulation Tracking</h3>
            <p>Monitor check-outs, returns, and reservations in real-time.</p>
          </div>
          <div className="card feature-card">
            <Users size={40} color="var(--accent)" />
            <h3>Member Management</h3>
            <p>Easily register members, issue library cards, and track fine collections.</p>
          </div>
          <div className="card feature-card">
            <Bell size={40} color="var(--accent)" />
            <h3>Automated Alerts</h3>
            <p>Stay updated with overdue notifications and reservation status updates.</p>
          </div>
        </div>
      </section>

      <section className="about" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Built for Librarians and Readers</h2>
          <p style={{ maxWidth: '800px', margin: '1.5rem auto', opacity: 0.9 }}>
            HollowInk is designed to streamline library operations while providing a seamless experience for members. 
            From small community libraries to large academic institutions, we provide the tools you need to keep knowledge accessible.
          </p>
        </div>
      </section>

      <footer style={{ padding: '3rem 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <p>&copy; 2026 HollowInk Library Systems. All rights reserved.</p>
      </footer>

      <style>{`
        .hero {
          padding: 8rem 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          text-align: center;
        }
        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 1rem;
        }
        .hero p {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 700px;
          margin: 0 auto;
        }
        .feature-card {
          text-align: center;
          padding: 3rem 2rem;
          transition: transform 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-10px);
        }
        .feature-card h3 {
          margin: 1.5rem 0 1rem;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
