
import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Link, FileImage, Hash, Facebook } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface Tab {
  id: string;
  name: string;
  token: string;
  active: boolean;
  isLoggedIn: boolean;
  profileData?: {
    name: string;
    profilePicture: string;
  };
}

const TabBar: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize tabs from sessionStorage on component mount
  useEffect(() => {
    const savedTabs = sessionStorage.getItem('facebook-auto-poster-tabs');
    const activeTab = sessionStorage.getItem('facebook-auto-poster-active-tab');
    const darkModePreference = localStorage.getItem('facebook-auto-poster-darkmode');
    
    if (darkModePreference === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
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
      isLoggedIn: false,
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

  // Update tab data
  const updateTab = (id: string, updates: Partial<Tab>) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === id ? { ...tab, ...updates } : tab
      )
    );
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('facebook-auto-poster-darkmode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('facebook-auto-poster-darkmode', 'light');
    }
    
    toast({
      title: newMode ? "Dark mode activated" : "Light mode activated",
      description: `Theme preference has been saved.`,
    });
  };

  // Get the currently active tab
  const getActiveTab = () => {
    return tabs.find(tab => tab.id === activeTabId) || null;
  };

  return (
    <div className={`flex flex-col w-full ${isDarkMode ? 'dark' : ''}`}>
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline"
          size="sm"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </Button>
      </div>
      
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex flex-grow items-center overflow-x-auto">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              className={`flex items-center min-w-[150px] max-w-[200px] h-10 px-4 
                          border-r border-gray-200 dark:border-gray-700 cursor-pointer
                          ${tab.id === activeTabId 
                            ? 'bg-white dark:bg-gray-900 text-facebook dark:text-facebook-light border-t-2 border-t-facebook font-medium' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex-grow truncate">{tab.name}</div>
              <button
                className="ml-2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onClick={(e) => removeTab(tab.id, e)}
                aria-label="Close tab"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button 
          className="flex-shrink-0 h-10 px-3 text-gray-600 dark:text-gray-300 hover:text-facebook dark:hover:text-facebook-light hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={addTab}
          aria-label="Add new tab"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-white dark:bg-gray-900 flex-grow animate-fadeIn">
        {getActiveTab() ? (
          <TabContent tab={getActiveTab()!} updateTab={updateTab} />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>No active session. Create a new tab to continue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface TabContentProps {
  tab: Tab;
  updateTab: (id: string, updates: Partial<Tab>) => void;
}

const TabContent: React.FC<TabContentProps> = ({ tab, updateTab }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hashtag, setHashtag] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    // Simulate Facebook login
    updateTab(tab.id, { 
      isLoggedIn: true,
      profileData: {
        name: "John Doe",
        profilePicture: "https://i.pravatar.cc/300?u=" + tab.id,
      }
    });
    
    toast({
      title: "Login successful",
      description: "You have successfully logged in with Facebook.",
    });
  };

  const handleLogout = () => {
    updateTab(tab.id, { 
      isLoggedIn: false,
      profileData: undefined
    });
    
    toast({
      title: "Logout successful",
      description: "You have been logged out from Facebook.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} has been selected.`,
      });
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Upload failed",
        description: "Please select a file first.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate upload
    toast({
      title: "Upload successful",
      description: `${selectedFile.name} has been uploaded${hashtag ? ' with hashtag: ' + hashtag : ''}.`,
    });
    
    // Reset form
    setSelectedFile(null);
    setHashtag('');
  };

  const handleVisitPage = () => {
    toast({
      title: "Visit page",
      description: "Redirecting to your Facebook page (simulated).",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{tab.name}</h2>
        <span className="px-3 py-1 bg-facebook-light dark:bg-facebook-dark text-facebook dark:text-facebook-light text-sm rounded-full">
          Active Session
        </span>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <label htmlFor={`token-${tab.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Facebook Access Token
        </label>
        <textarea
          id={`token-${tab.id}`}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-facebook focus:border-facebook
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          rows={3}
          placeholder="Paste your Facebook access token here..."
          value={tab.token}
          onChange={(e) => updateTab(tab.id, { token: e.target.value })}
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          This token is stored in your browser's session storage and will be lost when you close the browser.
        </p>
      </div>
      
      {/* Facebook Login Button */}
      <div className="flex justify-center">
        {!tab.isLoggedIn ? (
          <Button 
            className="bg-facebook hover:bg-facebook-dark text-white font-bold py-2 px-6 rounded-md flex items-center gap-2"
            onClick={handleLogin}
          >
            <Facebook size={20} />
            Login with Facebook
          </Button>
        ) : (
          <Button 
            variant="outline"
            className="text-facebook dark:text-facebook-light border-facebook dark:border-facebook-light hover:bg-facebook-light dark:hover:bg-facebook-dark font-bold py-2 px-6 rounded-md"
            onClick={handleLogout}
          >
            Logout from Facebook
          </Button>
        )}
      </div>
      
      {/* Admin Panel Interface */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Admin Panel</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Profile data */}
            <div className="col-span-1">
              {tab.isLoggedIn && tab.profileData ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={tab.profileData.profilePicture} alt={tab.profileData.name} />
                      <AvatarFallback>{tab.profileData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{tab.profileData.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Connected with Facebook</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Status</h5>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    Please log in with Facebook to view profile data
                  </div>
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                </div>
              )}
            </div>
            
            {/* Middle and Right columns: Upload form */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File upload */}
                <div>
                  <Label 
                    htmlFor={`file-upload-${tab.id}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Upload Media
                  </Label>
                  <div className="flex items-center">
                    <label 
                      htmlFor={`file-upload-${tab.id}`}
                      className={`flex items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-gray-800 
                                  border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md appearance-none cursor-pointer
                                  hover:border-facebook focus:outline-none ${!tab.isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="flex items-center space-x-2">
                        <FileImage size={24} className="text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {selectedFile ? selectedFile.name : "Click to select a file"}
                        </span>
                      </span>
                      <input 
                        id={`file-upload-${tab.id}`}
                        name="file_upload" 
                        type="file" 
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={!tab.isLoggedIn}
                        accept="image/*,video/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, GIF, or MP4 up to 10MB
                  </p>
                </div>
                
                {/* Hashtag input */}
                <div>
                  <div className="space-y-6">
                    <div>
                      <Label 
                        htmlFor={`hashtag-${tab.id}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Hashtag
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash size={18} className="text-gray-400" />
                        </div>
                        <Input
                          id={`hashtag-${tab.id}`}
                          placeholder="Enter hashtag without # symbol"
                          className="pl-10"
                          value={hashtag}
                          onChange={(e) => setHashtag(e.target.value)}
                          disabled={!tab.isLoggedIn}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        className={`flex items-center gap-2 ${!tab.isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleVisitPage}
                        disabled={!tab.isLoggedIn}
                      >
                        <Link size={18} />
                        Visit Page
                      </Button>
                      
                      <Button
                        className={`bg-facebook hover:bg-facebook-dark text-white flex items-center gap-2 ${!tab.isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleUpload}
                        disabled={!tab.isLoggedIn}
                      >
                        <Upload size={18} />
                        Upload Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional tab content can go here */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Session Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Session ID</p>
            <p className="font-mono text-sm text-gray-700 dark:text-gray-300">{tab.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Token Status</p>
            <p className="text-sm">
              {tab.token ? (
                <span className="text-green-600 dark:text-green-400">✓ Token set</span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">⚠ No token</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
