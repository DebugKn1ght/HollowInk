import React, { useState, useRef } from 'react';
import { UserRole, BookStatus } from '../types';
import type { BookItem, User } from '../types';
import { Plus, Edit, Trash2, RefreshCcw, RotateCcw, BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Catalog from './Catalog';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: User;
  books: BookItem[];
  profiles?: User[]; // Add profiles to props
  onAddBook: () => void;
  onEditBook: (book: BookItem) => void;
  onDeleteBook: (barcode: string) => void;
  onCheckOut: (barcode: string) => void;
  onReturn: (barcode: string) => void;
  onRenew: (barcode: string) => void;
  onReserve: (barcode: string) => void;
  onUpdateProfile: (updatedUser: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, books, onAddBook, onEditBook, onDeleteBook, onCheckOut, onReturn, onRenew, onReserve, onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loanTab, setLoanTab] = useState<'active' | 'backlog'>('active');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({
    department: user.department || '',
    schoolId: user.schoolId || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ubDepartments = [
    'College of Engineering, Technology, Architecture, and Fine Arts (CETAFA)',
    'College of Arts, Sciences, and Education (CASE)',
    'College of Business and Accountancy (CBA)',
    'College of Criminal Justice (CCJ)',
    'College of Hospitality Management, Tourism, and Nutrition (CHMTN)',
    'College of Allied Health Sciences (CAHS)',
    'College of Physical Therapy and Occupational Therapy (CPTOT)',
    'College of Pharmacy (COP)',
    'College of Law (COL)',
    'Graduate School (GS)'
  ];

  const handleProfileUpdate = () => {
    onUpdateProfile({
      ...user,
      department: editData.department,
      schoolId: editData.schoolId
    });
    setIsEditingProfile(false);
  };

  const [loanHistory, setLoanHistory] = useState<any[]>([]);

  const fetchLoanHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('lendings')
        .select(`
          *,
          profiles (name, username),
          books (title)
        `)
        .order('creationDate', { ascending: false });
      
      if (error) throw error;
      setLoanHistory(data || []);
    } catch (err) {
      console.error('Error fetching loan history:', err);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'overview' && user.role === UserRole.LIBRARIAN) {
      fetchLoanHistory();
    }
  }, [activeTab, user.role]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...user, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfileTab = () => (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <div className="flex" style={{ flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <div 
          style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '4px solid var(--accent)',
            margin: '0 auto',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            width: '100%', 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            color: 'white', 
            fontSize: '0.7rem',
            padding: '4px 0'
          }}>
            Change
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />
        
        <div className="grid" style={{ gap: '0.5rem', textAlign: 'left' }}>
          <label style={{ fontWeight: 600 }}>Name</label>
          <input type="text" value={user.name} disabled style={{ backgroundColor: '#f5f5f5' }} />
          
          <label style={{ fontWeight: 600, marginTop: '1rem' }}>School ID</label>
          <input 
            type="text" 
            value={isEditingProfile ? editData.schoolId : user.schoolId || 'Not Set'} 
            disabled={!isEditingProfile} 
            onChange={(e) => setEditData({...editData, schoolId: e.target.value})}
            style={{ backgroundColor: isEditingProfile ? 'white' : '#f5f5f5' }} 
          />

          <label style={{ fontWeight: 600, marginTop: '1rem' }}>College Department</label>
          {isEditingProfile ? (
            <select 
              value={editData.department} 
              onChange={(e) => setEditData({...editData, department: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
            >
              <option value="">Select Department</option>
              {ubDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          ) : (
            <input type="text" value={user.department || 'Not Set'} disabled style={{ backgroundColor: '#f5f5f5' }} />
          )}

          <label style={{ fontWeight: 600, marginTop: '1rem' }}>Username</label>
          <input type="text" value={user.username} disabled style={{ backgroundColor: '#f5f5f5' }} />
          
          <label style={{ fontWeight: 600, marginTop: '1rem' }}>Email</label>
          <input type="text" value={user.email} disabled style={{ backgroundColor: '#f5f5f5' }} />
          
          <label style={{ fontWeight: 600, marginTop: '1rem' }}>Role</label>
          <div className="badge" style={{ alignSelf: 'flex-start', backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}>
            {user.role}
          </div>

          <div style={{ marginTop: '2rem' }}>
            {isEditingProfile ? (
              <div className="flex" style={{ gap: '1rem' }}>
                <button className="btn btn-primary" onClick={handleProfileUpdate} style={{ flex: 1 }}>Save Changes</button>
                <button className="btn btn-secondary" onClick={() => setIsEditingProfile(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsEditingProfile(true)} style={{ width: '100%' }}>Edit Profile Details</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLibrarianDashboard = () => (
    <div className="dashboard-content">
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div className="flex" style={{ gap: '1rem' }}>
          <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('inventory')}>
            Inventory
          </button>
          <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('profile')}>
            Profile
          </button>
        </div>
        {activeTab === 'inventory' && (
          <button className="btn btn-primary" onClick={onAddBook}>
            <Plus size={18} /> Add New Book
          </button>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="grid" style={{ gap: '2rem' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <h4>Total Catalog</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>{books.length}</p>
            </div>
            <div className="card">
              <h4>Books Loaned</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
                {books.filter(b => b.status === BookStatus.LOANED).length}
              </p>
            </div>
            <div className="card">
              <h4>Reserved</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-light)' }}>
                {books.filter(b => b.status === BookStatus.RESERVED).length}
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Loan Management</h3>
              <div className="flex" style={{ gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.3rem', borderRadius: '8px' }}>
                <button 
                  className={`btn ${loanTab === 'active' ? 'btn-primary' : ''}`} 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: loanTab === 'active' ? '' : 'transparent', color: loanTab === 'active' ? '' : '#64748b', boxShadow: loanTab === 'active' ? '' : 'none' }}
                  onClick={() => setLoanTab('active')}
                >
                  Active Loans
                </button>
                <button 
                  className={`btn ${loanTab === 'backlog' ? 'btn-primary' : ''}`} 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: loanTab === 'backlog' ? '' : 'transparent', color: loanTab === 'backlog' ? '' : '#64748b', boxShadow: loanTab === 'backlog' ? '' : 'none' }}
                  onClick={() => setLoanTab('backlog')}
                >
                  History Backlog
                </button>
              </div>
            </div>

            {loanTab === 'active' ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Borrower</th>
                      <th style={{ padding: '12px' }}>Book</th>
                      <th style={{ padding: '12px' }}>Due Date</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanHistory.filter(l => !l.returnDate).length > 0 ? (
                      loanHistory.filter(l => !l.returnDate).map(loan => {
                        const isOverdue = new Date() > new Date(loan.dueDate);
                        return (
                          <tr key={loan.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: 600 }}>{loan.profiles?.name || 'Unknown'}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>@{loan.profiles?.username}</div>
                            </td>
                            <td style={{ padding: '12px' }}>{loan.books?.title}</td>
                            <td style={{ padding: '12px' }}>{new Date(loan.dueDate).toLocaleDateString()}</td>
                            <td style={{ padding: '12px' }}>
                              {isOverdue ? (
                                <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                                  <AlertTriangle size={12} /> Overdue
                                </span>
                              ) : (
                                <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                                  <Clock size={12} /> Due Soon
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                onClick={() => onReturn(loan.bookItemBarcode)}
                              >
                                Record Return
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No active loans found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Borrower</th>
                      <th style={{ padding: '12px' }}>Book</th>
                      <th style={{ padding: '12px' }}>Returned On</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanHistory.filter(l => l.returnDate).length > 0 ? (
                      loanHistory.filter(l => l.returnDate).map(loan => (
                        <tr key={loan.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px' }}>{loan.profiles?.name}</td>
                          <td style={{ padding: '12px' }}>{loan.books?.title}</td>
                          <td style={{ padding: '12px' }}>{new Date(loan.returnDate).toLocaleDateString()}</td>
                          <td style={{ padding: '12px' }}>
                            <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                              <CheckCircle size={12} /> Returned
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No return records in backlog.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left' }}>Book</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Barcode</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.barcode} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600 }}>{book.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{book.authors[0].name}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{book.barcode}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge badge-${book.status.toLowerCase()}`}>{book.status}</span>
                    {book.status === BookStatus.LOANED && book.dueDate && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--danger)', marginTop: '4px' }}>
                        Due: {new Date(book.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>{book.rack.number}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div className="flex" style={{ justifyContent: 'center' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={() => onEditBook(book)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '6px', color: 'var(--danger)' }} onClick={() => onDeleteBook(book.barcode)}>
                        <Trash2 size={16} />
                      </button>
                      {book.status === BookStatus.LOANED && (
                        <button className="btn btn-primary" style={{ padding: '6px' }} onClick={() => onReturn(book.barcode)} title="Return Book">
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'profile' && renderProfileTab()}
    </div>
  );

  const renderMemberDashboard = () => {
    const myBorrowedBooks = books.filter(b => b.status === BookStatus.LOANED && b.borrowedBy === user.id);
    const myReservations = books.filter(b => b.status === BookStatus.RESERVED && b.reservedBy === user.id);

    return (
      <div className="dashboard-content">
        <div className="flex" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
          <button className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('catalog')}>
            Browse Catalog
          </button>
          <button className={`btn ${activeTab === 'my-books' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('my-books')}>
            My Borrowed Books ({myBorrowedBooks.length})
          </button>
          <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('profile')}>
            Profile
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="card">
              <h4>Checked Out</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>{myBorrowedBooks.length}</p>
            </div>
            <div className="card">
              <h4>Reservations</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>{myReservations.length}</p>
            </div>
            <div className="card">
              <h4>Fines Due</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>$0.00</p>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <Catalog 
            books={books} 
            userRole={UserRole.MEMBER} 
            onCheckOut={onCheckOut} 
            onReserve={onReserve} 
          />
        )}

        {activeTab === 'my-books' && (
          <div className="my-books-container">
            {myBorrowedBooks.length > 0 ? (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {myBorrowedBooks.map(book => (
                  <div key={book.barcode} className="card flex" style={{ gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '80px', height: '120px', flexShrink: 0, backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="flex" style={{ height: '100%', justifyContent: 'center', color: '#ccc', fontSize: '0.6rem' }}>No Cover</div>
                      )}
                    </div>
                    <div className="grid" style={{ gap: '0.5rem', flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', lineHeight: '1.2' }}>{book.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Due: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
                      </p>
                      <div className="flex" style={{ marginTop: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onReturn(book.barcode)}>
                          <RotateCcw size={14} /> Return
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onRenew(book.barcode)}>
                          <RefreshCcw size={14} /> Renew
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)' }}>You don't have any borrowed books at the moment.</p>
                <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setActiveTab('catalog')}>
                  Go to Catalog
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && renderProfileTab()}
      </div>
    );
  };

  return (
    <div className="dashboard container" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>{user.role} Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your library activity and profile</p>
      </header>

      {user.role === UserRole.LIBRARIAN ? renderLibrarianDashboard() : renderMemberDashboard()}

      <style>{`
        th { font-weight: 700; color: var(--primary); }
        td { color: var(--text); }
        tr:hover { background-color: #f8f9fa; }
      `}</style>
    </div>
  );
};

export default Dashboard;
