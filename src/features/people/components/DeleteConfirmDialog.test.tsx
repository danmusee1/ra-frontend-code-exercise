import { render, waitFor, screen } from '@testing-library/react';
// import { screen } from '@testing-library/dom';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test/utils/A11y';
import { Person } from '../types/person';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import userEvent from '@testing-library/user-event';

const person: Person = {
  id: 1,
  name: 'Ada Lovelace',
  jobTitle: 'Engineer',
  employment: 'full_time',
  status: 'active',
  photo: '',
  country: 'UK',
  salary: 120000,
  currency: 'USD',
};

describe('DeleteConfirmDialog', () => {
  it('renders nothing visible to the user when person is null', () => {
    render(
      <DeleteConfirmDialog
        person={null}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.queryByText('Remove team member?')).not.toBeInTheDocument();
  });

  it('shows the dialog with the person name when a person is provided', () => {
    render(
      <DeleteConfirmDialog
        person={person}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Remove team member?')).toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
  });

  it('calls onConfirm when the Remove button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <DeleteConfirmDialog
        person={person}
        isDeleting={false}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <DeleteConfirmDialog
        person={person}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('disables Cancel and shows a loading spinner on Remove while isDeleting is true', () => {
    render(
      <DeleteConfirmDialog
        person={person}
        isDeleting={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();

    const buttons = screen.getAllByRole('button');
    const removeButton = buttons.find((button) =>
      button.hasAttribute('aria-busy')
    );
    expect(removeButton).toBeDefined();
    expect(removeButton).toHaveAttribute('aria-busy', 'true');
    expect(removeButton).toBeDisabled();
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('calls onCancel when the native dialog fires a close event (Escape key)', async () => {
    const onCancel = vi.fn();

    render(
      <DeleteConfirmDialog
        person={person}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    const dialog = screen.getByRole('dialog') as HTMLDialogElement;
    // Simulate the native Escape-to-close behavior: jsdom doesn't run the
    // platform's cancel/close sequence, so we dispatch what a real <dialog>
    // would emit and let the component's onClose handler react to it.
    dialog.close();

    await waitFor(() => expect(onCancel).toHaveBeenCalledTimes(1));
  });

  it('has no detectable accessibility violations when open', async () => {
    const { container } = render(
      <DeleteConfirmDialog
        person={person}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    await expectNoA11yViolations(container);
  });

  it('labels the dialog via aria-labelledby/aria-describedby pointing at the title and description', () => {
    render(
      <DeleteConfirmDialog
        person={person}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'delete-dialog-title');
    expect(dialog).toHaveAttribute(
      'aria-describedby',
      'delete-dialog-description'
    );
    expect(document.getElementById('delete-dialog-title')).toHaveTextContent(
      'Remove team member?'
    );
  });
});
