import { axe } from 'vitest-axe';
import { expect } from 'vitest';

/**
 * Runs axe against a rendered container and asserts zero accessibility violations.
 */
export const expectNoA11yViolations = async (container: Element) => {
  const results = await axe(container);

  expect(results.violations).toHaveLength(0);
};