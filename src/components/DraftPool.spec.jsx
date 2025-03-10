import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DraftPool from './DraftPool';

// Mock data for testing
const mockPlayers = [
  {
    name: 'John Doe',
    position: 'QB',
    rating: 95,
    college: 'Michigan',
    year: 'Senior',
  },
  {
    name: 'Jane Smith',
    position: 'WR',
    rating: 92,
    college: 'Ohio State',
    year: 'Junior',
  },
  {
    name: 'Bob Johnson',
    position: 'CB',
    rating: 88,
    college: 'Alabama',
    year: 'Senior',
  },
];

describe('DraftPool Component', () => {
  // Default props for most tests
  const defaultProps = {
    availablePlayers: mockPlayers,
    filterPosition: 'All',
    setFilterPosition: jest.fn(),
    handleDraftPlayer: jest.fn(),
    currentPick: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with header', () => {
    render(<DraftPool {...defaultProps} />);
    
    // Check if the header is rendered
    expect(screen.getByText('Draft Pool')).toBeInTheDocument();
  });

  it('renders the position filter dropdown', () => {
    render(<DraftPool {...defaultProps} />);
    
    // Check if the position filter is rendered
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.value).toBe('All');
    
    // Check if dropdown has options
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'QB' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'WR' })).toBeInTheDocument();
  });

  it('changes filter position when dropdown selection changes', () => {
    render(<DraftPool {...defaultProps} />);
    
    // Find the dropdown and change its value
    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'QB' } });
    
    // Check if setFilterPosition was called with the right argument
    expect(defaultProps.setFilterPosition).toHaveBeenCalledWith('QB');
  });

  it('renders player cards for each available player', () => {
    render(<DraftPool {...defaultProps} />);
    
    // Check if each player's information is displayed
    mockPlayers.forEach((player) => {
      const playerYear = screen.getAllByText(`Year: ${player.year}`);
      expect(screen.getByText(`Player: ${player.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Position: ${player.position}`)).toBeInTheDocument();
      expect(screen.getByText(`Rating: ${player.rating}`)).toBeInTheDocument();
      expect(screen.getByText(`College: ${player.college}`)).toBeInTheDocument();
      expect(playerYear.length).toBeGreaterThan(0);
    });
    
    // Check if we have the correct number of Draft buttons
    const draftButtons = screen.getAllByRole('button', { name: 'Draft' });
    expect(draftButtons).toHaveLength(mockPlayers.length);
  });

  it('calls handleDraftPlayer when Draft button is clicked', () => {
    render(<DraftPool {...defaultProps} />);
    
    // Find the first Draft button and click it
    const draftButtons = screen.getAllByRole('button', { name: 'Draft' });
    fireEvent.click(draftButtons[0]);
    
    // Check if handleDraftPlayer was called with the right arguments
    expect(defaultProps.handleDraftPlayer).toHaveBeenCalledWith(mockPlayers[0], 1);
  });

  it('disables Draft buttons when currentPick is null or undefined', () => {
    render(<DraftPool {...defaultProps} currentPick={null} />);
    
    // Check if all Draft buttons are disabled
    const draftButtons = screen.getAllByRole('button', { name: 'Draft' });
    draftButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('displays a message when no players are available', () => {
    render(<DraftPool {...defaultProps} availablePlayers={[]} />);
    
    // Check if the "no players" message is displayed
    expect(screen.getByText('No players available for drafting.')).toBeInTheDocument();
  });

  it('renders correctly with filtered position', () => {
    // Test with a filtered position value
    const filteredProps = {
      ...defaultProps,
      filterPosition: 'QB',
    };
    
    render(<DraftPool {...filteredProps} />);
    
    // Check if dropdown shows the correct selected value
    const dropdown = screen.getByRole('combobox');
    expect(dropdown.value).toBe('QB');
  });
});