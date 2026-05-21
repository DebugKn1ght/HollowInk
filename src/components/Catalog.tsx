import React, { useState } from 'react';
import { BookStatus, UserRole } from '../types';
import type { BookItem } from '../types';
import { Search, Filter, BookOpen, Clock, AlertCircle, ArrowUpDown } from 'lucide-react';

interface CatalogProps {
  books: BookItem[];
  userRole?: UserRole;
  onCheckOut?: (barcode: string) => void;
  onReserve?: (barcode: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ books, userRole, onCheckOut, onReserve }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [sortBy, setSortBy] = useState('A-Z');

  const subjects = ['All', ...new Set(books.map(b => b.subject))];

  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        book.isbn.includes(searchTerm);
      
      const matchesSubject = filterSubject === 'All' || book.subject === filterSubject;
      
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'A-Z':
          return a.title.localeCompare(b.title);
        case 'Z-A':
          return b.title.localeCompare(a.title);
        case 'Newest':
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        case 'Oldest':
          return new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime();
        case 'Newly Added':
          return new Date(b.dateOfPurchase).getTime() - new Date(a.dateOfPurchase).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="catalog">
      <div className="card flex" style={{ marginBottom: '2rem', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="flex" style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by title, author, or ISBN..." 
            style={{ paddingLeft: '40px', width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex" style={{ gap: '0.8rem' }}>
          <Filter size={20} color="var(--text-muted)" />
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex" style={{ gap: '0.8rem' }}>
          <ArrowUpDown size={20} color="var(--text-muted)" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="A-Z">Title (A-Z)</option>
            <option value="Z-A">Title (Z-A)</option>
            <option value="Newest">Publication (Newest)</option>
            <option value="Oldest">Publication (Oldest)</option>
            <option value="Newly Added">Newly Added</option>
          </select>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
        {filteredAndSortedBooks.length > 0 ? filteredAndSortedBooks.map(book => (
          <div key={book.barcode} className="card book-card flex" style={{ flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '140%', backgroundColor: '#f5f5f5' }}>
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                  No Cover
                </div>
              )}
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <span className={`badge badge-${book.status.toLowerCase()}`}>{book.status}</span>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="flex" style={{ justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{book.barcode}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{book.subject}</span>
              </div>
              
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', lineHeight: '1.3' }}>{book.title}</h3>
              <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem' }}>
                {book.authors.map(a => a.name).join(', ')}
              </p>
              
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <strong>Location:</strong> {book.rack.number}
                </div>
                
                <div className="flex" style={{ width: '100%', gap: '0.8rem' }}>
                  {userRole === UserRole.MEMBER && (
                    <>
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, justifyContent: 'center', padding: '8px' }}
                        disabled={book.status !== BookStatus.AVAILABLE || book.isReferenceOnly}
                        onClick={() => onCheckOut?.(book.barcode)}
                      >
                        <BookOpen size={16} /> Check Out
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, justifyContent: 'center', padding: '8px' }}
                        disabled={book.status !== BookStatus.LOANED}
                        onClick={() => onReserve?.(book.barcode)}
                      >
                        <Clock size={16} /> Reserve
                      </button>
                    </>
                  )}
                  {book.isReferenceOnly && (
                    <p className="flex" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}>
                      <AlertCircle size={14} /> Reference Only
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No books found matching your criteria.</p>
          </div>
        )}
      </div>

      <style>{`
        .book-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Catalog;
