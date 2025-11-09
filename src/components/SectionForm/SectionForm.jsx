// src/components/SectionForm/SectionForm.jsx
import React, { useState } from 'react';
import { createSection } from '../../services/sectionsService';
import { TextField, Button, Box, FormLabel, CircularProgress, Typography, Alert } from '@mui/material';

const SectionForm = ({ onSectionCreated }) => {
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNombreChange = (e) => {
    const newName = e.target.value;
    setNombre(newName);

    const newSlug = newName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina tildes
      .replace(/[^a-z0-9]+/g, '-')     // reemplaza espacios y caracteres raros por "-"
      .replace(/^-+|-+$/g, '');        // elimina guiones al inicio o final

    setSlug(newSlug); // ✅ aquí actualizamos el slug
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createSection(nombre, slug, color);
      setLoading(false);
      setNombre('');
      setSlug('');
      setColor('#ffffff');
      if (onSectionCreated) {
        onSectionCreated();
      }
    } catch (err) {
      setError("Error al crear la sección: " + err.message);
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Nueva Sección</Typography>

      <TextField
        label="Nombre de Sección"
        value={nombre}
        onChange={handleNombreChange}
        placeholder="Ej. Tecnología"
        fullWidth
        required
        margin="normal"
      />

      <TextField
        label="Slug (auto-generado)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="ej. tecnologia"
        fullWidth
        required
        margin="normal"
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <FormLabel>Color de la Sección:</FormLabel>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginLeft: '10px', width: '50px', height: '30px', border: 'none' }}
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : null}
      >
        {loading ? 'Creando...' : 'Crear Sección'}
      </Button>
    </Box>
  );
};

export default SectionForm;
