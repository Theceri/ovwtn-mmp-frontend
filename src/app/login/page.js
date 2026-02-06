'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error === 'CredentialsSignin' 
          ? 'Invalid email or password' 
          : 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success('Login successful!');
        
        // Fetch session to determine redirect
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        
        // Redirect based on role or callback URL
        if (session?.user?.role === 'admin') {
          router.push('/admin');
        } else if (callbackUrl && callbackUrl !== '/login' && callbackUrl !== '/dashboard') {
          router.push(callbackUrl);
        } else {
          // Members go to /member, others to /dashboard
          router.push(session?.user?.role === 'member' ? '/member' : '/dashboard');
        }
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 relative">
              <Image
                src="/One-Voice-Final-LOGO.png"
                alt="One Voice Women Trade Network Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome Back
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your OVWTN account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors"
                style={{
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--background)',
                }}
                placeholder="admin@ovwtn.ke"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors"
                style={{
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--background)',
                }}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = 'var(--brand-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = 'var(--brand-primary)';
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--brand-primary)' }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--brand-secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--brand-primary)';
              }}
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Don't have an account?{' '}
            <a
              href="/apply"
              className="font-medium transition-colors"
              style={{ color: 'var(--brand-primary)' }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--brand-secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--brand-primary)';
              }}
            >
              Apply for membership
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
