
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Tab {
  id: string;
  name: string;
  token: string;
  active: boolean;
}

const TabBar: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize tabs from sessionStorage on component mount
  useEffect(() => {
    const savedTabs = sessionStorage.getItem('facebook-auto-poster-tabs');
    const activeTab = sessionStorage.getItem('facebook-auto-poster-active-tab');
    
    if (savedTabs) {
      const parsedTabs: Tab[] = JSON.parse(savedTabs);
      setTabs(parsedTabs);
      
      // If there's a saved active tab, set it
      if (activeTab) {
        setActiveTabId(activeTab);
      } else if (parsedTabs.length > 0) {
        setActiveTabId(parsedTabs[0].id);
      }
    } else {
      // Create a default tab if no tabs exist
      const defaultTab = createNewTab('Session 1');
      setTabs([defaultTab]);
      setActiveTabId(defaultTab.id);
    }
  }, []);

  // Save tabs to sessionStorage whenever tabs change
  useEffect(() => {
    if (tabs.length > 0) {
      sessionStorage.setItem('facebook-auto-poster-tabs', JSON.stringify(tabs));
      
      // Make sure we have an active tab if there are tabs
      if (!activeTabId || !tabs.find(tab => tab.id === activeTabId)) {
        setActiveTabId(tabs[0].id);
      }
      
      // Save active tab ID
      if (activeTabId) {
        sessionStorage.setItem('facebook-auto-poster-active-tab', activeTabId);
      }
    } else {
      sessionStorage.removeItem('facebook-auto-poster-tabs');
      sessionStorage.removeItem('facebook-auto-poster-active-tab');
    }
  }, [tabs, activeTabId]);

  // Create a new tab
  const createNewTab = (name: string): Tab => {
    return {
      id: Date.now().toString(),
      name,
      token: '',
      active: true,
    };
  };

  // Add a new tab
  const addTab = () => {
    const newTabNumber = tabs.length + 1;
    const newTab = createNewTab(`Session ${newTabNumber}`);
    
    setTabs(prevTabs => {
      const updatedTabs = prevTabs.map(tab => ({
        ...tab,
        active: false,
      }));
      return [...updatedTabs, newTab];
    });
    
    setActiveTabId(newTab.id);
    
    toast({
      title: "New session created",
      description: `Session ${newTabNumber} has been added.`,
    });
  };

  // Remove a tab
  const removeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If we're removing the active tab, we need to activate another tab
    if (id === activeTabId) {
      const currentIndex = tabs.findIndex(tab => tab.id === id);
      if (tabs.length > 1) {
        // Activate the previous tab if available, otherwise the next one
        const newActiveIndex = currentIndex > 0 ? currentIndex - 1 : 1;
        setActiveTabId(tabs[newActiveIndex].id);
      } else {
        setActiveTabId(null);
      }
    }
    
    setTabs(prevTabs => prevTabs.filter(tab => tab.id !== id));
    
    toast({
      title: "Session closed",
      description: "The session tab has been removed.",
    });
  };

  // Set active tab
  const setActiveTab = (id: string) => {
    setActiveTabId(id);
  };

  // Update token for a specific tab
  const updateToken = (id: string, token: string) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === id ? { ...tab, token } : tab
      )
    );
  };

  // Get the currently active tab
  const getActiveTab = () => {
    return tabs.find(tab => tab.id === activeTabId) || null;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-100 border-b">
        <div className="flex flex-grow items-center overflow-x-auto">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              className={`flex items-center min-w-[150px] max-w-[200px] h-10 px-4 
                          border-r border-gray-200 cursor-pointer
                          ${tab.id === activeTabId 
                            ? 'bg-white text-facebook border-t-2 border-t-facebook font-medium' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex-grow truncate">{tab.name}</div>
              <button
                className="ml-2 rounded-full p-1 hover:bg-gray-200 text-gray-500"
                onClick={(e) => removeTab(tab.id, e)}
                aria-label="Close tab"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button 
          className="flex-shrink-0 h-10 px-3 text-gray-600 hover:text-facebook hover:bg-gray-200"
          onClick={addTab}
          aria-label="Add new tab"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-white flex-grow animate-fadeIn">
        {getActiveTab() ? (
          <TabContent tab={getActiveTab()!} updateToken={updateToken} />
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No active session. Create a new tab to continue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface TabContentProps {
  tab: Tab;
  updateToken: (id: string, token: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({ tab, updateToken }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{tab.name}</h2>
        <span className="px-3 py-1 bg-facebook-light text-facebook text-sm rounded-full">
          Active Session
        </span>
      </div>
      
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
        <label htmlFor={`token-${tab.id}`} className="block text-sm font-medium text-gray-700 mb-2">
          Facebook Access Token
        </label>
        <textarea
          id={`token-${tab.id}`}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-facebook focus:border-facebook"
          rows={3}
          placeholder="Paste your Facebook access token here..."
          value={tab.token}
          onChange={(e) => updateToken(tab.id, e.target.value)}
        />
        <p className="mt-2 text-xs text-gray-500">
          This token is stored in your browser's session storage and will be lost when you close the browser.
        </p>
      </div>
      
      {/* Additional tab content can go here */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="font-medium text-gray-800 mb-3">Session Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Session ID</p>
            <p className="font-mono text-sm">{tab.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Token Status</p>
            <p className="text-sm">
              {tab.token ? (
                <span className="text-green-600">✓ Token set</span>
              ) : (
                <span className="text-amber-600">⚠ No token</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
