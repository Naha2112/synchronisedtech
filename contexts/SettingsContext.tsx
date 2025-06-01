"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  // Theme settings
  colorScheme: string;
  setColorScheme: (scheme: string) => void;
  
  // Industry settings
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  
  // Business settings
  businessName: string;
  setBusinessName: (name: string) => void;
  businessDescription: string;
  setBusinessDescription: (description: string) => void;
  
  // Feature settings
  features: {
    appointmentBooking: boolean;
    inventoryTracking: boolean;
    timeTracking: boolean;
    clientPortal: boolean;
    mobileApp: boolean;
    customFields: boolean;
  };
  setFeatures: (features: any) => void;
  
  // Save settings
  saveSettings: () => void;
  loadSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState('blue');
  const [selectedIndustry, setSelectedIndustry] = useState('healthcare');
  const [businessName, setBusinessName] = useState('Your Business Name');
  const [businessDescription, setBusinessDescription] = useState('');
  const [features, setFeatures] = useState({
    appointmentBooking: true,
    inventoryTracking: false,
    timeTracking: true,
    clientPortal: false,
    mobileApp: true,
    customFields: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Apply theme changes to CSS variables
  useEffect(() => {
    applyTheme(colorScheme);
  }, [colorScheme]);

  const applyTheme = (scheme: string) => {
    const root = document.documentElement;
    
    // Define color schemes
    const colorSchemes: { [key: string]: any } = {
      blue: {
        primary: '59 130 246', // blue-500
        primaryDark: '37 99 235', // blue-600
        accent: '147 197 253', // blue-300
        gradient: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))'
      },
      emerald: {
        primary: '16 185 129', // emerald-500
        primaryDark: '5 150 105', // emerald-600
        accent: '110 231 183', // emerald-300
        gradient: 'linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))'
      },
      purple: {
        primary: '168 85 247', // purple-500
        primaryDark: '147 51 234', // purple-600
        accent: '196 181 253', // purple-300
        gradient: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(147, 51, 234))'
      },
      orange: {
        primary: '249 115 22', // orange-500
        primaryDark: '234 88 12', // orange-600
        accent: '253 186 116', // orange-300
        gradient: 'linear-gradient(135deg, rgb(249, 115, 22), rgb(234, 88, 12))'
      },
      cyan: {
        primary: '6 182 212', // cyan-500
        primaryDark: '8 145 178', // cyan-600
        accent: '103 232 249', // cyan-300
        gradient: 'linear-gradient(135deg, rgb(6, 182, 212), rgb(8, 145, 178))'
      },
      pink: {
        primary: '236 72 153', // pink-500
        primaryDark: '219 39 119', // pink-600
        accent: '249 168 212', // pink-300
        gradient: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))'
      },
      yellow: {
        primary: '234 179 8', // yellow-500
        primaryDark: '202 138 4', // yellow-600
        accent: '254 240 138', // yellow-300
        gradient: 'linear-gradient(135deg, rgb(234, 179, 8), rgb(202, 138, 4))'
      },
      slate: {
        primary: '100 116 139', // slate-500
        primaryDark: '71 85 105', // slate-600
        accent: '148 163 184', // slate-400
        gradient: 'linear-gradient(135deg, rgb(100, 116, 139), rgb(71, 85, 105))'
      }
    };

    const selectedScheme = colorSchemes[scheme] || colorSchemes.blue;
    
    // Set CSS custom properties
    root.style.setProperty('--color-primary', selectedScheme.primary);
    root.style.setProperty('--color-primary-dark', selectedScheme.primaryDark);
    root.style.setProperty('--color-accent', selectedScheme.accent);
    root.style.setProperty('--gradient-primary', selectedScheme.gradient);
  };

  const saveSettings = () => {
    const settings = {
      colorScheme,
      selectedIndustry,
      businessName,
      businessDescription,
      features,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('autoflow-settings', JSON.stringify(settings));
    
    // Show success message
    const event = new CustomEvent('settings-saved', { detail: settings });
    window.dispatchEvent(event);
  };

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('autoflow-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setColorScheme(settings.colorScheme || 'blue');
        setSelectedIndustry(settings.selectedIndustry || 'healthcare');
        setBusinessName(settings.businessName || 'Your Business Name');
        setBusinessDescription(settings.businessDescription || '');
        setFeatures(settings.features || {
          appointmentBooking: true,
          inventoryTracking: false,
          timeTracking: true,
          clientPortal: false,
          mobileApp: true,
          customFields: false,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const value = {
    colorScheme,
    setColorScheme,
    selectedIndustry,
    setSelectedIndustry,
    businessName,
    setBusinessName,
    businessDescription,
    setBusinessDescription,
    features,
    setFeatures,
    saveSettings,
    loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 