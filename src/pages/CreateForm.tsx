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
import { Add as AddIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCurrentForm, addField, updateField, removeField, saveForm } from '../store/formBuilderSlice';
import { Form, FormField, FieldType, ValidationRule } from '../types';
import FieldConfigDialog from '../components/FieldConfigDialog';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    setEditingField(null);
    setShowFieldDialog(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setShowFieldDialog(true);
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(removeField(fieldId));
  };

  const handleSaveField = (field: FormField) => {
    if (editingField) {
      dispatch(updateField({ id: editingField.id, updates: field }));
    } else {
      const newField: FormField = {
        ...field,
        id: Date.now().toString(),
        order: currentForm?.fields.length || 0,
      };
      dispatch(addField(newField));
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

  const handleDragEnd = (result: any) => {
    if (!result.destination || !currentForm) return;

    const fields = Array.from(currentForm.fields);
    const [reorderedField] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, reorderedField);

    // Update order numbers
    fields.forEach((field, index) => {
      field.order = index;
    });

    dispatch(setCurrentForm({ ...currentForm, fields }));
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
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided: any) => (
                      <Box {...provided.droppableProps} ref={provided.innerRef}>
                        {currentForm.fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided: any) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                sx={{ mb: 2, p: 2 }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box {...provided.dragHandleProps}>
                                    <DragIcon color="action" />
                                  </Box>
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
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
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