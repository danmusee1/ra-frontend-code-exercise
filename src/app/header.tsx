import { ReactElement, HTMLAttributes } from 'react';

interface WrapperProps extends HTMLAttributes<HTMLElement> {}

interface InnerProps extends HTMLAttributes<HTMLDivElement> {}

const Wrapper = (props: WrapperProps): ReactElement => (
  <header className="bg-[var(--colors-blank)] w-full" {...props} />
);

const Inner = (props: InnerProps): ReactElement => (
  <div
    className="mx-auto h-[80px]  py-2 px-4 flex items-center justify-end "
    {...props}
  />
);

export const AppHeader = (): ReactElement => {
  return (
    <Wrapper>
      <Inner>
        <div className="flex items-center gap-3 lg:p-20 p-10">
          <div className="text-right">
            <div className="admin-name">Julie Howard</div>
            <div className="text-start  admin-meta ">
              Admin
            </div>
          </div>
        </div>
      </Inner>
    </Wrapper>
  );
};