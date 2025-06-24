import React, { createContext, useContext, useState } from 'react';

// Create a context for encounter data
const EncounterContext = createContext();

// Provider component that will maintain the state for each tab
export const EncounterProvider = ({ children }) => {
  const [tabsData, setTabsData] = useState({});

  // Function to get or set data for a specific tab
  const getTabData = (tabId) => {
    return tabsData[tabId] || {};
  };

  // Function to update data for a specific tab
  const updateTabData = (tabId, data) => {
    setTabsData(prev => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        ...data
      }
    }));
  };

  return (
    <EncounterContext.Provider value={{ tabsData, getTabData, updateTabData }}>
      {children}
    </EncounterContext.Provider>
  );
};

// Custom hook to use the encounter context
export const useEncounter = () => {
  const context = useContext(EncounterContext);
  if (!context) {
    throw new Error('useEncounter must be used within an EncounterProvider');
  }
  return context;
};