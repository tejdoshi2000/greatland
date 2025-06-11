import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Grid, IconButton, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Props {
  propertyId: string;
}

const AdminViewingSlots: React.FC<Props> = ({ propertyId }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/properties/${propertyId}/slots/all`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSlots(data);
        } else if (data && Array.isArray(data.slots)) {
          setSlots(data.slots);
        } else {
          setSlots([]);
        }
      })
      .catch(() => setSlots([]));
  }, [propertyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/properties/${propertyId}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newSlot = await res.json();
      setSlots([...slots, newSlot]);
      setForm({ date: '', startTime: '', endTime: '' });
      setSnackbar({ open: true, message: 'Slot added!', severity: 'success' });
    } else {
      const error = await res.json();
      setSnackbar({ open: true, message: error.error || 'Failed to add slot.', severity: 'error' });
    }
  };

  const handleDelete = async (slotId: string) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/properties/${propertyId}/slots/${slotId}`, { method: 'DELETE' });
    if (res.ok) {
      setSlots(slots.filter(s => s._id !== slotId));
      setSnackbar({ open: true, message: 'Slot deleted!', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Failed to delete slot.', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Manage Viewing Slots</Typography>
      <form onSubmit={handleAddSlot}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Time"
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Time"
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: '100%' }}>
              Add Slot
            </Button>
          </Grid>
        </Grid>
      </form>
      <Box mt={4}>
        <Typography variant="subtitle1" gutterBottom>All Viewing Slots</Typography>
        <Grid container spacing={2}>
          {slots.map(slot => (
            <Grid item key={slot._id} xs={12} sm={6} md={4}>
              <Box border={1} borderRadius={2} p={2} display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography>
                    {slot.date} {slot.startTime} - {slot.endTime}
                  </Typography>
                  <Typography color={slot.isBooked ? 'error' : 'success.main'}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleDelete(slot._id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminViewingSlots; 