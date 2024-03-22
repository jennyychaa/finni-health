import { PropsWithChildren } from 'react';

const WideLayout = ({ children }: PropsWithChildren) => {
  return <div className='container mx-auto px-8 py-24'>{children}</div>;
};

export default WideLayout;
