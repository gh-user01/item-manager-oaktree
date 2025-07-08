import { render, screen, fireEvent } from '@testing-library/react';
import ItemForm from '../../components/ItemForm';

describe('ItemForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with all fields and submit button', () => {
    render(<ItemForm onSubmit={mockOnSubmit} submitLabel="Create Item" />);
    
    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Price *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Item' })).toBeInTheDocument();
  });

  test('populates form with initial data when provided', () => {
    const initialData = {
      name: 'Test Item',
      description: 'Test description',
      price: 29.99,
    };

    render(<ItemForm onSubmit={mockOnSubmit} submitLabel="Update Item" initialData={initialData} />);
    
    expect(screen.getByDisplayValue('Test Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('29.99')).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', () => {
    render(<ItemForm onSubmit={mockOnSubmit} submitLabel="Create Item" />);
    
    const submitButton = screen.getByRole('button', { name: 'Create Item' });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Price is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', () => {
    render(<ItemForm onSubmit={mockOnSubmit} submitLabel="Create Item" />);
    
    // Fill in form with valid data
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText('Price *'), { target: { value: '29.99' } });
    
    const submitButton = screen.getByRole('button', { name: 'Create Item' });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test Item',
      description: 'Test description',
      price: 29.99,
    });
  });
});
