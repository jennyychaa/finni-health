import { Link } from 'react-router-dom';
import Layout from '../templates/Layout';

const Error = () => {
  return (
    <Layout>
      <h1 className='text-3xl mb-16 text-center'>
        Uh oh! Something happened 🙈
      </h1>
      <div className='flex justify-center'>
        <Link
          className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          to='/'>
          Go back to the Dashboard
        </Link>
      </div>
    </Layout>
  );
};

export default Error;
