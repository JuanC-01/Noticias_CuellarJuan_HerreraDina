// src/pages/GestionarSecciones/GestionarSecciones.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardActions, Button,
  CircularProgress, Divider, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, Snackbar, Alert, FormLabel
} from '@mui/material';
import { getSections, updateSection, deleteSection } from '../../services/sectionsService';
import SectionForm from '../../components/SectionForm/SectionForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const GestionarSecciones = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editFormData, setEditFormData] = useState({ nombre: '', slug: '', color: '#ffffff' });
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const cargarSecciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSections();
      setSections(data);
    } catch (err) {
      setError("Error al cargar secciones.");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { cargarSecciones(); }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleEditClick = (section) => {
    setEditingSectionId(section.id);
    setEditFormData({ nombre: section.nombre, slug: section.slug, color: section.color || '#ffffff' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'nombre') {
      const newSlug = value
        .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setEditFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };

  const handleColorChange = (e) => {
    setEditFormData(prev => ({ ...prev, color: e.target.value }));
  };

  const handleSaveEdit = async () => {
    if (!editFormData.nombre || !editFormData.slug) {
      setSnackbarMessage('Nombre y Slug no pueden estar vacíos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      await updateSection(editingSectionId, editFormData);
      setSnackbarMessage('Sección actualizada con éxito.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setEditingSectionId(null);
      cargarSecciones();
    } catch (err) {
      setSnackbarMessage('Error al actualizar la sección.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error(err);
    }
    setLoading(false);
  };

  const handleCancelEdit = () => setEditingSectionId(null);

  const handleDeleteClick = (sectionId) => {
    setDeletingSectionId(sectionId);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setDeletingSectionId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSectionId) return;
    setLoading(true);
    try {
      await deleteSection(deletingSectionId);
      setSnackbarMessage('Sección eliminada con éxito.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDeleteConfirm();
      cargarSecciones();
    } catch (err) {
      setSnackbarMessage('Error al eliminar la sección.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error(err);
      handleCloseDeleteConfirm();
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Gestión de Secciones
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* === FORMULARIO A LA IZQUIERDA === */}
        <Grid item xs={12} md={4} lg={3}>
          <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Crear nueva sección
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <SectionForm onSectionCreated={() => {
              setSnackbarMessage('Sección creada con éxito.');
              setSnackbarSeverity('success');
              setSnackbarOpen(true);
              cargarSecciones();
            }} />
          </Card>
        </Grid>

        {/* === LISTADO DE SECCIONES === */}
        <Grid item xs={12} md={8} lg={9}>
          {loading && sections.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sections.length > 0 ? (
                sections.map((sec) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={sec.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        bgcolor: '#fff',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                      }}
                    >
                      {editingSectionId === sec.id ? (
                        <CardContent>
                          <TextField
                            name="nombre"
                            label="Nombre"
                            value={editFormData.nombre}
                            onChange={handleEditChange}
                            fullWidth size="small" sx={{ mb: 1 }}
                          />
                          <TextField
                            name="slug"
                            label="Slug"
                            value={editFormData.slug}
                            onChange={handleEditChange}
                            fullWidth size="small" sx={{ mb: 1 }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <FormLabel sx={{ mr: 1 }}>Color:</FormLabel>
                            <input
                              type="color"
                              name="color"
                              value={editFormData.color}
                              onChange={handleColorChange}
                              style={{ width: '40px', height: '25px', border: 'none' }}
                            />
                          </Box>
                        </CardContent>
                      ) : (
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Box sx={{
                              width: 16, height: 16, bgcolor: sec.color || '#ccc',
                              borderRadius: '50%', mr: 1, border: '1px solid #ddd'
                            }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {sec.nombre}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Slug: <code>{sec.slug}</code>
                          </Typography>
                        </CardContent>
                      )}

                      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                        {editingSectionId === sec.id ? (
                          <>
                            <Button size="small" color="inherit" startIcon={<CancelIcon />} onClick={handleCancelEdit}>Cancelar</Button>
                            <Button size="small" color="primary" variant="contained" startIcon={<SaveIcon />} onClick={handleSaveEdit}>Guardar</Button>
                          </>
                        ) : (
                          <>
                            <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(sec)}>Editar</Button>
                            <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(sec.id)}>Eliminar</Button>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1" sx={{ mt: 2, ml: 2, color: 'text.secondary' }}>
                  No hay secciones creadas.
                </Typography>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* === Diálogo de Confirmación === */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar esta sección? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* === Snackbar === */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GestionarSecciones;
