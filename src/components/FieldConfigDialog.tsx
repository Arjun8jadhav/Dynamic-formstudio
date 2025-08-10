import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Chip,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FormField, FieldType, ValidationRule } from '../types';

interface FieldConfigDialogProps {
  open: boolean;
  field: FormField | null;
  onSave: (field: FormField) => void;
  onClose: () => void;
  existingFields: FormField[];
}

const FieldConfigDialog: React.FC<FieldConfigDialogProps> = ({
  open,
  field,
  onSave,
  onClose,
  existingFields,
}) => {
  const [formData, setFormData] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false,
    defaultValue: '',
    validationRules: [],
    isDerived: false,
    parentFields: [],
    derivedFormula: '',
    options: [],
  });

  const [newOption, setNewOption] = useState('');
  const [newValidationRule, setNewValidationRule] = useState<Partial<ValidationRule>>({
    type: 'required',
    message: '',
  });

  useEffect(() => {
    if (field) {
      setFormData(field);
    } else {
      setFormData({
        type: 'text',
        label: '',
        required: false,
        defaultValue: '',
        validationRules: [],
        isDerived: false,
        parentFields: [],
        derivedFormula: '',
        options: [],
      });
    }
    // Reset validation rule and option inputs
    setNewValidationRule({ type: 'required', message: '' });
    setNewOption('');
  }, [field, open]);

  // Additional reset when dialog opens for new field
  useEffect(() => {
    if (open && !field) {
      setFormData({
        type: 'text',
        label: '',
        required: false,
        defaultValue: '',
        validationRules: [],
        isDerived: false,
        parentFields: [],
        derivedFormula: '',
        options: [],
      });
      setNewValidationRule({ type: 'required', message: '' });
      setNewOption('');
    }
  }, [open, field]);

  const resetForm = () => {
    setFormData({
      type: 'text',
      label: '',
      required: false,
      defaultValue: '',
      validationRules: [],
      isDerived: false,
      parentFields: [],
      derivedFormula: '',
      options: [],
    });
    setNewValidationRule({ type: 'required', message: '' });
    setNewOption('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (formData.label && formData.type) {
      const fieldToSave: FormField = {
        id: field?.id || '',
        type: formData.type as FieldType,
        label: formData.label,
        required: formData.required || false,
        defaultValue: formData.defaultValue,
        validationRules: formData.validationRules || [],
        isDerived: formData.isDerived || false,
        parentFields: formData.parentFields || [],
        derivedFormula: formData.derivedFormula,
        options: formData.options || [],
        order: field?.order || 0,
      };
      onSave(fieldToSave);
    }
  };

  const addValidationRule = () => {
    if (newValidationRule.type && newValidationRule.message) {
      const rule: ValidationRule = {
        type: newValidationRule.type as ValidationRule['type'],
        value: newValidationRule.value,
        message: newValidationRule.message,
      };
      setFormData(prev => ({
        ...prev,
        validationRules: [...(prev.validationRules || []), rule],
      }));
      setNewValidationRule({ type: 'required', message: '' });
    }
  };

  const removeValidationRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      validationRules: prev.validationRules?.filter((_, i) => i !== index) || [],
    }));
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()],
      }));
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleParentFieldChange = (fieldId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      parentFields: checked
        ? [...(prev.parentFields || []), fieldId]
        : (prev.parentFields || []).filter(id => id !== fieldId),
    }));
  };

  const isFormValid = formData.label && formData.type;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{field ? 'Edit Field' : 'Add New Field'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Field Label"
              value={formData.label || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={formData.type || 'text'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as FieldType }))}
                label="Field Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="textarea">Textarea</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="radio">Radio</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Default Value"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.required || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                />
              }
              label="Required"
            />
          </Grid>

          {/* Options for select/radio fields */}
          {(formData.type === 'select' || formData.type === 'radio') && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Options
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  label="Add Option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addOption()}
                />
                <Button variant="outlined" onClick={addOption} startIcon={<AddIcon />}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.options?.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    onDelete={() => removeOption(index)}
                    deleteIcon={<DeleteIcon />}
                  />
                ))}
              </Box>
            </Grid>
          )}

          {/* Derived Field Configuration */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDerived || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDerived: e.target.checked }))}
                />
              }
              label="Derived Field"
            />
          </Grid>

          {formData.isDerived && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Parent Fields
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {existingFields
                    .filter(f => !f.isDerived && f.id !== field?.id)
                    .map(f => (
                      <Chip
                        key={f.id}
                        label={f.label}
                        onClick={() => handleParentFieldChange(f.id, true)}
                        onDelete={() => handleParentFieldChange(f.id, false)}
                        color={formData.parentFields?.includes(f.id) ? 'primary' : 'default'}
                        variant={formData.parentFields?.includes(f.id) ? 'filled' : 'outlined'}
                      />
                    ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Derived Formula/Logic"
                  value={formData.derivedFormula || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, derivedFormula: e.target.value }))}
                  placeholder="e.g., Age calculation from Date of Birth"
                  helperText="Describe how this field's value should be computed from parent fields"
                />
              </Grid>
            </>
          )}

          {/* Validation Rules */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Validation Rules
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={newValidationRule.type || 'required'}
                  onChange={(e) => setNewValidationRule(prev => ({ ...prev, type: e.target.value as ValidationRule['type'] }))}
                  label="Rule Type"
                >
                  <MenuItem value="required">Required</MenuItem>
                  <MenuItem value="minLength">Min Length</MenuItem>
                  <MenuItem value="maxLength">Max Length</MenuItem>
                  <MenuItem value="email">Email Format</MenuItem>
                  <MenuItem value="password">Password Rules</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
              {newValidationRule.type !== 'required' && (
                <TextField
                  size="small"
                  label="Value"
                  value={newValidationRule.value || ''}
                  onChange={(e) => setNewValidationRule(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={newValidationRule.type === 'minLength' ? '8' : 'Custom rule'}
                />
              )}
              <TextField
                size="small"
                label="Error Message"
                value={newValidationRule.message || ''}
                onChange={(e) => setNewValidationRule(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Validation error message"
              />
              <Button variant="outlined" onClick={addValidationRule} startIcon={<AddIcon />}>
                Add Rule
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.validationRules?.map((rule, index) => (
                <Chip
                  key={index}
                  label={`${rule.type}: ${rule.message}`}
                  onDelete={() => removeValidationRule(index)}
                  deleteIcon={<DeleteIcon />}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!isFormValid}>
          {field ? 'Update' : 'Add'} Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldConfigDialog; 