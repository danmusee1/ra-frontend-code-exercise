import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StatusFilterPills } from './StatusFilterPills';
import { expectNoA11yViolations } from '../../../test/utils/A11y';

describe('StatusFilterPills', () => {
  it('renders a checkbox for every status, all unchecked when value is empty', () => {
    render(<StatusFilterPills value={[]} onChange={vi.fn()} />);

    expect(screen.getByRole('checkbox', { name: 'Active' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Onboarding' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Offboarded' })).not.toBeChecked();
  });

  it('checks only the statuses present in value', () => {
    render(<StatusFilterPills value={['active']} onChange={vi.fn()} />);

    expect(screen.getByRole('checkbox', { name: 'Active' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Onboarding' })).not.toBeChecked();
  });

  it('calls onChange with the status appended when an unchecked pill is checked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<StatusFilterPills value={['active']} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Onboarding' }));
    expect(onChange).toHaveBeenCalledWith(['active', 'onboarding']);
  });

  it('calls onChange with the status removed when a checked pill is unchecked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <StatusFilterPills value={['active', 'onboarding']} onChange={onChange} />
    );

    await user.click(screen.getByRole('checkbox', { name: 'Active' }));
    expect(onChange).toHaveBeenCalledWith(['onboarding']);
  });

  it('groups the pills under a labeled group for assistive tech', () => {
    render(<StatusFilterPills value={[]} onChange={vi.fn()} />);

    expect(
      screen.getByRole('group', { name: 'Filter by status' })
    ).toBeInTheDocument();
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <StatusFilterPills value={['active']} onChange={vi.fn()} />
    );
    await expectNoA11yViolations(container);
  });
});