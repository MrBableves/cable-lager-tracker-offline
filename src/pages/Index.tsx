
import React, { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Redirect to the HTML application
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading Cable Inventory Management...</h1>
        <p className="text-xl text-gray-600">Please wait while we redirect you to the application.</p>
      </div>
    </div>
  );
};

export default Index;
