import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { useOwnerGym } from '../../context/OwnerGymContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useOwnerGym();

  const [email, setEmail] = useState('owner@leegym.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email or username');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate realistic fast authentication latency
    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/owner/dashboard');
      } else {
        setError(res.message || 'Invalid credentials. Please try again.');
      }
    }, 450);
  };

  const handleDemoFill = () => {
    setEmail('owner@leegym.com');
    setPassword('admin123');
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
          border: '2px solid #252A2E',
          boxShadow: '6px 6px 0px #252A2E',
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
            disabled={isLoading}
            style={{
              backgroundColor: '#F4C400',
              color: '#252A2E',
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.92rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.9rem 1.5rem',
              border: '2px solid #252A2E',
              boxShadow: '3px 3px 0px #252A2E',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              transition: 'transform 120ms ease, box-shadow 120ms ease',
            }}
          >
            {isLoading ? (
              <span>VERIFYING...</span>
            ) : (
              <>
                <span>LOGIN</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fill Helper */}
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
            <span>Frontend Preview Mode</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
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
            Auto-fill Test Login
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
