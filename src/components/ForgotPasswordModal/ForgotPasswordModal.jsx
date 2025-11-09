// src/components/ForgotPasswordModal/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ForgotPasswordModal = ({ open, handleClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleOnClose = () => {
        handleClose();
        setError(null);
        setMessage(null);
        setEmail('');
    };

    const handleSubmit = async () => {
        setError(null);
        setMessage(null);

        if (!email) {
            setError('Por favor, ingresa un correo electrónico.');
            return;
        }

        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setLoading(false);
            setMessage('¡Correo enviado! Revisa tu bandeja de entrada (y spam).');

        } catch (err) {
            setLoading(false);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
                setError('El correo electrónico no está registrado o no es válido.');
            } else {
                setError('Ocurrió un error al enviar el correo.');
            }
        }
    };

    return (
        <Dialog open={open} onClose={handleOnClose}>
            <DialogTitle>Restablecer Contraseña</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Ingresa tu correo electrónico y te enviaremos un enlace para que
                    puedas restablecer tu contraseña.
                </DialogContentText>

                {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <TextField
                    autoFocus
                    margin="dense"
                    id="email-reset"
                    label="Correo Electrónico"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || message}
                />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleOnClose} disabled={loading}>Cancelar</Button>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || message}
                    >
                        Enviar enlace
                    </Button>
                    {loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPasswordModal;