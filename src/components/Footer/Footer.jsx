import React from 'react';
import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
    const { userData } = useAuth();

    const rolColors = {
        editor: '#1e1e2f',
        reportero: '#19d2c3ff',
    };
    const backgroundColor = rolColors[userData?.rol] || '#333';
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: backgroundColor,
                color: '#fff',
                py: 4,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography variant="body1">
                        &copy; {new Date().getFullYear()}
                        Instant News. Todos los derechos reservados.
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <IconButton
                            component="a"
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#fff' }}
                        >
                            <Facebook />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#fff' }}
                        >
                            <Twitter />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#fff' }}
                        >
                            <Instagram />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#fff' }}
                        >
                            <LinkedIn />
                        </IconButton>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
