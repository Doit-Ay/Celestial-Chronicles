import { expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

// Register jest-dom matchers with Vitest's expect
expect.extend(matchers);

// Polyfill ResizeObserver for jsdom
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(window as any).ResizeObserver = ResizeObserver;