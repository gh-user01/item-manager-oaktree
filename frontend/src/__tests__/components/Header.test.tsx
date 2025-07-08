import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as ReturnType<typeof useRouter>);
  });

  test('renders header with logo and shows sign in/up buttons when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
    } as ReturnType<typeof useAuth>);

    render(<Header />);
    
    expect(screen.getByText('Item Manager')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('shows user info and add item links when authenticated', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      logout: jest.fn(),
    } as ReturnType<typeof useAuth>);

    render(<Header />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument(); // First letter in avatar
    expect(screen.getAllByText('Add Item')).toHaveLength(2); // Desktop and mobile
  });

  test('navigates to login and signup pages when buttons are clicked', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
    } as ReturnType<typeof useAuth>);

    render(<Header />);
    
    const signInButton = screen.getByText('Sign In');
    const signUpButton = screen.getByText('Sign Up');
    
    fireEvent.click(signInButton);
    expect(mockPush).toHaveBeenCalledWith('/login');
    
    fireEvent.click(signUpButton);
    expect(mockPush).toHaveBeenCalledWith('/signup');
  });
});
