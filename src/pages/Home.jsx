import React from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';

// Color de fondo del carrusel (igual al resto del sitio)
const CAROUSEL_BACKGROUND_COLOR = '#744f36';

// Placeholder transparente por si un producto no tiene imagen
const NEUTRAL_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO4n2iQAAAAASUVORK5CYII=";

// Componente para mostrar imagen dentro del carrusel
function CarouselImage({ text, src, bgColor }) {
  return (
    <div
      style={{
        height: '400px',
        backgroundColor: bgColor || CAROUSEL_BACKGROUND_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={src}
        alt={text}
        style={{
          maxHeight: '400px',
          maxWidth: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

// Carrusel dinámico que usa los productos del AuthContext
function ProductosCarousel() {
  const { listProducts } = useAuth();
  const products = listProducts().slice(0, 3); // mostrar solo 3 productos

  return (
    <Carousel fade>
      {products.length > 0 ? (
        products.map((p) => (
          <Carousel.Item key={p.id}>
            <CarouselImage
              text={p.nombre}
              src={p.image || NEUTRAL_PLACEHOLDER}
              bgColor={CAROUSEL_BACKGROUND_COLOR}
            />
            <Carousel.Caption>
              <h3 style={{ color: 'white' }}>{p.nombre}</h3>
              <p>{p.description || ''}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item>
          <CarouselImage
            text="Sin productos"
            src={NEUTRAL_PLACEHOLDER}
            bgColor={CAROUSEL_BACKGROUND_COLOR}
          />
          <Carousel.Caption>
            <h3 style={{ color: 'white' }}>Sin productos disponibles</h3>
          </Carousel.Caption>
        </Carousel.Item>
      )}
    </Carousel>
  );
}

// Página principal
export default function Home() {
  const { listProducts } = useAuth();

  // función para hacer scroll a la sección de productos
  const scrollToProducts = () => {
    document.getElementById('productos-section').scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <main>
      {/* Hero section */}
      <div id="home" className="hero-section">
        <Container>
          <Row className="hero-content">
            <Col md={12}>
              <h1>Café Le Blanc</h1>
              <p>
                Un acogedor café temático inspirado en la estética y el ambiente
                del icónico establecimiento de Persona 5, ubicado en el corazón
                de Santiago.
              </p>
              <p>
                Fomentamos la comunidad y la conexión entre personas que
                comparten la pasión por la cultura japonesa, el café de
                especialidad y los videojuegos.
              </p>

              <Button
                className="hero-button"
                variant="primary"
                onClick={scrollToProducts}
                style={{
                  backgroundColor: '#744f36',
                  borderColor: '#744f36',
                  color: 'white',
                }}
              >
                Conoce nuestros productos
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Sección de productos dinámicos */}
      <div
        id="productos-section"
        className="py-5"
        style={{ backgroundColor: CAROUSEL_BACKGROUND_COLOR }}
      >
        <Container>
          <h2 className="text-center mb-4" style={{ color: 'white' }}>
            Nuestros Productos Destacados
          </h2>
          <ProductosCarousel />
        </Container>
      </div>
    </main>
  );
}
