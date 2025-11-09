import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNewsBySectionSlug } from '../../services/newsService';
import { getSectionBySlug } from '../../services/sectionsService';
import {
  Container, Typography, Grid, Box, CircularProgress, Divider, Fade, Pagination,
} from '@mui/material';
import NewsCard from '../../components/NewsCard/NewsCard';

const SectionView = () => {
  const { slug } = useParams();
  const [noticias, setNoticias] = useState([]);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  
  useEffect(() => {
    const fetchNews = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [newsData, sectionData] = await Promise.all([
          getNewsBySectionSlug(slug),
          getSectionBySlug(slug),
        ]);
        setNoticias(newsData);
        setSection(sectionData);
      } catch (error) {
        console.error('Error al cargar noticias por sección:', error);
      }
      setLoading(false);
    };
    fetchNews();
  }, [slug]);

  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedNews = noticias.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(noticias.length / itemsPerPage);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Fade in timeout={400}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
              letterSpacing: '-0.5px',
            }}
          >
            {section ? section.nombre : 'Noticias'}
          </Typography>
          <Divider
            sx={{
              width: 100,
              height: 4,
              borderRadius: 2,
              mx: 'auto',
              backgroundColor: section?.color || 'primary.main',
            }}
          />
        </Box>
        {noticias.length === 0 ? (
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mt: 6 }}
          >
            No se encontraron noticias en esta sección.
          </Typography>
        ) : (
          <>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="stretch"
            >
              {paginatedNews.map((noticia) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={noticia.id}
                  sx={{ display: 'flex' }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <NewsCard
                      noticia={noticia}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  size="large"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Fade>
  );
};

export default SectionView;
