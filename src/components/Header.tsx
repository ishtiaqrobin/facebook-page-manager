
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-facebook flex items-center justify-center">
            <span className="text-white text-lg font-bold">F</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Facebook Auto Poster</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-facebook transition-colors">Dashboard</a>
          <a href="#" className="text-gray-600 hover:text-facebook transition-colors">Sessions</a>
          <a href="#" className="text-gray-600 hover:text-facebook transition-colors">Help</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-facebook text-white rounded-md hover:bg-facebook-dark transition-colors"
          >
            Connect
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
