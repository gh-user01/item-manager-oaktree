import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth } from '../../contexts/AuthContext';
import ItemCard from '../../components/ItemCard';

// Mock the dependencies
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockItem = {
  id: 1,
  name: 'Test Item',
  description: 'This is a test item description',
  price: 29.99,
};

describe('ItemCard Component', () => {
  const mockOnDelete = jest.fn();
  const mockOnAuthRequired = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders item information correctly', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
    } as ReturnType<typeof useAuth>);

    render(<ItemCard item={mockItem} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('This is a test item description')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('shows "No description available" when description is empty', () => {
    const itemWithoutDescription = { ...mockItem, description: '' };
    
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
    } as ReturnType<typeof useAuth>);

    render(<ItemCard item={itemWithoutDescription} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  test('calls onAuthRequired when unauthenticated user tries to delete', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    } as ReturnType<typeof useAuth>);

    render(<ItemCard item={mockItem} onDelete={mockOnDelete} onAuthRequired={mockOnAuthRequired} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockOnAuthRequired).toHaveBeenCalledTimes(1);
  });
});
