import { ReactElement, PropsWithChildren } from 'react';

const Container = (props: PropsWithChildren<Record<string, unknown>>) => (
  <main className="mx-auto w-full max-w-[var(--layout-width)]" {...props} />
);

export const AddEditPeoplePage = (): ReactElement => {
  return (
    <Container>
      <h1>Add a member.</h1>
      <p>
       Add Member page coming soon
      </p>
    </Container>
  );
};
