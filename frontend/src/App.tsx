import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Blue color for water theme
    },
    secondary: {
      main: '#4caf50', // Green color for plants
    },
  },
});

// Lazy load components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const FacilityPlanning = React.lazy(() => import('./pages/FacilityPlanning'));
const ProductionPlanning = React.lazy(() => import('./pages/ProductionPlanning'));
const SalesPlanning = React.lazy(() => import('./pages/SalesPlanning'));
const FinancialPlanning = React.lazy(() => import('./pages/FinancialPlanning'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/facility-planning" element={<FacilityPlanning />} />
            <Route path="/production-planning" element={<ProductionPlanning />} />
            <Route path="/sales-planning" element={<SalesPlanning />} />
            <Route path="/financial-planning" element={<FinancialPlanning />} />
          </Routes>
        </React.Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
