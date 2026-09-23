import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SALON_CONFIG, SalonConfig } from '../config/salonConfig';

interface SalonConfigContextType {
  config: SalonConfig;
  updateSalonInfo: (updates: Partial<SalonConfig>) => void;
  resetToDefault: () => void;
  isEditModalOpen: boolean;
  openEditModal: () => void;
  closeEditModal: () => void;
}

const STORAGE_KEY = 'salon_branding_config_v1';

const SalonConfigContext = createContext<SalonConfigContextType | undefined>(undefined);

export const SalonConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SalonConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SALON_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read salon config from storage:', e);
    }
    return DEFAULT_SALON_CONFIG;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const updateSalonInfo = (updates: Partial<SalonConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      // Also generate shortName if not provided
      if (updates.name && !updates.shortName) {
        const words = updates.name.split(' ');
        next.shortName = words.slice(0, 3).join(' ').toUpperCase();
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not persist salon config:', e);
      }
      return next;
    });
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_SALON_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <SalonConfigContext.Provider
      value={{
        config,
        updateSalonInfo,
        resetToDefault,
        isEditModalOpen,
        openEditModal: () => setIsEditModalOpen(true),
        closeEditModal: () => setIsEditModalOpen(false),
      }}
    >
      {children}
    </SalonConfigContext.Provider>
  );
};

export const useSalonConfig = () => {
  const ctx = useContext(SalonConfigContext);
  if (!ctx) {
    throw new Error('useSalonConfig must be used within a SalonConfigProvider');
  }
  return ctx;
};
