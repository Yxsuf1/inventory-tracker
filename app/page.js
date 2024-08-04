'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Card, CardContent, CardActions, IconButton } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: existingQuantity + quantity })
    } else {
      await setDoc(docRef, { quantity })
    }
    await updateInventory()
  }

  const updateItem = async (item, quantity) => {
    if (quantity === 0) {
      await removeItem(item)
    } else {
      const docRef = doc(collection(firestore, 'inventory'), item)
      await setDoc(docRef, { quantity })
      await updateInventory()
    }
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await deleteDoc(docRef)
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = (item = null) => {
    if (item) {
      setItemName(item.name)
      setItemQuantity(item.quantity)
      setIsEditing(true)
      setCurrentItem(item.name)
    } else {
      setItemName('')
      setItemQuantity(0)
      setIsEditing(false)
      setCurrentItem(null)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setItemName('')
    setItemQuantity(0)
    setIsEditing(false)
    setCurrentItem(null)
  }

  const handleSubmit = () => {
    if (isEditing) {
      updateItem(currentItem, itemQuantity)
    } else {
      addItem(itemName, itemQuantity)
    }
    handleClose()
  }

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      padding={2}
      sx={{
        background: 'linear-gradient(to right, #ece9e6, #ffffff)',
      }}
    >
      <Typography variant="h3" component="h1" sx={{ marginBottom: 4 }}>
        Inventory Tracker
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isEditing ? 'Update Item' : 'Add Item'}
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              disabled={isEditing}
            />
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              fullWidth
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
            />
            <Button
              variant="contained"
              color={isEditing ? 'primary' : 'secondary'}
              onClick={handleSubmit}
            >
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="800px">
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Item
      </Button>
      <Box
        display={'flex'}
        flexWrap={'wrap'}
        justifyContent={'center'}
        gap={2}
        padding={2}
      >
        {filteredInventory.map(({ name, quantity }) => (
          <Card key={name} sx={{ width: 300, bgcolor: '#e0f7fa' }}>
            <CardContent>
              <Typography variant={'h5'} component="div">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'body2'} color="text.secondary">
                Quantity: {quantity}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                aria-label="edit"
                onClick={() => handleOpen({ name, quantity })}
                sx={{ color: 'primary.main' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => removeItem(name)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
