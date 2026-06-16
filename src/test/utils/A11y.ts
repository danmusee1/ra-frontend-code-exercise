import { expect } from 'vitest';
import { axe } from '../setup';

/** Runs axe against a rendered container and asserts zero violations. */
export const expectNoA11yViolations = async (container: Element) => {
  const results = await axe(container);
    expect(results.violations).toHaveLength(0);
};