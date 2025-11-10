import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Alert, CircularProgress, Paper,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ForgotPasswordModal from '../../components/ForgotPasswordModal/ForgotPasswordModal';
import logo from '../../assets/login.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        setLoading(true);
        try {
            const userData = await login(email, password);
            setLoading(false);
            if (userData.rol === 'editor') navigate('/editor-panel');
            else if (userData.rol === 'reportero') navigate('/reportero-panel');
            else navigate('/');
        } catch (err) {
            setLoading(false);
            if (
                err.code === 'auth/user-not-found' ||
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/invalid-credential'
            ) {
                setError('El correo o la contraseña son incorrectos.');
            } else {
                console.error(err);
                setError('Ocurrió un error al iniciar sesión.');
            }
        }
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper
                    elevation={6}
                    sx={{
                        mt: 8,
                        p: 4,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
                    }}
                >
                    <Avatar
                        alt="Logo"
                        src={logo}
                        sx={{
                            m: 1,
                            width: 90,
                            height: 90,
                            boxShadow: 3,
                            bgcolor: 'white',
                            p: 1,
                            borderRadius: '50%',
                            border: '3px solid #810303ff'
                        }}

                    />

                    <Typography
                        component="h1"
                        variant="h5"
                        align="center"
                        gutterBottom
                        fontWeight="bold"
                        sx={{
                            color: '#810303ff',
                            fontSize: '2rem',
                            letterSpacing: '1px',
                        }}
                    >
                        Iniciar Sesión
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
                        Accede a tu cuenta para continuar
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo Electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />

                        {error && (
                            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.3,
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                borderRadius: 2,
                                backgroundColor: '#000000ff',
                                '&:hover': {
                                    backgroundColor: '#c62828', 
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
                        </Button>


                        <Grid container spacing={1}>
                            <Grid item xs={12} textAlign="center">
                                <Link href="#" variant="body2" onClick={(e) => setOpenModal(true)}>
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </Grid>
                            <Grid item xs={12} textAlign="center">
                                <Link component={RouterLink} to="/register" variant="body2">
                                    ¿No tienes una cuenta? Regístrate aquí
                                </Link>
                            </Grid>
                            <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
                                <Link component={RouterLink} to="/" variant="body2" color="text.secondary">
                                    ← Volver al Inicio
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>

            <ForgotPasswordModal open={openModal} handleClose={() => setOpenModal(false)} />
        </>
    );
};

export default Login;
