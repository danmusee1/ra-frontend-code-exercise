import { ReactElement, HTMLAttributes } from 'react';

interface WrapperProps extends HTMLAttributes<HTMLElement> {}

interface InnerProps extends HTMLAttributes<HTMLDivElement> {}

const Wrapper = (props: WrapperProps): ReactElement => (
  <header className="bg-[var(--colors-blank)] w-full" {...props} />
);

const Inner = (props: InnerProps): ReactElement => (
  <div
    className="mx-auto h-[80px] max-w-[var(--layout-width)] py-2 px-4 flex items-center justify-end"
    {...props}
  />
);

export const AppHeader = (): ReactElement => {
  return (
    <Wrapper>
      <Inner>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[1.4rem] font-medium">Julie Howard</div>
            <div className="text-[1.2rem] text-[var(--colors-gray-600)]">
              Admin
            </div>
          </div>
        </div>
      </Inner>
    </Wrapper>
  );
};