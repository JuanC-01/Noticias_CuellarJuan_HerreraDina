import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNewsByReporter, updateNewsStatus } from '../../services/newsService';
import {
    Box, Grid, Card, CardContent, CardActions, Typography, Button, Chip, CircularProgress, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle, CardMedia, Tooltip, Skeleton,
} from '@mui/material';
import { AddCircleOutline, Edit, Done } from '@mui/icons-material';
import { notifyAllEditors } from '../../services/notificationsService';

const ReporterPanel = () => {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser, userData } = useAuth();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState(null);

    const cargarNoticias = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const newsList = await getNewsByReporter(currentUser.uid);
            newsList.sort(
                (a, b) =>
                    (b.fechaActualizacion?.toDate() || 0) -
                    (a.fechaActualizacion?.toDate() || 0)
            );
            setNoticias(newsList);
        } catch (error) {
            console.error('Error al cargar noticias:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        cargarNoticias();
    }, [currentUser]);

    const handleOpenConfirm = (id) => {
        setSelectedNewsId(id);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setSelectedNewsId(null);
    };

    const handleConfirmTerminar = async () => {
        if (!selectedNewsId) return;
        const noticia = noticias.find(n => n.id === selectedNewsId);
        if (!noticia) {
            console.error("No se encontró la noticia para notificar.");
            handleCloseConfirm();
            return;
        }

        try {
            await updateNewsStatus(selectedNewsId, 'terminado');

            const payload = {
                actorId: currentUser.uid,
                actorName: userData?.nombre || 'Reportero',
                actorRole: userData?.rol || 'reportero',
                type: 'FINISHED',
                newsId: selectedNewsId,
                message: `${userData?.nombre || 'Un reportero'} ha marcado la noticia "${noticia.titulo}" como terminada.`,
            };

            console.log('📨 Notificando editores con payload:', payload);
            await notifyAllEditors(payload);
            await cargarNoticias();
        } catch (error) {
            console.error('Error al actualizar estado o notificar:', error);
        }

        handleCloseConfirm();
    };


    const formatFecha = (timestamp) => {
        if (timestamp && typeof timestamp.toDate === 'function') {
            return timestamp.toDate().toLocaleDateString('es-ES');
        }
        return 'N/A';
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'edicion':
                return 'warning';
            case 'terminado':
                return 'info';
            case 'publicado':
                return 'success';
            case 'desactivado':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: '1400px', margin: '0 auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Mis Noticias
                </Typography>
                <Button
                    component={Link}
                    to={`/${userData?.rol}-panel/crear`}
                    variant="contained"
                    startIcon={<AddCircleOutline />}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                    }}
                >
                    Crear Nueva
                </Button>
            </Box>
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
            ) : noticias.length === 0 ? (
                <Typography color="text.secondary" align="center">
                    No has creado ninguna noticia aún.
                </Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    {noticias.map((noticia) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={noticia.id}
                            sx={{ display: 'flex', justifyContent: 'center' }}
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
                                    width: '100%',
                                    maxWidth: 330,
                                    height: 480,
                                }}
                            >
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

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Última actualización: {formatFecha(noticia.fechaActualizacion || noticia.fechaCreacion)}
                                    </Typography>

                                    <Chip
                                        label={noticia.estado.toUpperCase()}
                                        color={getEstadoColor(noticia.estado)}
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#fff',
                                        }}
                                    />
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    {noticia.estado === 'edicion' ? (
                                        <>
                                            <Button
                                                component={Link}
                                                to={`/${userData?.rol}-panel/editar/${noticia.id}`}
                                                variant="outlined"
                                                startIcon={<Edit />}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<Done />}
                                                sx={{ textTransform: 'none' }}
                                                onClick={() => handleOpenConfirm(noticia.id)}
                                            >
                                                Terminar
                                            </Button>
                                        </>
                                    ) : (
                                        <Tooltip title="Ya no editable">
                                            <Chip
                                                label={
                                                    noticia.estado === 'terminado'
                                                        ? 'En revisión'
                                                        : noticia.estado
                                                }
                                                color={getEstadoColor(noticia.estado)}
                                                sx={{ ml: 1 }}
                                            />
                                        </Tooltip>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmar finalización
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Deseas marcar esta noticia como <strong>terminada</strong>?<br />
                        Una vez hecho, será enviada al editor para revisión antes de publicarse.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} variant="text" color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmTerminar}
                        variant="contained"
                        color="success"
                        autoFocus
                    >
                        Sí, marcar como terminado
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReporterPanel;
