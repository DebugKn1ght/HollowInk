import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import BookForm from './components/BookForm';
import Catalog from './components/Catalog';
import { UserRole, BookStatus, AccountStatus } from './types';
import type { BookItem, User } from './types';
import { supabase } from './lib/supabase';
import bcrypt from 'bcryptjs';
import './index.css';

// Navigation wrapper to handle programmatic navigation
function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('hollowink_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [books, setBooks] = useState<BookItem[]>([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Handle Auth changes (including password recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Handle session if needed
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        localStorage.removeItem('hollowink_user');
      } else if (event === 'PASSWORD_RECOVERY') {
        // Show a UI to update the password
        navigate('/login?type=recovery');
      }
    });

    const loadBooks = async () => {
      try {
        const { data: booksData, error: booksError } = await supabase.from('books').select('*');
        if (booksError) throw booksError;

        const { data: lendingsData, error: lendingsError } = await supabase
          .from('lendings')
          .select('*')
          .is('returnDate', null);
        
        if (lendingsError) console.error('Error loading lendings:', lendingsError);

        const mockBooks: BookItem[] = [
          {
            isbn: '978-0141439518',
            title: 'Pride and Prejudice',
            subject: 'Classic Literature',
            authors: [{ name: 'Jane Austen', description: 'English novelist' }],
            publisher: 'Penguin Classics',
            language: 'English',
            pages: 432,
            barcode: 'B001',
            isReferenceOnly: false,
            price: 12.99,
            format: 'Hardcover',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('1813-01-28'),
            rack: { number: 'R-101', location: 'Floor 1, Section A' }
          },
          {
            isbn: '978-0143131847',
            title: 'Frankenstein',
            subject: 'Gothic Fiction',
            authors: [{ name: 'Mary Shelley', description: 'English novelist' }],
            publisher: 'Penguin Classics',
            language: 'English',
            pages: 288,
            barcode: 'B002',
            isReferenceOnly: false,
            price: 10.00,
            format: 'Paperback',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('1818-01-01'),
            rack: { number: 'R-102', location: 'Floor 1, Section B' }
          },
          {
            isbn: '978-0316029186',
            title: 'The Last Wish (The Witcher)',
            subject: 'Fantasy',
            authors: [{ name: 'Andrzej Sapkowski', description: 'Polish fantasy writer' }],
            publisher: 'Orbit',
            language: 'English',
            pages: 352,
            barcode: 'B003',
            isReferenceOnly: false,
            price: 15.99,
            format: 'Paperback',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('1993-01-01'),
            rack: { number: 'R-201', location: 'Floor 2, Section A' }
          },
          {
            isbn: '978-0544003415',
            title: 'The Lord of the Rings',
            subject: 'Fantasy',
            authors: [{ name: 'J.R.R. Tolkien', description: 'English writer' }],
            publisher: 'Mariner Books',
            language: 'English',
            pages: 1178,
            barcode: 'B004',
            isReferenceOnly: false,
            price: 35.00,
            format: 'Hardcover',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('1954-07-29'),
            rack: { number: 'R-202', location: 'Floor 2, Section A' }
          },
          {
            isbn: '978-0142437247',
            title: 'Moby Dick',
            subject: 'Adventure Fiction',
            authors: [{ name: 'Herman Melville', description: 'American novelist' }],
            publisher: 'Penguin Classics',
            language: 'English',
            pages: 720,
            barcode: 'B005',
            isReferenceOnly: false,
            price: 12.50,
            format: 'Paperback',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('1851-10-18'),
            rack: { number: 'R-103', location: 'Floor 1, Section C' }
          },
          {
            isbn: '978-0140449341',
            title: 'Journey to the West',
            subject: 'Mythology',
            authors: [{ name: 'Wu Cheng\'en', description: 'Chinese novelist' }],
            publisher: 'Penguin Classics',
            language: 'English',
            pages: 2400,
            barcode: 'B006',
            isReferenceOnly: true,
            price: 50.00,
            format: 'Hardcover',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('1592-01-01'),
            rack: { number: 'R-301', location: 'Floor 3, Section A' }
          },
          {
            isbn: '978-1590302255',
            title: 'The Art of War',
            subject: 'Military Strategy',
            authors: [{ name: 'Sun Tzu', description: 'Ancient Chinese strategist' }],
            publisher: 'Shambhala',
            language: 'English',
            pages: 272,
            barcode: 'B007',
            isReferenceOnly: false,
            price: 14.95,
            format: 'Paperback',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('0500-01-01'),
            rack: { number: 'R-302', location: 'Floor 3, Section B' }
          },
          {
            isbn: '978-0132350884',
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            subject: 'Computer Science',
            authors: [{ name: 'Robert C. Martin', description: 'American software engineer and author' }],
            publisher: 'Prentice Hall',
            language: 'English',
            pages: 464,
            barcode: 'CS001',
            isReferenceOnly: false,
            price: 44.99,
            format: 'Paperback',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('2008-08-11'),
            rack: { number: 'R-401', location: 'Floor 4, Section CS' }
          },
          {
            isbn: '978-0262033848',
            title: 'Introduction to Algorithms',
            subject: 'Computer Science',
            authors: [
              { name: 'Thomas H. Cormen', description: 'American computer scientist' },
              { name: 'Charles E. Leiserson', description: 'American computer scientist' }
            ],
            publisher: 'MIT Press',
            language: 'English',
            pages: 1312,
            barcode: 'CS002',
            isReferenceOnly: true,
            price: 95.00,
            format: 'Hardcover',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('2009-07-31'),
            rack: { number: 'R-401', location: 'Floor 4, Section CS' }
          },
          {
            isbn: '978-0131103627',
            title: 'The C Programming Language',
            subject: 'Computer Science',
            authors: [
              { name: 'Brian W. Kernighan', description: 'Canadian computer scientist' },
              { name: 'Dennis M. Ritchie', description: 'American computer scientist' }
            ],
            publisher: 'Prentice Hall',
            language: 'English',
            pages: 272,
            barcode: 'CS003',
            isReferenceOnly: false,
            price: 60.00,
            format: 'Paperback',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('1988-04-01'),
            rack: { number: 'R-402', location: 'Floor 4, Section CS' }
          },
          {
            isbn: '978-0596007126',
            title: 'Head First Design Patterns',
            subject: 'Computer Science',
            authors: [{ name: 'Eric Freeman', description: 'Computer scientist and author' }],
            publisher: 'O\'Reilly Media',
            language: 'English',
            pages: 694,
            barcode: 'CS004',
            isReferenceOnly: false,
            price: 54.99,
            format: 'Paperback',
            status: BookStatus.AVAILABLE,
            dateOfPurchase: new Date(),
            publicationDate: new Date('2004-10-25'),
            rack: { number: 'R-402', location: 'Floor 4, Section CS' }
          }
        ];

        let finalBooks: BookItem[] = [];

        if (booksData && booksData.length > 0) {
          // Merge existing books from Supabase with any missing mock books
          const supabaseBooks = (booksData as BookItem[]).map((book) => {
            const lending = lendingsData?.find(l => l.bookItemBarcode === book.barcode);
            if (lending) {
              return {
                ...book,
                status: BookStatus.LOANED,
                borrowedBy: lending.memberId,
                borrowed: lending.creationDate ? new Date(lending.creationDate) : undefined,
                dueDate: lending.dueDate ? new Date(lending.dueDate) : undefined
              };
            }
            return { 
              ...book, 
              status: book.status === BookStatus.LOANED ? BookStatus.AVAILABLE : book.status,
              borrowedBy: undefined,
              borrowed: undefined,
              dueDate: undefined
            };
          });

          // Filter mock books that aren't in Supabase yet
          const missingMockBooks = mockBooks.filter(mb => 
            !supabaseBooks.some(sb => sb.barcode === mb.barcode)
          );

          if (missingMockBooks.length > 0) {
            console.log(`Seeding ${missingMockBooks.length} new books to Supabase...`);
            await supabase.from('books').upsert(missingMockBooks);
            finalBooks = [...supabaseBooks, ...missingMockBooks];
          } else {
            finalBooks = supabaseBooks;
          }

          setBooks(finalBooks);
          localStorage.setItem('hollowink_books', JSON.stringify(finalBooks));
        } else {
          setBooks(mockBooks);
          localStorage.setItem('hollowink_books', JSON.stringify(mockBooks));
          // Attempt to seed Supabase with mock data if empty
          await supabase.from('books').upsert(mockBooks);
        }
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
        const savedBooks = localStorage.getItem('hollowink_books');
        if (savedBooks) setBooks(JSON.parse(savedBooks));
      }
    };

    const loadProfiles = async () => {
      console.log('Loading profiles...');
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) {
          console.error('Error fetching profiles:', error);
          throw error;
        }
        console.log('Profiles loaded:', data?.length);
        
        if (data && data.length === 0) {
          // Seed an initial Librarian account with a secure hashed password
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync('Admin@123', salt);
          
          const adminProfile = {
            id: 'admin-id-001',
            username: 'admin',
            password: hashedPassword, // Store hashed password
            name: 'HollowInk Admin',
            role: UserRole.LIBRARIAN,
            status: 'Active',
            email: 'admin@hollowink.com',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
          };
          await supabase.from('profiles').insert([adminProfile]);
        }
        
        if (data) {
          localStorage.setItem('hollowink_profiles', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error loading profiles from Supabase:', err);
      }
    };

    loadBooks();
    loadProfiles();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const saveBooks = async (newBooks: BookItem[]) => {
    setBooks(newBooks);
    localStorage.setItem('hollowink_books', JSON.stringify(newBooks));
    
    try {
      const { error } = await supabase.from('books').upsert(newBooks);
      if (error) throw error;
    } catch (err) {
      console.error('Error saving books to Supabase:', err);
      showToast('Failed to sync data with database.', 'error');
    }
  };

  const handleLogin = async (loginData: Pick<User, 'username' | 'password'>) => {
    setLoginError(null);
    const loginPassword = loginData.password || '';
    try {
      // Use Supabase Auth for login
      const authEmail = loginData.username.includes('@') ? loginData.username : `${loginData.username}@placeholder.com`;
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: loginPassword,
      });

      if (authError) {
        // Fallback for older accounts or if username is used instead of email
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', loginData.username)
          .single();
        
        if (profileError || !profileData) {
          setLoginError('Invalid username or password.');
          return;
        }

        const storedHash = profileData.password;
        if (!storedHash) {
          setLoginError('Invalid username or password.');
          return;
        }

        const isPasswordCorrect = await bcrypt.compare(loginPassword, storedHash);
        if (!isPasswordCorrect) {
          setLoginError('Invalid username or password.');
          return;
        }

        const userToSet: User = {
          id: profileData.id,
          username: profileData.username,
          name: profileData.name,
          email: profileData.email || '',
          avatarUrl: profileData.avatar_url,
          role: profileData.role,
          department: profileData.department,
          schoolId: profileData.school_id,
          status: profileData.status || AccountStatus.ACTIVE
        };

        setCurrentUser(userToSet);
        localStorage.setItem('hollowink_user', JSON.stringify(userToSet));
        navigate('/dashboard');
        showToast(`Welcome back, ${userToSet.name}!`);
        return;
      }

      // If Auth succeeded, get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const userToSet: User = {
        id: authData.user.id,
        username: profileData?.username || authData.user.email?.split('@')[0] || 'User',
        name: profileData?.name || authData.user.email?.split('@')[0] || 'User',
        email: authData.user.email || '',
        avatarUrl: profileData?.avatar_url,
        role: profileData?.role || UserRole.MEMBER,
        department: profileData?.department,
        schoolId: profileData?.school_id,
        status: profileData?.status || AccountStatus.ACTIVE
      };

      setCurrentUser(userToSet);
      localStorage.setItem('hollowink_user', JSON.stringify(userToSet));
      
      navigate('/dashboard');
      showToast(`Welcome back, ${userToSet.name}!`);
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('An unexpected error occurred. Please try again.');
    }
  };

  const handleSignup = async (user: User): Promise<boolean> => {
    setLoginError(null);
    console.log('Attempting signup for:', user.username, user);
    try {
      // 1. Sign up with Supabase Auth (handles email verification)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email || '',
        password: user.password || '', // Original password (not hashed yet for Auth)
        options: {
          data: {
            name: user.name,
            username: user.username,
            role: user.role,
            avatar_url: user.avatarUrl
          }
        }
      });

      if (authError) {
        console.error('Supabase Auth signup error:', authError);
        showToast(`Failed to create account: ${authError.message}`, 'error');
        return false;
      }

      if (authData.user) {
        // 2. Also create a profile in our profiles table
        // We hash the password for our custom table as well for backward compatibility
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password || '', salt);

        const profileData = {
        id: authData.user.id, // Use the ID from Auth
        username: user.username,
        password: hashedPassword,
        name: user.name,
        role: user.role,
        email: user.email,
        avatar_url: user.avatarUrl,
        department: user.department,
        school_id: user.schoolId,
        status: 'Active'
      };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);
        
        if (profileError) {
          console.error('Supabase profile creation error:', profileError);
          // Don't return false here as Auth succeeded, but warn user
        }
      }
      
      showToast('Verification email sent! Please check your inbox.');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Signup exception:', err);
      showToast(`An unexpected error occurred: ${message}`, 'error');
      return false;
    }
  };

  const handleForgotPassword = async (email: string): Promise<boolean> => {
    console.log('Requesting password reset for:', email);
    try {
      // Use the current origin, but ensure it's not localhost if we're on production
      const baseUrl = window.location.origin.includes('localhost') 
        ? 'https://hollow-ink-94sx.vercel.app' 
        : window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/login?type=recovery`,
      });

      if (error) {
        console.error('Password reset error:', error);
        // Supabase often returns a generic success even if user doesn't exist for security
        // but if it does return an error, we show it
        showToast(`Reset failed: ${error.message}`, 'error');
        return false;
      }

      showToast('If an account exists for this email, a reset link has been sent!');
      return true;
    } catch (err: unknown) {
      console.error('Forgot password exception:', err);
      showToast('An unexpected error occurred.', 'error');
      return false;
    }
  };

  const handleResetPassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Reset password error:', error);
        showToast(`Error: ${error.message}`, 'error');
        return false;
      }

      // Also update the hashed password in our custom profiles table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await supabase.from('profiles').update({ password: hashedPassword }).eq('id', user.id);
      }

      showToast('Password updated successfully! You can now login.');
      return true;
    } catch (err: unknown) {
      console.error('Reset password exception:', err);
      showToast('An unexpected error occurred.', 'error');
      return false;
    }
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('hollowink_user', JSON.stringify(updatedUser));
    try {
      const { error } = await supabase.from('profiles').upsert({ 
        id: updatedUser.id, 
        username: updatedUser.username, 
        name: updatedUser.name, 
        role: updatedUser.role, 
        email: updatedUser.email, 
        avatar_url: updatedUser.avatarUrl,
        department: updatedUser.department,
        school_id: updatedUser.schoolId
      });
      if (error) throw error;
      showToast('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to sync profile update.', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hollowink_user');
    navigate('/');
    showToast('Logged out successfully.');
  };

  const handleCheckOut = async (barcode: string) => {
    if (!currentUser) return;
    const memberLendings = books.filter(b => b.status === BookStatus.LOANED && b.borrowedBy === currentUser.id).length;
    if (memberLendings >= 5) {
      showToast('Lending limit reached (max 5 books).', 'error');
      return;
    }
    const creationDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    const lendingId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    try {
      const { error } = await supabase.from('lendings').insert({ id: lendingId, creationDate: creationDate.toISOString(), dueDate: dueDate.toISOString(), bookItemBarcode: barcode, memberId: currentUser.id });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      showToast('Failed to record lending in database.', 'error');
      return;
    }

    const newBooks = books.map(b => b.barcode === barcode ? { ...b, status: BookStatus.LOANED, borrowed: creationDate, dueDate: dueDate, borrowedBy: currentUser.id } : b);
    setBooks(newBooks);
    localStorage.setItem('hollowink_books', JSON.stringify(newBooks));
    showToast(`Book checked out. Due date: ${dueDate.toLocaleDateString()}`);
  };

  const handleReturn = async (barcode: string) => {
    const book = books.find(b => b.barcode === barcode);
    let fineMsg = '';
    if (book?.dueDate && new Date() > new Date(book.dueDate)) {
      const diffTime = Math.abs(new Date().getTime() - new Date(book.dueDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineMsg = `. Overdue fine: $${diffDays * 1.00}`;
    }
    const returnDate = new Date();
    try {
      const { error } = await supabase.from('lendings').update({ returnDate: returnDate.toISOString() }).eq('bookItemBarcode', barcode).is('returnDate', null);
      if (error) throw error;
    } catch (err) { console.error(err); showToast('Failed to update database record.', 'error'); }

    const newBooks = books.map(b => b.barcode === barcode ? { ...b, status: BookStatus.AVAILABLE, borrowed: undefined, dueDate: undefined, borrowedBy: undefined } : b);
    setBooks(newBooks);
    localStorage.setItem('hollowink_books', JSON.stringify(newBooks));
    
    // We don't need manual reload here as state is already updated
    // and Supabase is updated in the try block
    
    try {
      await supabase.from('books').update({ status: BookStatus.AVAILABLE, borrowedBy: null, dueDate: null, borrowed: null }).eq('barcode', barcode);
    } catch (err) { console.error(err); }

    showToast(`Book returned${fineMsg}`);
  };

  const handleReserve = (barcode: string) => {
    if (!currentUser) return;
    const newBooks = books.map(b => b.barcode === barcode ? { ...b, status: BookStatus.RESERVED, reservedBy: currentUser.id } : b);
    saveBooks(newBooks);
    showToast('Book reserved for you.');
  };

  return (
    <div className="app">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <main>
        <Routes>
          <Route path="/" element={<LandingPage onStart={() => navigate('/login')} onViewCatalog={() => navigate('/catalog')} />} />
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} onSignup={handleSignup} onForgotPassword={handleForgotPassword} onResetPassword={handleResetPassword} loginError={loginError} clearLoginError={() => setLoginError(null)} />} />
          <Route path="/catalog" element={
            <div className="container" style={{ padding: '2rem 0' }}>
              <header style={{ marginBottom: '2rem' }}>
                <h2>Library Catalog</h2>
                <p style={{ color: 'var(--text-muted)' }}>Search and browse our collection of books</p>
              </header>
              <Catalog books={books} userRole={currentUser?.role} onCheckOut={handleCheckOut} onReserve={handleReserve} />
            </div>
          } />
          <Route path="/dashboard" element={
            currentUser ? (
              <Dashboard 
                user={currentUser} books={books}
                onAddBook={() => { setEditingBook(undefined); setShowBookForm(true); }}
                onEditBook={(book) => { setEditingBook(book); setShowBookForm(true); }}
                onDeleteBook={(barcode) => {
                  if (window.confirm('Delete this book?')) {
                    const newBooks = books.filter(b => b.barcode !== barcode);
                    saveBooks(newBooks);
                    showToast('Book deleted.', 'error');
                  }
                }}
                onCheckOut={handleCheckOut} onReturn={handleReturn}
                onRenew={(barcode) => {
                  const newBooks = books.map(b => {
                    if (b.barcode === barcode && b.dueDate) {
                      const newDueDate = new Date(b.dueDate);
                      newDueDate.setDate(newDueDate.getDate() + 7);
                      return { ...b, dueDate: newDueDate };
                    }
                    return b;
                  });
                  saveBooks(newBooks);
                  showToast('Book renewed.');
                }}
                onReserve={handleReserve} onUpdateProfile={handleUpdateProfile}
              />
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </main>

      {showBookForm && (
        <BookForm 
          book={editingBook}
          onSave={(book) => {
            if (editingBook) {
              const newBooks = books.map(b => b.barcode === book.barcode ? book : b);
              saveBooks(newBooks);
              showToast('Book updated.');
            } else {
              const newBooks = [...books, book];
              saveBooks(newBooks);
              showToast('Book added.');
            }
            setShowBookForm(false);
          }}
          onCancel={() => setShowBookForm(false)}
        />
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
