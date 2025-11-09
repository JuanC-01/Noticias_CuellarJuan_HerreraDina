import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
    AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem,
    Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import ReporterPanel from '../ReporterPanel/ReporterPanel';
import EditorPanel from '../EditorPanel/EditorPanel';
import NewsForm from '../../components/NewsForm/NewsForm';
import GestionarSecciones from '../GestionarSecciones/GestionarSecciones';
import { markNotificationsAsRead } from '../../services/notificationsService';
import logo from '../../assets/logo.png';

const Dashboard = () => {
    const { currentUser, userData, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotif, setAnchorElNotif] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        if (!currentUser?.uid) return;
        const notificationsRef = collection(db, 'notificaciones');
        const q = query(
            notificationsRef,
            where('userId', '==', currentUser.uid),
            where('read', '==', false)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const unreadNotifs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(unreadNotifs);
            setNotificationCount(unreadNotifs.length);
        });
        return () => unsubscribe();
    }, [currentUser?.uid]);

    if (!userData || !currentUser) return <Typography sx={{ p: 4 }}>Cargando usuario...</Typography>;

    const roleColors = {
        admin: '#2e7d32',
        editor: '#1e1e2f',
        reportero: '#19d2c3ff',
    };

    const appBarColor = roleColors[userData.rol] || '#1e1e2f';
    const basePath = `${userData.rol}-panel`;
    const pages = [
        { name: '', path: `/${basePath}` },
        ...(userData.rol === 'editor' ? [{ name: 'Gestionar Secciones', path: `/${basePath}/secciones` }] : []),
    ];

    const settings = [
        { name: 'Ver sitio público', action: () => window.open('/', '_blank'), icon: <PublicIcon sx={{ mr: 1, fontSize: 18 }} /> },
        { name: 'Cerrar sesión', action: async () => { await logout(); navigate('/login'); }, icon: <LogoutIcon sx={{ mr: 1, fontSize: 18 }} /> },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f6fa' }}>
            <AppBar position="static" sx={{ bgcolor: appBarColor }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                        {/* ✅ Reemplazo del texto CMS Noticias por logo */}
                        <Box
                            component="a"
                            href={`/${basePath}`}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'inherit',
                                mr: 2
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                alt="Logo"
                                sx={{
                                    height: 80,
                                    mr: 1,
                                    display: { xs: 'none', md: 'flex' }
                                }}
                            />
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="large" aria-label="menu" onClick={(e) => setAnchorElNav(e.currentTarget)} color="inherit">
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                open={Boolean(anchorElNav)}
                                onClose={() => setAnchorElNav(null)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page.name} onClick={() => { navigate(page.path); setAnchorElNav(null); }}>
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button key={page.name} onClick={() => navigate(page.path)} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    {page.name}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Notificaciones">
                                <IconButton onClick={(e) => setAnchorElNotif(e.currentTarget)} color="inherit" sx={{ mr: 1 }}>
                                    <Badge badgeContent={notificationCount} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Opciones de usuario">
                                <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                                    <Avatar sx={{ bgcolor: appBarColor, width: 32, height: 32 }}>
                                        {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth={false} sx={{ mt: 4, flexGrow: 1 }}>
                <Routes>
                    <Route path="/" element={userData.rol === 'reportero' ? <ReporterPanel /> : <EditorPanel />} />
                    <Route path="crear" element={<NewsForm />} />
                    <Route path="editar/:noticiaId" element={<NewsForm modoEdicion={true} />} />
                    {userData.rol === 'editor' && <Route path="secciones" element={<GestionarSecciones />} />}
                </Routes>
            </Container>
        </Box>
    );
};

export default Dashboard;
