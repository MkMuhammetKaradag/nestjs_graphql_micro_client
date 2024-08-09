import React from 'react';

const NotAuthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl text-red-500">
        You are not authorized to view this page.
      </h1>
    </div>
  );
};

export default NotAuthorized;
