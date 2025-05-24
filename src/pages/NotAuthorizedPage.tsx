import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotAuthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-500 mb-4">
          Access Denied
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          You do not have the necessary permissions to view this page.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          If you believe this is an error, please contact the site administrator.
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
