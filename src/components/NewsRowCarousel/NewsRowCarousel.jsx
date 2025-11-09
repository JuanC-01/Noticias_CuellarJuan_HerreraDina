import React, { useRef, useState, useEffect } from 'react';
import NewsCard from '../NewsCard/NewsCard';
import { IconButton, Box } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const NewsRowCarousel = ({ noticias = [] }) => {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);

  const cardsPerView = 3;
  const total = noticias.length;

  const scrollToIndex = (newIndex) => {
    if (!containerRef.current) return;

    // Calcula el desplazamiento horizontal
    const scrollAmount = newIndex * (containerRef.current.offsetWidth / cardsPerView);
    containerRef.current.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleScroll = (direction) => {
    let newIndex = direction === 'right' ? index + 1 : index - 1;

    // Si llega al final, reinicia al inicio (loop infinito)
    if (newIndex >= total - cardsPerView + 1) newIndex = 0;
    if (newIndex < 0) newIndex = total - cardsPerView;

    setIndex(newIndex);
    scrollToIndex(newIndex);
  };

  // Corrige el scroll si cambia el tamaño del contenedor (responsive)
  useEffect(() => {
    scrollToIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  if (total === 0) return null;

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', mt: 1 }}>
      {/* Flecha izquierda */}
      <IconButton
        onClick={() => handleScroll('left')}
        sx={{
          position: 'absolute',
          left: 0,
          top: '40%',
          zIndex: 2,
          background: '#fff',
          boxShadow: 2,
          '&:hover': { background: '#eee' }
        }}
      >
        <ArrowBackIos />
      </IconButton>

      {/* Contenedor scrollable */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          gap: 2,
          pl: 6,
          pr: 6,
        }}
      >
        {noticias.map((noticia) => (
          <Box
            key={noticia.id}
            sx={{
              flex: `0 0 calc(33.333% - 16px)`,
              minWidth: '320px',
              maxWidth: '360px'
            }}
          >
            <NewsCard noticia={noticia} />
          </Box>
        ))}
      </Box>

      {/* Flecha derecha */}
      <IconButton
        onClick={() => handleScroll('right')}
        sx={{
          position: 'absolute',
          right: 0,
          top: '40%',
          zIndex: 2,
          background: '#fff',
          boxShadow: 2,
          '&:hover': { background: '#eee' }
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default NewsRowCarousel;
