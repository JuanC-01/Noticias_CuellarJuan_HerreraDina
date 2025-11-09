import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CardActions,
    Chip,
    Box,
    Skeleton,
} from '@mui/material';
import { Edit, Publish, Block, Restore } from '@mui/icons-material';
import { getAllNews, updateNewsStatus } from '../../services/newsService';
import { createNotification } from '../../services/notificationsService';
import { useAuth } from '../../context/AuthContext';
import { getNewsById } from '../../services/newsService'; 


const EditorPanel = () => {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser, userData } = useAuth();


    const cargarNoticias = async () => {
        setLoading(true);
        const newsList = await getAllNews();

        newsList.sort(
            (a, b) =>
                (b.fechaActualizacion?.toDate() || 0) -
                (a.fechaActualizacion?.toDate() || 0)
        );

        setNoticias(newsList);
        setLoading(false);
    };

    useEffect(() => {
        cargarNoticias();
    }, []);

    const handlePublicar = async (id) => {
        try {
            // 1️⃣ Publicar noticia
            await updateNewsStatus(id, 'publicado');

            // 2️⃣ Obtener datos de la noticia para saber quién es el autor
            const noticia = await getNewsById(id);
            if (noticia?.autorId) {
                await createNotification({
                    userId: noticia.autorId, // destinatario (reportero)
                    actorId: currentUser.uid, // quien ejecuta (editor)
                    actorName: userData?.nombre || 'Editor',
                    actorRole: 'editor',
                    type: 'PUBLISHED',
                    newsId: id,
                    message: `${userData?.nombre || 'Un editor'} publicó tu noticia "${noticia.titulo}".`,
                });
            }

            // 3️⃣ Recargar
            await cargarNoticias();
        } catch (error) {
            console.error('Error publicando noticia:', error);
        }
    };

    const handleDesactivar = async (id) => {
        try {
            await updateNewsStatus(id, 'desactivado');

            const noticia = await getNewsById(id);
            if (noticia?.autorId) {
                await createNotification({
                    userId: noticia.autorId,
                    actorId: currentUser.uid,
                    actorName: userData?.nombre || 'Editor',
                    actorRole: 'editor',
                    type: 'DEACTIVATED',
                    newsId: id,
                    message: `${userData?.nombre || 'Un editor'} desactivó tu noticia "${noticia.titulo}".`,
                });
            }

            await cargarNoticias();
        } catch (error) {
            console.error('Error desactivando noticia:', error);
        }
    };

    const capitalizar = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'publicado':
                return '#28a745';
            case 'terminado':
                return '#ffc107';
            case 'desactivado':
                return '#dc3545';
            case 'edicion':
                return '#007bff';
            default:
                return '#6c757d';
        }
    };


    return (
        <Box sx={{ p: 4, maxWidth: '1400px', margin: '0 auto' }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                fontWeight="bold"
                color="primary"
            >
                Gestión de Noticias
            </Typography>

            {loading ? (
                <Grid container spacing={3} justifyContent="center">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                            <Skeleton
                                variant="rectangular"
                                height={480}
                                sx={{ borderRadius: 3 }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    alignItems="stretch"
                >
                    {noticias.map((noticia) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={noticia.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center', // 👈 centra el card
                            }}
                        >
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: 6,
                                    },
                                    width: '100%', // 👈 asegura que todas usen el mismo ancho del grid
                                    maxWidth: 330, // 👈 evita que crezcan más de lo necesario
                                    height: 480, // 👈 mismo alto
                                }}
                            >
                                {/* Imagen */}
                                {noticia.imagenURL ? (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={noticia.imagenURL}
                                        alt={noticia.titulo}
                                        sx={{
                                            objectFit: 'cover',
                                            borderTopLeftRadius: 12,
                                            borderTopRightRadius: 12,
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            height: 180,
                                            backgroundColor: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#aaa',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        Sin imagen
                                    </Box>
                                )}

                                {/* Contenido */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 'bold',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {noticia.titulo}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                                            Autor:{' '}
                                        </Box>
                                        {noticia.autorNombre ||
                                            noticia.autorEmail ||
                                            'Autor desconocido'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                                            Categoría:{' '}
                                        </Box>
                                        {capitalizar(noticia.categoria) || 'Sin categoría'}
                                    </Typography>

                                    <Chip
                                        label={`Estado: ${capitalizar(noticia.estado)}`}
                                        sx={{
                                            mt: 1.5,
                                            color: '#fff',
                                            backgroundColor: getStatusColor(noticia.estado),
                                            fontWeight: 'bold',
                                        }}
                                    />
                                </CardContent>

                                {/* Acciones */}
                                <CardActions
                                    sx={{
                                        justifyContent: 'space-between',
                                        px: 2,
                                        pb: 2,
                                        mt: 'auto',
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Edit />}
                                        component={Link}
                                        to={`/admin/editar/${noticia.id}`}
                                    >
                                        Editar
                                    </Button>

                                    {noticia.estado === 'terminado' && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            startIcon={<Publish />}
                                            onClick={() => handlePublicar(noticia.id)}
                                        >
                                            Publicar
                                        </Button>
                                    )}
                                    {noticia.estado === 'publicado' && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            startIcon={<Block />}
                                            onClick={() => handleDesactivar(noticia.id)}
                                        >
                                            Desactivar
                                        </Button>
                                    )}
                                    {noticia.estado === 'desactivado' && (
                                        <Button
                                            variant="contained"
                                            color="info"
                                            size="small"
                                            startIcon={<Restore />}
                                            onClick={() => handlePublicar(noticia.id)}
                                        >
                                            Re-Publicar
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default EditorPanel;
