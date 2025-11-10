import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem, Paper,
} from "@mui/material";
import logo from '../../assets/regist.png';

const Register = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("reportero");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!nombre || !email || !password) {
            setError("Por favor, completa todos los campos.");
            return;
        }
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);

        try {
            await register(email, password, nombre, rol);
            navigate("/login");
        } catch (err) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                setError("El correo electrónico ya está en uso.");
            } else if (err.code === "auth/weak-password") {
                setError("La contraseña es demasiado débil.");
            } else {
                setError("Ocurrió un error al crear la cuenta.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper
                elevation={6}
                sx={{
                    mt: 8,
                    p: 4,
                    borderRadius: 3,
                    background: "linear-gradient(180deg, #ffffffff 0%, #f5f7fb 100%)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
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

                    <Typography component="h1" variant="h5" fontWeight="600">
                        Crear nueva cuenta
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="nombre"
                                    required
                                    fullWidth
                                    id="nombre"
                                    label="Nombre completo"
                                    autoFocus
                                    autoComplete="name"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Correo electrónico"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Contraseña (mínimo 6 caracteres)"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth required disabled={loading}>
                                    <InputLabel id="rol-select-label">Rol</InputLabel>
                                    <Select
                                        labelId="rol-select-label"
                                        id="rol-select"
                                        value={rol}
                                        label="Rol"
                                        onChange={(e) => setRol(e.target.value)}
                                    >
                                        <MenuItem value="reportero">Reportero</MenuItem>
                                        <MenuItem value="editor">Editor</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {error && (
                            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
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
                            {loading ? <CircularProgress size={26} color="inherit" /> : "Registrarse"}
                        </Button>

                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2">
                                    ¿Ya tienes una cuenta? Inicia sesión
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
