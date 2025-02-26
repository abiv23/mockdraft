import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-02-26'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the footer with the current year and copyright text', () => {
    render(<Footer />);

    expect(screen.getByText('© 2025 Draft Bivulator. All rights reserved.')).toBeInTheDocument();
  });

  it('has the correct CSS classes for styling', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toHaveClass('bg-black text-white p-4 text-right');
  });
});