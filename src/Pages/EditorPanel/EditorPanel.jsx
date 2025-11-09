import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Grid, Card, CardContent, CardMedia, Typography, Button, CardActions, Chip, Box, Skeleton, Tabs, Tab, Badge, Pagination, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import { Edit, Publish, Block, Restore } from "@mui/icons-material";
import { getAllNews, updateNewsStatus, getNewsById } from "../../services/newsService";
import { createNotification } from "../../services/notificationsService";
import { useAuth } from "../../context/AuthContext";

const estados = [
    { key: "todos", label: "Todos" },
    { key: "edicion", label: "En edición" },
    { key: "terminado", label: "En revisión" },
    { key: "publicado", label: "Publicadas" },
    { key: "desactivado", label: "Desactivadas" },
];

const EditorPanel = () => {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroReportero, setFiltroReportero] = useState("todos");
    const [page, setPage] = useState(1);
    const { currentUser, userData } = useAuth();

    const itemsPerPage = 8;

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
            await updateNewsStatus(id, "publicado");
            const noticia = await getNewsById(id);
            if (noticia?.autorId) {
                await createNotification({
                    userId: noticia.autorId,
                    actorId: currentUser.uid,
                    actorName: userData?.nombre || "Editor",
                    actorRole: "editor",
                    type: "PUBLISHED",
                    newsId: id,
                    message: `${userData?.nombre || "Un editor"} publicó tu noticia "${noticia.titulo}".`,
                });
            }
            await cargarNoticias();
        } catch (error) {
            console.error("Error publicando noticia:", error);
        }
    };

    const handleDesactivar = async (id) => {
        try {
            await updateNewsStatus(id, "desactivado");
            const noticia = await getNewsById(id);
            if (noticia?.autorId) {
                await createNotification({
                    userId: noticia.autorId,
                    actorId: currentUser.uid,
                    actorName: userData?.nombre || "Editor",
                    actorRole: "editor",
                    type: "DEACTIVATED",
                    newsId: id,
                    message: `${userData?.nombre || "Un editor"} desactivó tu noticia "${noticia.titulo}".`,
                });
            }
            await cargarNoticias();
        } catch (error) {
            console.error("Error desactivando noticia:", error);
        }
    };

    const capitalizar = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

    const getStatusColor = (estado) => {
        switch (estado) {
            case "publicado":
                return "success";
            case "terminado":
                return "info";
            case "desactivado":
                return "error";
            case "edicion":
                return "warning";
            default:
                return "default";
        }
    };

    const reporteros = [
        ...new Set(
            noticias
                .filter((n) => n.autorNombre)
                .map((n) => n.autorNombre)
        ),
    ];

    const noticiasFiltradas = noticias.filter((n) => {
        const coincideEstado = filtroEstado === "todos" || n.estado === filtroEstado;
        const coincideReportero =
            filtroReportero === "todos" || n.autorNombre === filtroReportero;
        return coincideEstado && coincideReportero;
    });

    const totalPages = Math.ceil(noticiasFiltradas.length / itemsPerPage);
    const noticiasPaginadas = noticiasFiltradas.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleChangePage = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const contarPorEstado = (estadoKey) => {
    const filtradas = noticias.filter((n) => {
        const coincideReportero =
            filtroReportero === "todos" || n.autorNombre === filtroReportero;
        const coincideEstado =
            estadoKey === "todos" || n.estado === estadoKey;
        return coincideReportero && coincideEstado;
    });
    return filtradas.length;
};


    return (
        <Box sx={{ p: 4, maxWidth: "1400px", margin: "0 auto" }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                fontWeight="bold"
                color="primary"
            >
                Gestión de Noticias
            </Typography>

            <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3} gap={2}>
                <Tabs
                    value={filtroEstado}
                    onChange={(e, newValue) => {
                        setFiltroEstado(newValue);
                        setPage(1);
                    }}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {estados.map(({ key, label }) => (
                        <Tab
                            key={key}
                            value={key}
                            label={
                                <Badge color="secondary" badgeContent={contarPorEstado(key)}>
                                    {label}
                                </Badge>
                            }
                        />
                    ))}
                </Tabs>

                <FormControl sx={{ minWidth: 220 }}>
                    <InputLabel>Filtrar por reportero</InputLabel>
                    <Select
                        value={filtroReportero}
                        label="Filtrar por reportero"
                        onChange={(e) => {
                            setFiltroReportero(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        {reporteros.map((rep) => (
                            <MenuItem key={rep} value={rep}>
                                {rep}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* 🔹 Contenido */}
            {loading ? (
                <Grid container spacing={3} justifyContent="center">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                            <Skeleton variant="rectangular" height={480} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : noticiasPaginadas.length === 0 ? (
                <Typography color="text.secondary" align="center" mt={4}>
                    No hay noticias que coincidan con los filtros seleccionados.
                </Typography>
            ) : (
                <>
                    <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                        {noticiasPaginadas.map((noticia) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={noticia.id}
                                sx={{ display: "flex", justifyContent: "center" }}
                            >
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
                                        width: "100%",
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
                                                objectFit: "cover",
                                                borderTopLeftRadius: 12,
                                                borderTopRightRadius: 12,
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: 180,
                                                backgroundColor: "#f0f0f0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#aaa",
                                                fontSize: "0.9rem",
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
                                                fontWeight: "bold",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                            }}
                                        >
                                            {noticia.titulo}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            <Box component="span" sx={{ fontWeight: "bold" }}>
                                                Autor:{" "}
                                            </Box>
                                            {noticia.autorNombre ||
                                                noticia.autorEmail ||
                                                "Autor desconocido"}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            <Box component="span" sx={{ fontWeight: "bold" }}>
                                                Categoría:{" "}
                                            </Box>
                                            {capitalizar(noticia.categoria) || "Sin categoría"}
                                        </Typography>

                                        <Chip
                                            label={`Estado: ${capitalizar(noticia.estado)}`}
                                            color={getStatusColor(noticia.estado)}
                                            sx={{ mt: 1.5, fontWeight: "bold" }}
                                        />
                                    </CardContent>

                                    <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Edit />}
                                            component={Link}
                                            to={`/${userData?.rol}-panel/editar/${noticia.id}`}
                                        >
                                            Editar
                                        </Button>

                                        {noticia.estado === "terminado" && (
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
                                        {noticia.estado === "publicado" && (
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
                                        {noticia.estado === "desactivado" && (
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

                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handleChangePage}
                                color="primary"
                                shape="rounded"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default EditorPanel;
