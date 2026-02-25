'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Projects', href: '/dashboard/projects', icon: '📁' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: '✅' },
  { name: 'Users', href: '/dashboard/users', icon: '👥', roles: ['admin', 'manager'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 260 : 80,
          background: 'var(--color-primary)',
          borderRight: '1px solid var(--color-border)',
          position: 'fixed',
          height: '100vh',
          transition: 'width 0.3s ease',
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 64,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              flexShrink: 0,
            }}
          >
            S
          </div>
          {sidebarOpen && (
            <span style={{ fontWeight: 600, fontSize: '1.125rem', whiteSpace: 'nowrap' }}>
              SaaS App
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px 12px' }}>
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 4,
                  background: isActive ? 'var(--color-accent)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            background: 'var(--color-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 80, transition: 'margin-left 0.3s ease' }}>
        {/* Header */}
        <header
          style={{
            height: 64,
            background: 'var(--color-primary)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {filteredNavItems.find((item) => pathname.startsWith(item.href))?.name || 'Dashboard'}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* User info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'none', md: { display: 'block' } }}>
                <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                  {user?.role}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'var(--color-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
