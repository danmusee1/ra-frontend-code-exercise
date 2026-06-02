import { ReactElement, PropsWithChildren } from 'react';

const Container = (props: PropsWithChildren<Record<string, unknown>>) => (
  <main className="mx-auto w-full max-w-[var(--layout-width)]" {...props} />
);

export const AddEditPeoplePage = (): ReactElement => {
  return (
    <Container>
      <h1>Add a member.</h1>
      <p>
        Pretend this page is built, you just need to connect to it, you do not
        need to build it.
      </p>
    </Container>
  );
};
