import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import SignUpPage from '../../app/(auth)/signup/page';
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

describe('SignUpPage', () => {
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

  test('renders signup form with all fields', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      register: jest.fn(),
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    render(<SignUpPage />);
    
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  test('redirects to home if already authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
      isAuthenticated: true,
      register: jest.fn(),
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    render(<SignUpPage />);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('updates form fields when user types', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      register: jest.fn(),
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    render(<SignUpPage />);
    
    const nameInput = screen.getByLabelText('Full Name *');
    const emailInput = screen.getByLabelText('Email Address *');
    const passwordInput = screen.getByLabelText('Password *');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password *');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  test('has link to login page', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      register: jest.fn(),
      isLoading: false,
    } as ReturnType<typeof useAuth>);

    render(<SignUpPage />);
    
    const loginLink = screen.getByRole('link', { name: 'Sign in' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
