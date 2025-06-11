// src/pages/ManageProductTabs.jsx

import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ManageProducts from './ManageProducts';
import EditDeleteProducts from './EditDeleteProducts';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ManageOrders from './ManageOrders';

const ManageProductTabs = () => {
  const [selectedTab, setSelectedTab] = useState(location.state?.selectedTab || 0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', padding: 1 }}>
      <Tabs value={selectedTab} onChange={handleChange} aria-label="Product Tabs" textColor="#994ECC" variant="scrollable"              // Enables horizontal scroll
  scrollButtons="auto"// or "primary"
  indicatorColor="secondary" // changes the indicator line
  sx={{
    overflowX: 'auto', 
    '& .MuiTab-root': {
      color: '#553C8B',
      whiteSpace: 'nowrap', // default text color
    },
    '& .Mui-selected': {
      color: '#553C8B', // selected tab label color
      fontWeight: 'bold',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#553C8B', // indicator line color
    },
  }}>
        <Tab label="Add Product"/>
        <Tab label="Edit/Delete Product"/>
        <Tab label="Manage Orders"/>
      </Tabs>

      <Box sx={{ marginTop: 1 }}>
        {selectedTab === 0 && <ManageProducts />}
        {selectedTab === 1 && <EditDeleteProducts />}
        {selectedTab === 2 && <ManageOrders />}
      </Box>
    </Box>
  );
};

export default ManageProductTabs;
