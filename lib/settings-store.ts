import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SettingsState = {
  defaultCurrency: string
  defaultPaymentTerms: number
  compactView: boolean
  apiAccess: boolean
  dataExport: boolean
  notifications: {
    invoice: boolean
    payment: boolean
    workflow: boolean
    browser: boolean
  }
}

export type SettingsActions = {
  updateCurrency: (currency: string) => void
  updatePaymentTerms: (terms: number) => void
  toggleCompactView: () => void
  toggleApiAccess: () => void
  toggleDataExport: () => void
  toggleNotification: (type: keyof SettingsState['notifications']) => void
  resetSettings: () => void
}

// Default settings
const defaultSettings: SettingsState = {
  defaultCurrency: 'USD',
  defaultPaymentTerms: 30,
  compactView: false,
  apiAccess: false,
  dataExport: false,
  notifications: {
    invoice: true,
    payment: true,
    workflow: false,
    browser: false,
  },
}

// Create the store with persistence
export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      // Currency
      updateCurrency: (currency) => set({ defaultCurrency: currency }),
      
      // Payment terms
      updatePaymentTerms: (terms) => set({ defaultPaymentTerms: terms }),
      
      // Display
      toggleCompactView: () => set((state) => ({ compactView: !state.compactView })),
      
      // Advanced
      toggleApiAccess: () => set((state) => ({ apiAccess: !state.apiAccess })),
      toggleDataExport: () => set((state) => ({ dataExport: !state.dataExport })),
      
      // Notifications
      toggleNotification: (type) => set((state) => ({
        notifications: {
          ...state.notifications,
          [type]: !state.notifications[type],
        },
      })),
      
      // Reset to defaults
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'autoflow-settings',
    }
  )
) 