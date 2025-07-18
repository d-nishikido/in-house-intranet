import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders application', () => {
  render(<App />);
  expect(document.querySelector('.App')).toBeInTheDocument();
});