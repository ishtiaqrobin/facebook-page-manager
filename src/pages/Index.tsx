
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import TabBar from '@/components/TabBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Token Sessions</h2>
            <p className="text-sm text-gray-500">
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
          />
          <InfoCard 
            title="Manage Posts" 
            description="Create, schedule, and manage your automated Facebook posts."
            actionText="Post Manager"
          />
          <InfoCard 
            title="Account Settings" 
            description="Configure your app settings and notification preferences."
            actionText="Settings"
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
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, actionText }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button className="text-facebook hover:text-facebook-dark font-medium text-sm">
        {actionText} →
      </button>
    </div>
  );
};

export default Index;
