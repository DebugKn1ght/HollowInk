import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Users, Bell, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageProps {
  onStart: () => void;
  onViewCatalog: () => void;
}

const libraryImages = [
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1440778303588-435521a205bc?auto=format&fit=crop&q=80&w=1200'
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onViewCatalog }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % libraryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="hero-image"
              style={{ backgroundImage: `url(${libraryImages[currentImageIndex]})` }}
            />
          </AnimatePresence>
          <div className="hero-overlay" />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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
          position: relative;
          padding: 10rem 0;
          overflow: hidden;
          text-align: center;
          min-height: 80vh;
          display: flex;
          align-items: center;
        }
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(195, 207, 226, 0.8) 100%);
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
