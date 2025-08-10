import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentForm } = useAppSelector(state => state.formBuilder);

  const navItems = [
    { path: '/create', label: 'Create Form' },
    { path: '/preview', label: 'Preview', disabled: !currentForm },
    { path: '/myforms', label: 'My Forms' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                disabled={item.disabled}
                variant={location.pathname === item.path ? 'contained' : 'text'}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 