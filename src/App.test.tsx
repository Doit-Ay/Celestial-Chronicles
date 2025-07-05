import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
    it('renders the app correctly', () => {
        render(<App />);
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    it('has a button that works', () => {
        render(<App />);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });
});