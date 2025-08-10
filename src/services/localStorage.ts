import { Form } from '../types';

const FORMS_STORAGE_KEY = 'formBuilder_forms';

export const localStorageService = {
  saveForms: (forms: Form[]): void => {
    try {
      localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
    } catch (error) {
      console.error('Error saving forms to localStorage:', error);
    }
  },

  loadForms: (): Form[] => {
    try {
      const stored = localStorage.getItem(FORMS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading forms from localStorage:', error);
      return [];
    }
  },

  clearForms: (): void => {
    try {
      localStorage.removeItem(FORMS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing forms from localStorage:', error);
    }
  },
}; 