import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from '../../app/(auth)/login/page';
import { useAuth } from '../../contexts/AuthContext';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as ReturnType<typeof useRouter>);
    
    // Mock useSearchParams
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  test('renders login form with all fields', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  test('redirects to home if already authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      isAuthenticated: true,
      login: jest.fn(),
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    render(<LoginPage />);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('updates form fields when user types', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email Address *');
    const passwordInput = screen.getByLabelText('Password *');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('has link to signup page', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: jest.fn(),
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    render(<LoginPage />);
    
    const signupLink = screen.getByRole('link', { name: 'Create one' });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });
});
