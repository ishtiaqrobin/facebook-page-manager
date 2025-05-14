
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import TabBar from '@/components/TabBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
