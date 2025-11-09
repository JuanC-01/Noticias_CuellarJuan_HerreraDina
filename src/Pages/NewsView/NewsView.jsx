// src/Pages/NewsView/NewsView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getNewsById } from '../../services/newsService';
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, Divider, Button, Alert, Container, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NewsView = () => {
    const [noticia, setNoticia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getNewsById(id);
                if (data && data.estado === 'publicado') {
                    setNoticia(data);
                } else {
                    setError('Noticia no encontrada o no disponible.');
                }
            } catch (err) {
                console.error(err);
                setError('Error al cargar la noticia.');
            }
            setLoading(false);
        };
        fetchNews();
    }, [id]);
    const formatFecha = (timestamp) => {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toLocaleString('es-ES', {
                dateStyle: 'long',
                timeStyle: 'short',
            });
        }
        return 'Fecha no disponible';
    };
    const capitalizar = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 6 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    component={RouterLink}
                    to="/"
                >
                    Volver al inicio
                </Button>
            </Container>
        );
    }
    if (!noticia) return null;
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                }}
            >
                {noticia.imagenURL && (
                    <CardMedia
                        component="img"
                        height="500"
                        image={noticia.imagenURL}
                        alt={noticia.titulo}
                        sx={{
                            objectFit: 'cover',
                            borderBottom: '2px solid #eee',
                        }}
                    />
                )}
                <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {noticia.titulo}
                    </Typography>

                    {noticia.subtitulo && (
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {noticia.subtitulo}
                        </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Autor: <strong>{noticia.autorNombre || noticia.autorEmail}</strong> · Publicado el{' '}
                        {formatFecha(noticia.fechaCreacion)}
                    </Typography>
                    {noticia.categoria && (
                        <Chip
                            label={capitalizar(noticia.categoria)}
                            color="primary"
                            size="small"
                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                        />
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.8,
                            fontSize: '1.05rem',
                            color: 'text.primary',
                        }}
                    >
                        {noticia.contenido}
                    </Typography>
                </CardContent>
            </Card>
            <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    component={RouterLink}
                    to="/"
                >
                    Volver
                </Button>
            </Box>
        </Container>
    );
};

export default NewsView;