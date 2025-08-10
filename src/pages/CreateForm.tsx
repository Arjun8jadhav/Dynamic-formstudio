import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCurrentForm, addField, updateField, removeField, saveForm } from '../store/formBuilderSlice';
import { Form, FormField, FieldType, ValidationRule } from '../types';
import FieldConfigDialog from '../components/FieldConfigDialog';

const CreateForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector(state => state.formBuilder);
  const [formName, setFormName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  useEffect(() => {
    if (!currentForm) {
      const newForm: Form = {
        id: Date.now().toString(),
        name: '',
        fields: [],
        createdAt: new Date().toISOString(),
      };
      dispatch(setCurrentForm(newForm));
    }
  }, [dispatch, currentForm]);

  const handleAddField = () => {
    // Ensure we're starting fresh
    setEditingField(null);
    // Small delay to ensure state is cleared before opening dialog
    setTimeout(() => {
      setShowFieldDialog(true);
    }, 0);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setShowFieldDialog(true);
  };

  const handleDeleteField = (fieldId: string) => {
    if (currentForm) {
      const updatedFields = currentForm.fields
        .filter(f => f.id !== fieldId)
        .map((field, index) => ({
          ...field,
          order: index
        }));
      dispatch(setCurrentForm({ ...currentForm, fields: updatedFields }));
    }
  };

  const handleSaveField = (field: FormField) => {
    if (currentForm) {
      if (editingField) {
        // Update existing field
        const updatedFields = currentForm.fields.map(f =>
          f.id === field.id ? { ...field, order: f.order } : f
        );
        dispatch(updateField({ id: editingField.id, updates: field }));
        dispatch(setCurrentForm({ ...currentForm, fields: updatedFields }));
      } else {
        // Add new field
        const newField: FormField = {
          ...field,
          id: Date.now().toString(),
          order: currentForm.fields.length,
        };
        dispatch(addField(newField));
        dispatch(setCurrentForm({ 
          ...currentForm, 
          fields: [...currentForm.fields, newField] 
        }));
      }
    }
    setShowFieldDialog(false);
    setEditingField(null);
  };

  const handleSaveForm = () => {
    if (formName.trim() && currentForm) {
      const formToSave: Form = {
        ...currentForm,
        name: formName.trim(),
      };
      dispatch(saveForm(formToSave));
      setShowSaveDialog(false);
      setFormName('');
    }
  };

  if (!currentForm) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Create Form
        </Typography>
        <Button
          variant="contained"
          onClick={() => setShowSaveDialog(true)}
          disabled={currentForm.fields.length === 0}
        >
          Save Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Form Fields</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddField}
                >
                  Add Field
                </Button>
              </Box>

              {currentForm.fields.length === 0 ? (
                <Alert severity="info">
                  No fields added yet. Click "Add Field" to start building your form.
                </Alert>
              ) : (
                <Box>
                  {currentForm.fields.map((field, index) => (
                    <Card key={field.id} sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1">
                            {field.label} ({field.type})
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            {field.required && <Chip label="Required" size="small" color="primary" />}
                            {field.isDerived && <Chip label="Derived" size="small" color="secondary" />}
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          onClick={() => handleEditField(field)}
                        >
                          Edit
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteField(field.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Form Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Fields: {currentForm.fields.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Required Fields: {currentForm.fields.filter(f => f.required).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Derived Fields: {currentForm.fields.filter(f => f.isDerived).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter form name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained" disabled={!formName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Configuration Dialog */}
      <FieldConfigDialog
        open={showFieldDialog}
        field={editingField}
        onSave={handleSaveField}
        onClose={() => {
          setShowFieldDialog(false);
          setEditingField(null);
        }}
        existingFields={currentForm.fields}
      />
    </Box>
  );
};

export default CreateForm; 