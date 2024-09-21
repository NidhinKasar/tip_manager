import React, { useState } from 'react';
import TipCalculator from './TipCalculator';
import UsageHistory from './TipHistory.tsx';
import { useNavigate } from 'react-router-dom';

const TipMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('TipCalculator');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const userDetails: any = JSON.parse(localStorage.getItem('user_data') || '{}');

  const handleProfileClick = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle dropdown visibility
  };
  
  const handleLogout = () => {
    // Perform logout logic here
    localStorage.clear()
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 text-gray-200">
        <h1 className="text-2xl font-bold">Tip Manager</h1>
        
        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src={`http://localhost:8000${userDetails?.profile_picture}`} // Placeholder image for the profile
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-white font-semibold">{userDetails?.name}</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-24 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-gray-200 flex flex-col py-6 px-4">
          <nav>
            <ul>
              <li
                className={`cursor-pointer py-2 px-4 mb-4 rounded ${
                  activeTab === 'TipCalculator' ? 'bg-gray-600 text-white' : ''
                } hover:bg-gray-600 transition-colors duration-200`}
                onClick={() => setActiveTab('TipCalculator')}
              >
                Tip Calculator
              </li>
              <li
                className={`cursor-pointer py-2 px-4 rounded ${
                  activeTab === 'UsageHistory' ? 'bg-gray-600 text-white' : ''
                } hover:bg-gray-600 transition-colors duration-200`}
                onClick={() => setActiveTab('UsageHistory')}
              >
                Usage History
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-gray-50 overflow-hidden">
          {activeTab === 'TipCalculator' && <TipCalculator />}
          {activeTab === 'UsageHistory' && <UsageHistory />}
        </div>
      </div>
    </div>
  );
};

export default TipMain;
