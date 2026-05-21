import React, { useState, useRef } from 'react';
import { LogIn, UserPlus, Upload, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { UserRole, AccountStatus } from '../types';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (credentials: Pick<User, 'username' | 'password'>) => Promise<void>;
  onSignup: (user: User) => Promise<boolean>;
  onForgotPassword: (email: string) => Promise<boolean>;
  onResetPassword: (newPassword: string) => Promise<boolean>;
  loginError: string | null;
  clearLoginError: () => void;
}

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

const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, onSignup, onForgotPassword, onResetPassword, loginError, clearLoginError 
}) => {
  const [searchParams] = useSearchParams();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(() => {
    return searchParams.get('type') === 'recovery' ? 'reset' : 'login';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState('');
  const [department, setDepartment] = useState('');
  const [schoolId, setSchoolId] = useState('');
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
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      if (authMode === 'reset') {
        if (!isPasswordValid) {
          setLocalError('Please meet all password requirements.');
          setIsLoading(false);
          return;
        }
        if (!isPasswordMatch) {
          setLocalError('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        const success = await onResetPassword(password);
        if (success) {
          setAuthMode('login');
        }
        return;
      }

      if (authMode === 'forgot') {
        if (!isEmailValid) {
          setLocalError('Please enter a valid email address.');
          setIsLoading(false);
          return;
        }
        const success = await onForgotPassword(email);
        if (success) {
          setAuthMode('login');
        }
        return;
      }

      if (authMode === 'signup') {
        if (!isEmailValid) {
          setLocalError('Please enter a valid email address.');
          setIsLoading(false);
          return;
        }
        if (!department) {
          setLocalError('Please select your department.');
          setIsLoading(false);
          return;
        }
        if (!schoolId) {
          setLocalError('Please enter your School ID.');
          setIsLoading(false);
          return;
        }
        if (!isPasswordValid) {
          setLocalError('Please meet all password requirements.');
          setIsLoading(false);
          return;
        }
        if (!isPasswordMatch) {
          setLocalError('Passwords do not match.');
          setIsLoading(false);
          return;
        }
      }

      if (authMode === 'login') {
        await onLogin({ username, password });
      } else if (authMode === 'signup') {
        const generateId = () => {
           if (typeof crypto !== 'undefined' && crypto.randomUUID) {
             return crypto.randomUUID();
           }
           return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
         };

          const user: User = {
            id: generateId(),
            username,
            password: password, // Send raw password to onSignup
            name,
            role: UserRole.MEMBER,
            status: AccountStatus.ACTIVE,
            email,
            department,
            schoolId,
            avatarUrl: avatarBase64 || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          };
        
        const success = await onSignup(user);
        if (success) {
          setAuthMode('login');
          setPassword('');
          setUsername('');
          setName('');
          setEmail('');
          setAvatarBase64('');
          setDepartment('');
          setSchoolId('');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setLocalError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page flex" style={{ minHeight: 'calc(100vh - 70px)', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '2rem 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>
            {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : authMode === 'forgot' ? 'Reset Password' : 'New Password'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {authMode === 'login' ? 'Login to your library profile' : authMode === 'signup' ? 'Join the HollowInk community' : authMode === 'forgot' ? 'Enter your email to receive a reset link' : 'Set your new secure password'}
          </p>
        </div>

        {(localError || loginError) && (
          <div className="flex" style={{ backgroundColor: '#fff5f5', color: 'var(--danger)', padding: '0.8rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #feb2b2' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ marginLeft: '8px' }}>{localError || loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid" style={{ gap: '1.2rem' }}>
          {authMode === 'signup' && (
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
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>School ID</label>
                <input type="text" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required placeholder="Enter School ID" />
              </div>
              <div className="grid" style={{ gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>College Department</label>
                <select 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
                >
                  <option value="">Select Department</option>
                  {ubDepartments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {authMode !== 'forgot' && authMode !== 'reset' && (
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter username" />
            </div>
          )}

          {(authMode === 'signup' || authMode === 'forgot' || authMode === 'reset') && (
            <div className="grid" style={{ gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" disabled={authMode === 'reset'} />
            </div>
          )}
          
          {authMode !== 'forgot' && (
            <div className="grid" style={{ gap: '0.4rem' }}>
              <div className="flex" style={{ justifyContent: 'space-between' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>{authMode === 'reset' ? 'New Password' : 'Password'}</label>
                {authMode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('forgot')}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', padding: 0, cursor: 'pointer' }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="Enter password" 
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {(authMode === 'signup' || authMode === 'reset') && (
                <>
                  <div className="grid" style={{ gap: '0.4rem', marginTop: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Confirm {authMode === 'reset' ? 'New Password' : 'Password'}</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        placeholder="Confirm password" 
                        style={{ width: '100%', paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '5px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
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
                </>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '1rem' }}
            disabled={(authMode === 'signup' && (!isPasswordValid || !isEmailValid || !isPasswordMatch)) || (authMode === 'forgot' && !isEmailValid) || (authMode === 'reset' && (!isPasswordValid || !isPasswordMatch)) || isLoading}
          >
            {isLoading ? (
              <span className="spinner" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 1s linear infinite' }}></span>
            ) : (
              <>
                {authMode === 'login' ? <LogIn size={20} /> : authMode === 'signup' ? <UserPlus size={20} /> : <Check size={20} />}
                {authMode === 'login' ? 'Login' : authMode === 'signup' ? 'Sign Up' : authMode === 'forgot' ? 'Send Reset Link' : 'Update Password'}
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p>
            {authMode === 'login' ? "Don't have an account? " : authMode === 'signup' ? "Already have an account? " : "Remembered your password? "}
            <button 
              onClick={() => {
                const nextMode = authMode === 'login' ? 'signup' : 'login';
                setAuthMode(nextMode);
                setAvatarBase64('');
                setLocalError(null);
                setPassword('');
                setConfirmPassword('');
                clearLoginError();
              }} 
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, padding: 0, cursor: 'pointer' }}
            >
              {authMode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
