import React from 'react';
import { render, screen } from '@testing-library/react';
import PageLayout from './Layout';

test('renders learn react link', () => {
  render(<PageLayout />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
