import React from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';

// Color constante para el fondo del Carrusel y la sección
const CAROUSEL_BACKGROUND_COLOR = '#744f36'; 
// URL de marcador de posición neutra para no tapar el color de fondo del div
const NEUTRAL_PLACEHOLDER = "https://placehold.co/800x400/CCCCCC/333333?text="; 

// --------------------------------------------------------------------------------

/**
 * Componente que muestra la imagen de una diapositiva.
 * Se ha ajustado el estilo de la imagen (objectFit: 'contain') para que 
 * el color de fondo (bgColor) del div contenedor sea visible.
 */
function CarouselImage({ text, src, bgColor }) { 
    return (
        <div style={{ 
            height: '400px', 
            // Usa el color de fondo unificado
            backgroundColor: bgColor || CAROUSEL_BACKGROUND_COLOR, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
        }}>
            <img 
                // Eliminamos 'className="d-block w-100"' para permitir que 'objectFit: contain' funcione
                src={src} 
                alt={text}
                style={{ 
                    maxHeight: '400px', 
                    maxWidth: '100%',
                    objectFit: 'contain' // La clave para ver el fondo
                }}
            />
        </div>
    );
}


/**
 * Componente del Carrusel de productos.
 */
function ProductosCarousel() {
  return (
    <Carousel fade>
      
      {/* Slide 1: Café */}
      <Carousel.Item>
        <CarouselImage 
            text="Café de Especialidad" 
            src={NEUTRAL_PLACEHOLDER + "GRANOS+DE+ESPECIALIDAD"}
            bgColor={CAROUSEL_BACKGROUND_COLOR} // Fondo unificado
        />
        <Carousel.Caption>
          <h3 style={{color: 'white'}}>Café de Especialidad</h3>
          <p>Tostados frescos y seleccionados de origen único.</p>
        </Carousel.Caption>
      </Carousel.Item>
      
      {/* Slide 2: Postre */}
      <Carousel.Item>
        <CarouselImage 
            text="Postre Temático" 
            src={NEUTRAL_PLACEHOLDER + "POSTRES+PHANTOM+THIEVES"}
            bgColor={CAROUSEL_BACKGROUND_COLOR} // Fondo unificado
        />
        <Carousel.Caption>
          <h3 style={{color: 'white'}}>Postres Únicos</h3>
          <p>Inspirados en tus personajes y juegos favoritos.</p>
        </Carousel.Caption>
      </Carousel.Item>
      
      {/* Slide 3: Ambiente */}
      <Carousel.Item>
        <CarouselImage 
            text="Ambiente Único" 
            src={NEUTRAL_PLACEHOLDER + "AMBIENTE+LE+BLANC"}
            bgColor={CAROUSEL_BACKGROUND_COLOR} // Fondo unificado
        />
        <Carousel.Caption>
          <h3 style={{color: 'white'}}>El Ambiente Perfecto</h3>
          <p>
            Un lugar acogedor para estudiar o pasar el rato.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      
    </Carousel>
  );
}

// --------------------------------------------------------------------------------

/**
 * Componente principal Home
 */
export default function Home(){
    // Función para hacer scroll a la sección del carrusel
    const scrollToProducts = () => {
        document.getElementById('productos-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main>
            {/* Sección Principal (Hero) */}
            <div id="home" className="hero-section">
                <Container>
                    <Row className="hero-content">
                        <Col md={12}>
                            <h1>Café Le Blanc</h1>
                            <p>Un acogedor café temático inspirado en la estética y el ambiente del icónico establecimiento de Persona 5, ubicado en el corazón de Santiago.</p>
                            <p>Fomentamos la comunidad y la conexión entre personas que comparten la pasión por la cultura japonesa, el café de especialidad y los videojuegos.</p>
                            
                            <Button 
                                className="hero-button" 
                                variant="primary"
                                onClick={scrollToProducts} 
                            >
                                Conoce nuestros productos
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Sección de Productos (Carousel) */}
            <div id="productos-section" className="py-5" style={{ backgroundColor: CAROUSEL_BACKGROUND_COLOR }}>
                <Container>
                    <h2 className="text-center mb-4" style={{color: 'white'}}>Nuestros Productos Destacados</h2>
                    <ProductosCarousel /> 
                </Container>
            </div>
        </main>
    );
}