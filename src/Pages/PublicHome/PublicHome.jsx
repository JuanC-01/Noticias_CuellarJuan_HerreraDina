import React, { useState, useEffect } from 'react';
import { getSections } from '../../services/sectionsService';
import { getPublishedNews } from '../../services/newsService';
import NewsCarousel from '../../components/NewsCarousel/NewsCarousel';
import NewsRowCarousel from '../../components/NewsRowCarousel/NewsRowCarousel';
import './PublicHome.css';

const PublicHome = () => {
  const [sections, setSections] = useState([]);
  const [noticiasDestacadas, setNoticiasDestacadas] = useState([]);
  const [noticiasRegulares, setNoticiasRegulares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sectionsData, newsData] = await Promise.all([
          getSections(),
          getPublishedNews()
        ]);
        const destacadas = newsData.filter(n => n.destacada);
        const regulares = newsData.filter(n => !n.destacada);
        setSections(sectionsData);
        setNoticiasDestacadas(destacadas);
        setNoticiasRegulares(regulares);
      } catch (error) {
        console.error("Error al cargar la página principal:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  if (loading)
    return <div style={{ textAlign: 'center', padding: '40px' }}>📰 Cargando noticias...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <NewsCarousel noticias={noticiasDestacadas} />
      <hr style={{ margin: '30px 0', border: '1px solid #ddd' }} />
      {sections.length > 0 ? (
        sections.map(section => {
          const newsInSection = noticiasRegulares.filter(
            noticia => noticia.categoria === section.slug
          );

          if (newsInSection.length === 0) return null;

          return (
            <section
              key={section.id}
              className={`section section-${section.slug}`}
              style={{
                marginBottom: '50px',
                borderTop: `6px solid ${section.color || '#2196f3'}`,
                borderRadius: '8px',
                background: '#f9f9f9',
                padding: '20px 25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <h2
                style={{
                  color: section.color || '#222',
                  fontSize: '1.8rem',
                  marginBottom: '20px',
                  fontWeight: '600',
                  borderBottom: `2px solid ${section.color || '#2196f3'}`,
                  display: 'inline-block',
                  paddingBottom: '5px'
                }}
              >
                {section.nombre}
              </h2>
              <NewsRowCarousel noticias={newsInSection} />
            </section>
          );
        })
      ) : (
        <p style={{ textAlign: 'center', color: '#777' }}>
          No hay noticias disponibles en este momento.
        </p>
      )}
    </div>
  );
};

export default PublicHome;
