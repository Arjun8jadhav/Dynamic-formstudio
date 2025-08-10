import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography as MuiTypography,
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as ViewIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadForm, deleteForm, setCurrentForm } from '../store/formBuilderSlice';
import { Form } from '../types';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { savedForms } = useAppSelector(state => state.formBuilder);
  const [deleteDialog, setDeleteDialog] = React.useState<{ open: boolean; form: Form | null }>({
    open: false,
    form: null,
  });

  const handleViewForm = (form: Form) => {
    dispatch(loadForm(form.id));
    navigate('/preview');
  };

  const handleEditForm = (form: Form) => {
    dispatch(setCurrentForm(form));
    navigate('/create');
  };

  const handleDeleteForm = (form: Form) => {
    setDeleteDialog({ open: true, form });
  };

  const confirmDelete = () => {
    if (deleteDialog.form) {
      dispatch(deleteForm(deleteDialog.form.id));
      setDeleteDialog({ open: false, form: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldTypeCounts = (form: Form) => {
    const counts: { [key: string]: number } = {};
    form.fields.forEach(field => {
      counts[field.type] = (counts[field.type] || 0) + 1;
    });
    return counts;
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Forms
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          No forms have been created yet. Go to the Create Form page to build your first form!
        </Alert>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/create')}
          sx={{ mt: 3 }}
        >
          Create Your First Form
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Forms ({savedForms.length})
      </Typography>

      <Grid container spacing={3}>
        {savedForms.map((form) => {
          const fieldCounts = getFieldTypeCounts(form);
          const requiredFields = form.fields.filter(f => f.required).length;
          const derivedFields = form.fields.filter(f => f.isDerived).length;

          return (
            <Grid item xs={12} md={6} lg={4} key={form.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {form.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created: {formatDate(form.createdAt)}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Fields:</strong> {form.fields.length}
                    </Typography>
                    
                    {requiredFields > 0 && (
                      <Chip
                        label={`${requiredFields} Required`}
                        size="small"
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )}
                    
                    {derivedFields > 0 && (
                      <Chip
                        label={`${derivedFields} Derived`}
                        size="small"
                        color="secondary"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Field Types:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {Object.entries(fieldCounts).map(([type, count]) => (
                        <Chip
                          key={type}
                          label={`${type}: ${count}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => handleViewForm(form)}
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditForm(form)}
                    >
                      Edit
                    </Button>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteForm(form)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, form: null })}>
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <MuiTypography>
            Are you sure you want to delete "{deleteDialog.form?.name}"? This action cannot be undone.
          </MuiTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, form: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyForms; 