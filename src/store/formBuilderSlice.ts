import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormBuilderState, Form, FormField } from '../types';
import { localStorageService } from '../services/localStorage';

const initialState: FormBuilderState = {
  currentForm: null,
  savedForms: localStorageService.loadForms(),
  isPreviewMode: false,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setCurrentForm: (state, action: PayloadAction<Form | null>) => {
      state.currentForm = action.payload;
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
        state.currentForm.fields.sort((a, b) => a.order - b.order);
      }
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = { ...state.currentForm.fields[fieldIndex], ...action.payload.updates };
        }
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      console.log('Removing field:', action.payload);
      if (state.currentForm) {
        console.log('Removing field:', action.payload);
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
      }
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const fields = [...state.currentForm.fields];
        const [movedField] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, movedField);
        
        // Update order numbers
        fields.forEach((field, index) => {
          field.order = index;
        });
        
        state.currentForm.fields = fields;
      }
    },
    saveForm: (state, action: PayloadAction<Form>) => {
      const existingIndex = state.savedForms.findIndex(f => f.id === action.payload.id);
      if (existingIndex !== -1) {
        state.savedForms[existingIndex] = action.payload;
      } else {
        state.savedForms.push(action.payload);
      }
      localStorageService.saveForms(state.savedForms);
      state.currentForm = null;
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
      localStorageService.saveForms(state.savedForms);
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.isPreviewMode = action.payload;
    },
    clearCurrentForm: (state) => {
      state.currentForm = null;
    },
  },
});

export const {
  setCurrentForm,
  addField,
  updateField,
  removeField,
  reorderFields,
  saveForm,
  loadForm,
  deleteForm,
  setPreviewMode,
  clearCurrentForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer; 