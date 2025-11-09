// src/components/NewsCarousel/NewsCarousel.jsx
import React from 'react';
import Slider from 'react-slick';
import { CardMedia, Typography, Box, Paper, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const NewsCarousel = ({ noticias }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
    };

    const capitalizar = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (!noticias || noticias.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mb: 4, padding: { xs: '0', sm: '0 20px' } }}>
            <Typography variant="h4" gutterBottom sx={{ pl: { xs: 2, sm: 0 } }}>
                Noticias Destacadas
            </Typography>
            <Slider {...settings}>
                {noticias.map((noticia) => (
                    <Paper
                        key={noticia.id}
                        component={Link}
                        to={`/noticia/${noticia.id}`}
                        sx={{
                            textDecoration: 'none',
                            display: 'block',
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 3,
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={noticia.imagenURL}
                            alt={noticia.titulo}
                            sx={{
                                height: { xs: 250, sm: 350, md: 750 },
                                objectFit: 'cover',
                                width: '100%',
                            }}
                        />

                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0) 100%)',
                                color: 'white',
                                padding: '20px',
                                minHeight: { xs: 'unset', sm: '120px' },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: { xs: '1.2rem', sm: '1.8rem' },
                                    mb: 1
                                }}
                            >
                                {noticia.titulo}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                    mb: 1
                                }}
                            >
                                {noticia.subtitulo}
                            </Typography>
                            {noticia.categoria && (
                                <Chip
                                    label={capitalizar(noticia.categoria)}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        width: 'fit-content',
                                        mt: 1,
                                    }}
                                />
                            )}
                        </Box>
                    </Paper>
                ))}
            </Slider>
        </Box>
    );
};

export default NewsCarousel;