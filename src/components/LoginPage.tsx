import React, { useState, useRef } from 'react';
import { LogIn, UserPlus, Upload, Check, AlertCircle } from 'lucide-react';
import { UserRole, AccountStatus } from '../types';
import type { User } from '../types';
import bcrypt from 'bcryptjs';

interface LoginPageProps {
  onLogin: (credentials: Pick<User, 'username' | 'password'>) => void;
  onSignup: (user: User) => Promise<boolean>;
  loginError: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignup, loginError }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived password validation requirements
  const passRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

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

  const isPasswordValid = Object.values(passRequirements).every(req => req);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!isLogin && !isPasswordValid) {
      setLocalError('Please meet all password requirements.');
      return;
    }

    if (isLogin) {
      onLogin({ username, password });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        password: hashedPassword, // Store hashed password
        name,
        role: UserRole.MEMBER,
        status: AccountStatus.ACTIVE,
        email,
        avatarUrl: avatarBase64 || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };
      
      const success = await onSignup(user);
      if (success) {
        setIsLogin(true);
        setPassword('');
      }
    }
  };

  return (
    <div className="login-page flex" style={{ minHeight: 'calc(100vh - 70px)', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '2rem 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{isLogin ? 'Login to your library profile' : 'Join the HollowInk community'}</p>
        </div>

        {(localError || loginError) && (
          <div className="flex" style={{ backgroundColor: '#fff5f5', color: 'var(--danger)', padding: '0.8rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #feb2b2' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ marginLeft: '8px' }}>{localError || loginError}</span>
          </div>
        )}

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
            
            {!isLogin && (
              <div className="grid" style={{ gap: '0.3rem', marginTop: '0.5rem', backgroundColor: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem', color: '#64748b' }}>Password Requirements:</p>
                <div className="flex" style={{ fontSize: '0.75rem', color: passRequirements.length ? '#10b981' : '#94a3b8' }}>
                  {passRequirements.length ? <Check size={12} /> : <div style={{ width: 12 }} />} 
                  <span style={{ marginLeft: '4px' }}>At least 8 characters</span>
                </div>
                <div className="flex" style={{ fontSize: '0.75rem', color: passRequirements.uppercase ? '#10b981' : '#94a3b8' }}>
                  {passRequirements.uppercase ? <Check size={12} /> : <div style={{ width: 12 }} />} 
                  <span style={{ marginLeft: '4px' }}>One uppercase letter</span>
                </div>
                <div className="flex" style={{ fontSize: '0.75rem', color: passRequirements.number ? '#10b981' : '#94a3b8' }}>
                  {passRequirements.number ? <Check size={12} /> : <div style={{ width: 12 }} />} 
                  <span style={{ marginLeft: '4px' }}>One number</span>
                </div>
                <div className="flex" style={{ fontSize: '0.75rem', color: passRequirements.special ? '#10b981' : '#94a3b8' }}>
                  {passRequirements.special ? <Check size={12} /> : <div style={{ width: 12 }} />} 
                  <span style={{ marginLeft: '4px' }}>One special character</span>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '1rem' }}
            disabled={!isLogin && !isPasswordValid}
          >
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <strong>Tip:</strong> Use <code>admin</code> / <code>Admin@123</code> for Librarian access.
          </p>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setAvatarBase64('');
                setLocalError(null);
                setPassword('');
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
