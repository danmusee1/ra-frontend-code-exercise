import '@testing-library/jest-dom/vitest';
import * as matchers from 'vitest-axe/matchers';
import { configureAxe } from 'vitest-axe';
import { afterEach, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

/**
 * jsdom doesn't implement getComputedStyle for pseudo-elements, which axe's
 * color-contrast check relies on. This causes harmless but noisy
 * "Not implemented" errors logged to stderr on every render. Disabling that
 * single rule keeps output clean; color contrast should be verified with a
 * real browser (e.g. Playwright/Storybook a11y addon) rather than jsdom.
 */
export const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
});
window.scrollTo = vi.fn();
/**
 * jsdom doesn't implement <dialog>'s imperative API (showModal/close) or the
 * `open` property's side effects. DeleteConfirmDialog relies on showModal()
 * for its focus trap, so we polyfill the minimum behavior needed for tests:
 * showModal() sets `open` and fires nothing on its own; close() sets `open`
 * to false and fires a native 'close' event (matching real <dialog> behavior).
 */
if (typeof window !== 'undefined' && !window.HTMLDialogElement.prototype.showModal) {
  window.HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    const wasOpen = this.open;
    this.open = false;
    if (wasOpen) {
      this.dispatchEvent(new Event('close'));
    }
  };
}

// NOTE: SVG `?react` imports (vite-plugin-svgr) are stubbed via the
// `vite.config.ts` `resolve.alias` -> `src/test/svg-mock.tsx`, so no
// per-icon vi.mock calls are needed here.