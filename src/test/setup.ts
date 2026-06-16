import '@testing-library/jest-dom/vitest';
import * as matchers from 'vitest-axe/matchers';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

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