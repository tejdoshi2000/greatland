import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, Typography, Grid, Snackbar, Alert, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';

interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface Props {
  propertyId: string;
  propertyAddress: string;
}

const PropertyViewingSlots: React.FC<Props> = ({ propertyId, propertyAddress }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', familySize: '', cell: '', hasApplication: 'no' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetch(`/api/properties/${propertyId}/slots`)
      .then(res => res.json())
      .then(data => setSlots(data));
  }, [propertyId]);

  const handleBook = (slot: Slot) => {
    setSelectedSlot(slot);
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    const res = await fetch(`/api/properties/${propertyId}/slots/${selectedSlot._id}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSnackbar({ open: true, message: 'Slot booked successfully!', severity: 'success' });
      setSlots(slots.filter(s => s._id !== selectedSlot._id));
      setOpen(false);
    } else {
      setSnackbar({ open: true, message: 'Failed to book slot.', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Available Viewing Slots</Typography>
      <Grid container spacing={2}>
        {slots.map(slot => (
          <Grid item key={slot._id} xs={12} sm={6} md={4} lg={3}>
            <Box
              border={1}
              borderRadius={2}
              p={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
              bgcolor="#f5faff"
              boxShadow={2}
              sx={{
                minWidth: 200,
                mb: 2,
                borderColor: 'primary.light',
              }}
            >
              <Typography variant="subtitle2" color="primary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
                {slot.date}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                {slot.startTime} - {slot.endTime}
              </Typography>
              <Button variant="contained" onClick={() => handleBook(slot)} size="small">
                Book
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Book Viewing Slot</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField label="Your Name" name="name" value={form.name} onChange={handleChange} fullWidth required margin="normal" />
            <TextField label="Family Size" name="familySize" value={form.familySize} onChange={handleChange} fullWidth required margin="normal" type="number" />
            <TextField label="Cell" name="cell" value={form.cell} onChange={handleChange} fullWidth required margin="normal" />
            <RadioGroup row name="hasApplication" value={form.hasApplication} onChange={handleChange}>
              <FormControlLabel value="yes" control={<Radio />} label="Already generated application" />
              <FormControlLabel value="no" control={<Radio />} label="Not yet generated application" />
            </RadioGroup>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Book Slot</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertyViewingSlots; 