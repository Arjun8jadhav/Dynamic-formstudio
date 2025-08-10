export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'custom';
  value?: string | number;
  message: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  validationRules: ValidationRule[];
  isDerived: boolean;
  parentFields?: string[];
  derivedFormula?: string;
  options?: string[]; // For select, radio fields
  order: number;
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormBuilderState {
  currentForm: Form | null;
  savedForms: Form[];
  isPreviewMode: boolean;
} 