import React, { useState, useRef } from 'react';
import { LogIn, UserPlus, Upload, X } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      name: isLogin ? (username === 'admin' ? 'System Admin' : username) : name,
      role: isLogin ? (username === 'admin' ? UserRole.LIBRARIAN : UserRole.MEMBER) : UserRole.MEMBER,
      email,
      avatarUrl: avatarBase64 || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };
    onLogin(user);
  };

  return (
    <div className="login-page flex" style={{ minHeight: 'calc(100vh - 70px)', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{isLogin ? 'Login to your library profile' : 'Join the HollowInk community'}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid" style={{ gap: '1.2rem' }}>
          {!isLogin && (
            <>
              <div className="flex" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                <div 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f0f0f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    border: '2px dashed #ccc',
                    position: 'relative'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarBase64 ? (
                    <img src={avatarBase64} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="grid" style={{ textAlign: 'center', color: '#888' }}>
                      <Upload size={24} style={{ margin: '0 auto' }} />
                      <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>Upload Photo</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>

              <div className="grid" style={{ gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter full name" />
              </div>
              <div className="grid" style={{ gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" />
              </div>
            </>
          )}
          
          <div className="grid" style={{ gap: '0.4rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter username" />
          </div>

          <div className="grid" style={{ gap: '0.4rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '1rem' }}>
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <strong>Tip:</strong> Use <code>admin</code> / <code>any password</code> for Librarian access.
          </p>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setAvatarBase64('');
              }} 
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, padding: 0 }}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
