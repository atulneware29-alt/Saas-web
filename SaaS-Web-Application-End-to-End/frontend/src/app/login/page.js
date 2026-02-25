'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)' }}>
      <div className="card animate-slideIn" style={{ width: '100%', maxWidth: 420, margin: 16 }}>
        <div className="text-center mb-8">
          <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Welcome Back</h1>
          <p className="text-secondary">Sign in to your account</p>
        </div>

        {error && (
          <div className="error-text" style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 20,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Do not have an account?{' '}
            <Link href="/register" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>

        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          background: 'var(--color-secondary)', 
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem'
        }}>
          <p className="text-secondary" style={{ marginBottom: 8 }}>Demo Credentials:</p>
          <p>Admin: admin@example.com / password123</p>
          <p>Manager: manager@example.com / password123</p>
          <p>User: user@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}
