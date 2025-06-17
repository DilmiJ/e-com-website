import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const TestPage = () => {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Test Page</h1>
          <p className="text-gray-600">If you can see this, the basic components are working!</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TestPage;
