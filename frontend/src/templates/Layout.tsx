import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='container max-w-screen-md mx-auto px-8 py-24'>
      {children}
    </div>
  );
};

export default Layout;
