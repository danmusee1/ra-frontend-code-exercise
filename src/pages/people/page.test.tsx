import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PeoplePage } from './PeoplePage';
import { TestProviders } from '../../test/provider';

describe('PeoplePage', () => {
  it("should render 'People' in the page", () => {
    render(
      <TestProviders>
        <PeoplePage />
      </TestProviders>
    );
    expect(screen.getByText('People')).toBeInTheDocument();
  });
});
