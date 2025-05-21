
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import TabBar from '@/components/TabBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Load dark mode preference from localStorage
    const darkModePreference = localStorage.getItem('facebook-auto-poster-darkmode');
    if (darkModePreference === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-b border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Token Sessions</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Manage your Facebook access tokens for auto-posting
            </p>
          </div>
          
          <TabBar />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard 
            title="Get Started" 
            description="Learn how to generate and use Facebook access tokens for posting."
            actionText="View Guide"
            isDarkMode={isDarkMode}
          />
          <InfoCard 
            title="Manage Posts" 
            description="Create, schedule, and manage your automated Facebook posts."
            actionText="Post Manager"
            isDarkMode={isDarkMode}
          />
          <InfoCard 
            title="Account Settings" 
            description="Configure your app settings and notification preferences."
            actionText="Settings"
            isDarkMode={isDarkMode}
          />
        </div>
        
        <div className="mt-8 p-6 rounded-lg shadow-md text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-4">New Authentication System</h2>
          <p className="mb-6">Try our new authentication system with secure login, registration, and OTP verification</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-md font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-transparent hover:bg-white/10 border border-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface InfoCardProps {
  title: string;
  description: string;
  actionText: string;
  isDarkMode: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, actionText, isDarkMode }) => {
  return (
    <div className={`p-6 rounded-lg shadow-sm transition-shadow hover:shadow-md
                    ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
      <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{title}</h3>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
      <button className={`text-facebook hover:text-facebook-dark font-medium text-sm
                          ${isDarkMode ? 'text-facebook-light hover:text-blue-400' : ''}`}>
        {actionText} →
      </button>
    </div>
  );
};

export default Index;
