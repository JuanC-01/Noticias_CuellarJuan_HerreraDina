// src/components/NewsForm/NewsForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSections } from '../../services/sectionsService';
import { uploadNewsImage, createNews, getNewsById, updateNews } from '../../services/newsService';
import { serverTimestamp } from 'firebase/firestore';
import { Container, Paper, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Alert, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { Save, Cancel, UploadFile } from '@mui/icons-material';

const NewsForm = () => {
    const { noticiaId } = useParams();
    const modoEdicion = Boolean(noticiaId);
    const navigate = useNavigate();
    const { currentUser, userData } = useAuth();
    const [titulo, setTitulo] = useState('');
    const [subtitulo, setSubtitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [destacada, setDestacada] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const cats = await getSections();
            setCategories(cats);
            if (!modoEdicion && cats.length > 0) {
                setCategoria(cats[0].slug);
            }
        };
        fetchCategories();
    }, [modoEdicion]);

    useEffect(() => {
        if (modoEdicion) {
            setLoading(true);
            const fetchNewsData = async () => {
                try {
                    const newsData = await getNewsById(noticiaId);
                    if (newsData) {
                        setTitulo(newsData.titulo);
                        setSubtitulo(newsData.subtitulo);
                        setContenido(newsData.contenido);
                        setCategoria(newsData.categoria);
                        setImagePreview(newsData.imagenURL);
                        setDestacada(newsData.destacada || false);
                    } else {
                        setError("No se encontró la noticia para editar.");
                    }
                } catch (err) {
                    setError("Error al cargar la noticia.");
                }
                setLoading(false);
            };
            fetchNewsData();
        }
    }, [noticiaId, modoEdicion]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!titulo || !categoria || !contenido) {
            setError("Título, Contenido y Categoría son obligatorios.");
            setLoading(false);
            return;
        }

        try {
            let finalImageURL = imagePreview;

            if (imageFile) {
                finalImageURL = await uploadNewsImage(imageFile);
            }

            if (!finalImageURL) {
                setError("Se requiere una imagen para la noticia.");
                setLoading(false);
                return;
            }
            const newsData = {
                titulo,
                subtitulo,
                contenido,
                categoria,
                imagenURL: finalImageURL,
                fechaActualizacion: serverTimestamp(),
                destacada: destacada,
            };

            if (modoEdicion) {
                await updateNews(noticiaId, newsData);
            } else {
                newsData.autorId = currentUser.uid;
                newsData.autorEmail = currentUser.email;
                newsData.autorNombre = userData.nombre;
                newsData.fechaCreacion = serverTimestamp();
                newsData.estado = "edicion";

                await createNews(newsData);
            }

            setLoading(false);
            navigate('/admin');

        } catch (err) {
            console.error(err);
            setError("Error al guardar la noticia.");
            setLoading(false);
        }
    };

    if (modoEdicion && loading && !titulo) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                        {modoEdicion ? 'Editar Noticia' : 'Crear Nueva Noticia'}
                    </Typography>

                    <TextField
                        label="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        margin="normal"
                        required
                        fullWidth
                        disabled={loading}
                    />

                    <TextField
                        label="Subtítulo (Bajante)"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        margin="normal"
                        fullWidth
                        disabled={loading}
                    />

                    <FormControl fullWidth margin="normal" required disabled={loading}>
                        <InputLabel id="categoria-label">Categoría</InputLabel>
                        <Select
                            labelId="categoria-label"
                            id="categoria-select"
                            value={categoria}
                            label="Categoría"
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.slug}>
                                    {cat.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Contenido"
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        margin="normal"
                        required
                        fullWidth
                        multiline
                        rows={10}
                        disabled={loading}
                    />

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFile />}
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        Subir Imagen
                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>

                    {imagePreview && (
                        <Box sx={{ mt: 2, border: '1px dashed grey', p: 1, width: 'fit-content' }}>
                            <Typography variant="caption">Vista previa:</Typography>
                            <img
                                src={imagePreview}
                                alt="Vista previa"
                                style={{ width: '200px', display: 'block' }}
                            />
                        </Box>
                    )}

                    {userData.rol === 'editor' && (
                        <Box sx={{ mt: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={destacada}
                                        onChange={(e) => setDestacada(e.target.checked)}
                                        name="destacada"
                                        color="primary"
                                        disabled={loading}
                                    />
                                }
                                label="Marcar como noticia destacada"
                            />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                        >
                            {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar Noticia' : 'Guardar')}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/admin')}
                            disabled={loading}
                            startIcon={<Cancel />}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default NewsForm;