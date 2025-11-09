// src/components/NewsCard/NewsCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

const NewsCard = ({ noticia }) => {
  return (
    <Card
      sx={{
        width: 320,
        height: 420, // ✅ altura fija para todas
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 3,
        boxShadow: 3,
        m: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Imagen */}
      <CardMedia
        component="img"
        height="180"
        image={noticia.imagenURL || '/placeholder.jpg'}
        alt={noticia.titulo}
        sx={{
          objectFit: 'cover',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      {/* Contenido */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2, // ✅ solo 2 líneas
            WebkitBoxOrient: 'vertical',
          }}
        >
          {noticia.titulo}
        </Typography>

        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2, // ✅ 2 líneas de subtítulo
            WebkitBoxOrient: 'vertical',
          }}
        >
          {noticia.subtitulo}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            Autor: {noticia.autorNombre || noticia.autorEmail}
          </Typography>
        </Box>
      </CardContent>

      {/* Botón */}
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button
          component={Link}
          to={`/noticia/${noticia.id}`}
          variant="contained"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Leer más
        </Button>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
