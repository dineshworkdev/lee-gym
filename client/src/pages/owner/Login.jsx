import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { useOwnerGym } from '../../context/OwnerGymContext.jsx';

function getFriendlyAuthErrorMessage(error) {
  if (!error) return 'An error occurred during authentication.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact system support.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to repeated failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return ''; // User intentionally closed or cancelled popup
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/unauthorized-domain':
      return 'Domain not authorized for OAuth in Firebase Console. Please verify authorized domains.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated, authLoading } = useOwnerGym();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to admin dashboard or destination
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const destination = location.state?.from?.pathname || '/owner/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isGoogleLoading) return;
    setError('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError('Please enter your email or username');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      await login(cleanEmail, cleanPassword);
      const destination = location.state?.from?.pathname || '/owner/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Firebase Email sign-in failed:', err);
      const friendlyMessage = getFriendlyAuthErrorMessage(err);
      if (friendlyMessage) {
        setError(friendlyMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading || isGoogleLoading) return;
    setError('');
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || '/owner/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Firebase Google sign-in failed:', err);
      const friendlyMessage = getFriendlyAuthErrorMessage(err);
      if (friendlyMessage) {
        setError(friendlyMessage);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAutoFillEmail = () => {
    setEmail('leegym.website@gmail.com');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F7F5EF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(37, 42, 46, 0.08)',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(37, 42, 46, 0.08)',
          padding: '2.5rem 2rem',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '54px',
              height: '54px',
              backgroundColor: '#252A2E',
              color: '#F4C400',
              marginBottom: '1rem',
            }}
          >
            <Dumbbell size={28} />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: '2.5rem',
              lineHeight: 1,
              letterSpacing: '0.04em',
              color: '#252A2E',
              marginBottom: '0.35rem',
            }}
          >
            LEE <span style={{ color: '#F4C400' }}>GYM</span>
          </div>

          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#252A2E',
              color: '#F4C400',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.65rem',
            }}
          >
            OWNER WORKSPACE
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
              fontSize: '1.9rem',
              letterSpacing: '0.03em',
              color: '#252A2E',
              margin: 0,
            }}
          >
            OWNER LOGIN
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.85rem',
              color: '#4B555D',
              margin: '0.3rem 0 0',
            }}
          >
            Enter your credentials to access the gym management dashboard.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              backgroundColor: '#FDF2F2',
              borderLeft: '4px solid #A83D3D',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.85rem',
              color: '#A83D3D',
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email / Username */}
          <div>
            <label
              htmlFor="login-email"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#252A2E',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem',
              }}
            >
              Email or Username
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#4B555D',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Mail size={18} />
              </div>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@leegym.com"
                disabled={isLoading || isGoogleLoading}
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.92rem',
                  color: '#252A2E',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #252A2E',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              style={{
                display: 'block',
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#252A2E',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#4B555D',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Lock size={18} />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading || isGoogleLoading}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.92rem',
                  color: '#252A2E',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #252A2E',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#4B555D',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading || isGoogleLoading}
            style={{
              backgroundColor: '#F4C400',
              color: '#252A2E',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '0.85rem 1.5rem',
              border: '1px solid #D4A900',
              borderRadius: '6px',
              cursor: (isLoading || isGoogleLoading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              transition: 'all 150ms ease',
              opacity: (isLoading || isGoogleLoading) ? 0.8 : 1,
            }}
          >
            {isLoading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>LOGIN</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Optional Divider & Google Auth Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0.25rem 0',
              gap: '0.75rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(37, 42, 46, 0.12)' }} />
            <span
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#8B949E',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              OR
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(37, 42, 46, 0.12)' }} />
          </div>

          <button
            id="google-login-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#252A2E',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.88rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              padding: '0.75rem 1.25rem',
              border: '1px solid rgba(37, 42, 46, 0.18)',
              borderRadius: '6px',
              cursor: (isLoading || isGoogleLoading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              transition: 'all 150ms ease',
              opacity: (isLoading || isGoogleLoading) ? 0.75 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'CONNECTING GOOGLE...' : 'CONTINUE WITH GOOGLE'}</span>
          </button>
        </form>

        {/* Auth Info & Quick Fill */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px dashed rgba(37, 42, 46, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: '0.78rem',
            color: '#4B555D',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="#2F7D4A" />
            <span>Firebase Authentication</span>
          </div>
          <button
            type="button"
            onClick={handleAutoFillEmail}
            style={{
              background: 'none',
              border: 'none',
              color: '#252A2E',
              fontWeight: 700,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.78rem',
            }}
          >
            Fill Admin Email
          </button>
        </div>

        {/* Back to Public Website */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.8rem',
              color: '#4B555D',
              textDecoration: 'none',
            }}
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

