import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Button,
  Alert,
  FormHelperText,
  Grid,
  Chip,
} from '@mui/material';
import { useAppSelector } from '../store/hooks';
import { FormField, ValidationRule } from '../types';

interface FormValues {
  [key: string]: string | number | boolean;
}

interface ValidationErrors {
  [key: string]: string[];
}

const PreviewForm: React.FC = () => {
  const { currentForm } = useAppSelector(state => state.formBuilder);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (currentForm) {
      const initialValues: FormValues = {};
      currentForm.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialValues[field.id] = field.defaultValue;
        } else {
          switch (field.type) {
            case 'checkbox':
              initialValues[field.id] = false;
              break;
            case 'radio':
              if (field.options && field.options.length > 0) {
                initialValues[field.id] = field.options[0];
              }
              break;
            default:
              initialValues[field.id] = '';
          }
        }
      });
      setFormValues(initialValues);
    }
  }, [currentForm]);

  useEffect(() => {
    if (currentForm) {
      // Update derived fields when parent fields change
      const derivedFields = currentForm.fields.filter(f => f.isDerived);
      derivedFields.forEach(field => {
        if (field.parentFields) {
          const parentValues = field.parentFields.map(parentId => formValues[parentId]);
          // Simple derived field logic - can be enhanced
          if (field.derivedFormula?.includes('Age') && field.parentFields.length > 0) {
            const dobValue = formValues[field.parentFields[0]];
            if (dobValue && typeof dobValue === 'string') {
              const dob = new Date(dobValue);
              const today = new Date();
              const age = today.getFullYear() - dob.getFullYear();
              setFormValues(prev => ({ ...prev, [field.id]: age.toString() }));
            }
          }
        }
      });
    }
  }, [formValues, currentForm]);

  const validateField = (field: FormField, value: any): string[] => {
    const fieldErrors: string[] = [];

    field.validationRules.forEach(rule => {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            fieldErrors.push(rule.message || 'This field is required');
          }
          break;
        case 'minLength':
          if (typeof value === 'string' && value.length < Number(rule.value)) {
            fieldErrors.push(rule.message || `Minimum length is ${rule.value} characters`);
          }
          break;
        case 'maxLength':
          if (typeof value === 'string' && value.length > Number(rule.value)) {
            fieldErrors.push(rule.message || `Maximum length is ${rule.value} characters`);
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (value && !emailRegex.test(value)) {
            fieldErrors.push(rule.message || 'Please enter a valid email address');
          }
          break;
        case 'password':
          if (value) {
            if (value.length < 8) {
              fieldErrors.push('Password must be at least 8 characters long');
            }
            if (!/\d/.test(value)) {
              fieldErrors.push('Password must contain at least one number');
            }
          }
          break;
        case 'custom':
          // Custom validation logic can be added here
          break;
      }
    });

    return fieldErrors;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    
    // Validate field
    const field = currentForm?.fields.find(f => f.id === fieldId);
    if (field) {
      const fieldErrors = validateField(field, value);
      setErrors(prev => ({ ...prev, [fieldId]: fieldErrors }));
    }
  };

  const handleFieldBlur = (fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentForm) return;

    // Validate all fields
    const allErrors: ValidationErrors = {};
    let hasErrors = false;

    currentForm.fields.forEach(field => {
      const fieldErrors = validateField(field, formValues[field.id]);
      if (fieldErrors.length > 0) {
        allErrors[field.id] = fieldErrors;
        hasErrors = true;
      }
    });

    setErrors(allErrors);
    setTouched(prev => {
      const newTouched: { [key: string]: boolean } = {};
      currentForm.fields.forEach(field => {
        newTouched[field.id] = true;
      });
      return newTouched;
    });

    if (!hasErrors) {
      alert('Form submitted successfully!');
      console.log('Form values:', formValues);
    }
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.id];
    const fieldErrors = errors[field.id] || [];
    const isTouched = touched[field.id];
    const showErrors = isTouched && fieldErrors.length > 0;

    const commonProps = {
      fullWidth: true,
      label: field.label,
      value: value || '',
      onChange: (e: any) => handleFieldChange(field.id, e.target.value),
      onBlur: () => handleFieldBlur(field.id),
      error: showErrors,
      helperText: showErrors ? fieldErrors[0] : '',
      disabled: field.isDerived,
    };

    switch (field.type) {
      case 'text':
        return <TextField {...commonProps} type="text" />;
      
      case 'number':
        return <TextField {...commonProps} type="number" />;
      
      case 'textarea':
        return <TextField {...commonProps} multiline rows={4} />;
      
      case 'text':
        // Check if this field has email validation
        const hasEmailValidation = field.validationRules.some(rule => rule.type === 'email');
        return <TextField {...commonProps} type={hasEmailValidation ? 'email' : 'text'} />;
      
      case 'date':
        return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />;
      
      case 'select':
        return (
          <FormControl fullWidth error={showErrors}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value as string)}
              onBlur={() => handleFieldBlur(field.id)}
              label={field.label}
              disabled={field.isDerived}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {showErrors && <FormHelperText>{fieldErrors[0]}</FormHelperText>}
          </FormControl>
        );
      
      case 'radio':
        return (
          <FormControl error={showErrors}>
            <Typography variant="subtitle2" gutterBottom>
              {field.label}
            </Typography>
            <RadioGroup
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {showErrors && <FormHelperText>{fieldErrors[0]}</FormHelperText>}
          </FormControl>
        );
      
      case 'checkbox':
        return (
          <FormControl error={showErrors}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(value)}
                  onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                  disabled={field.isDerived}
                />
              }
              label={field.label}
            />
            {showErrors && <FormHelperText>{fieldErrors[0]}</FormHelperText>}
          </FormControl>
        );
      
      default:
        return <TextField {...commonProps} />;
    }
  };

  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="info">
          No form to preview. Please create a form first.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Preview: {currentForm.name}
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This is how your form will appear to end users. All validation rules and derived fields are active.
          </Typography>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {currentForm.fields.map((field) => (
            <Grid item xs={12} key={field.id}>
              <Card>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {renderField(field)}
                    {field.isDerived && (
                      <Box sx={{ mt: 1 }}>
                        <Chip label="Derived Field" size="small" color="secondary" />
                        {field.derivedFormula && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            Formula: {field.derivedFormula}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button type="submit" variant="contained" size="large">
            Submit Form
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PreviewForm; 