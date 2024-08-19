'use client'

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Card, CardContent, CardActions } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, query, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  // State management for inventory, modal visibility, and new item input
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);

  // Fetch inventory from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // Function to add a new item to the inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase()); // Make item name lowercase for consistency
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      // If the item exists, update its quantity
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      // If the item doesn't exist, create a new item with a quantity of 1
      await setDoc(docRef, { quantity: 1 });
    }
  
    await updateInventory(); // Refresh the inventory list after the item is added or updated
  };
  

  // Function to remove an item from the inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Modal open/close handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // JSX structure for rendering the UI
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5', // Light background color
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3, // Adds padding around the content
      }}
    >
      <Typography variant="h3" color="primary" gutterBottom>
        Inventory Management
      </Typography>
  
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3, borderRadius: 3 }}>
        Add New Item
      </Button>
  
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
  
      <Box width="100%" maxWidth="800px">
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ bgcolor: '#ADD8E6', textAlign: 'center', py: 2 }}>
            <Typography variant="h5" color="textSecondary">
              Inventory Items
            </Typography>
          </CardContent>
        </Card>
  
        <Stack spacing={2} sx={{ overflow: 'auto', maxHeight: '300px' }}>
          {inventory.map(({ name, quantity }) => (
            <Card key={name} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Quantity: {quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                  sx={{ ml: 'auto', mr: 2, borderRadius: 2 }}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
  
}

// ff
