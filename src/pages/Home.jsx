import React from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
    // Lista completa de productos que proporcionaste
    const listaProductos = [
        // --- Comidas ---
        { id: 2, nombre: 'Curry LeBlanc Original', precio: 8500, categoria: 'Comidas', descripcion: 'El famoso curry casero con la receta secreta, servido con arroz japonés.', imagen: '/imagenes/imagen2.jpg' },
        { id: 4, nombre: 'Katsu Sando', precio: 6900, categoria: 'Comidas', descripcion: 'Sándwich japonés con chuleta de cerdo empanizada, col rallada y salsa tonkatsu.', imagen: '/imagenes/imagen4.jpg' },
        { id: 5, nombre: 'Desayuno Japonés', precio: 7900, categoria: 'Comidas', descripcion: 'Set de desayuno tradicional con arroz, huevo, nori y sopa miso.', imagen: '/imagenes/imagen5.png' },
        { id: 9, nombre: 'Onigiri Set (2 unidades)', precio: 4500, categoria: 'Comidas', descripcion: 'Bolas de arroz japonés rellenas de atún con mayonesa y umeboshi (ciruela encurtida), envueltas en nori.', imagen: '/imagenes/imagen9.jpg' },
        { id: 12, nombre: 'Takoyaki (6 unidades)', precio: 6500, categoria: 'Comidas', descripcion: 'Populares bolitas de masa de harina de trigo rellenas de pulpo, cubiertas con salsa takoyaki y katsuobushi.', imagen: '/imagenes/imagen12.jpg' },
        
        // --- Bebidas ---
        { id: 1, nombre: 'Café LeBlanc Original', precio: 3200, categoria: 'Bebidas', descripcion: 'El blend especial de la casa, preparado con granos de café de tueste medio.', imagen: '/imagenes/imagen1.png' },
        { id: 6, nombre: '"Joker\'s Wild" Cocktail', precio: 4500, categoria: 'Bebidas', descripcion: 'Cóctel sin alcohol con jugo de granada, ginger ale y un toque de lima.', imagen: '/imagenes/imagen6.png' },
        { id: 7, nombre: 'Matcha Latte "Mementos"', precio: 4300, categoria: 'Bebidas', descripcion: 'Té verde Matcha japonés de alta calidad, preparado con leche vaporizada y un toque de dulzor.', imagen: '/imagenes/imagen7.png' },

        // --- Postres ---
        { id: 3, nombre: 'Cheesecake Persona', precio: 5800, categoria: 'Postres', descripcion: 'Cheesecake de estilo japonés con base de galleta y topping de frutos rojos.', imagen: '/imagenes/imagen3.jpg' },
        { id: 8, nombre: 'Dorayaki "Soledad"', precio: 3800, categoria: 'Postres', descripcion: 'Dos panqueques japoneses rellenos de Anko (pasta de judía roja dulce). Un clásico de la repostería nipona.', imagen: '/imagenes/imagen8.jpg' },
    ];
    
    // Curamos una lista de 6 productos para el carrusel (3 slides con 2 productos c/u)
    const productosCarrusel = [
        listaProductos[0], // Curry
        listaProductos[8], // Cheesecake Persona
        listaProductos[5], // Café Original
        listaProductos[9], // Dorayaki
        listaProductos[3], // Katsu Sando
        listaProductos[7], // Matcha Latte
    ];

    // Agrupa los productos en pares para el carrusel (2 tarjetas por slide)
    const slides = [];
    for (let i = 0; i < productosCarrusel.length; i += 2) {
        slides.push(productosCarrusel.slice(i, i + 2));
    }

    return (
        <main>
            {/* 1. Sección Principal (Hero) */}
            <div id="home" className="hero-section text-center">
                <Container>
                    <Row className="hero-content">
                        <Col md={12} className="py-5">
                            <h1>Café Le Blanc</h1>
                            <p className="lead text-light mb-4">Un acogedor café temático inspirado en la estética y el ambiente del icónico establecimiento de Persona 5, ubicado en el corazón de Santiago.</p>
                            <p className="text-light mb-5">Fomentamos la comunidad y la conexión entre personas que comparten la pasión por la cultura japonesa, el café de especialidad y los videojuegos.</p>
                            
                            <Link to="/productos">
                                <Button 
                                    className="hero-button" 
                                    variant="primary"
                                >
                                    Conoce nuestro Menú
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* 2. Sección: Carrusel de Productos Destacados */}
            <Container className="py-5">
                <h2 className="page-title text-center mb-5">¡Imprescindibles del Mes!</h2>
                
                {/* Carrusel */}
                <Carousel 
                    className="productos-carrusel" // Clase para posible estilizado adicional
                    interval={5000} // Cambia cada 5 segundos
                    indicators={true}
                >
                    {slides.map((slide, index) => (
                        <Carousel.Item key={index}>
                            <Row className="justify-content-center px-4">
                                {slide.map(producto => (
                                    <Col key={producto.id} md={6} className="mb-4 d-flex">
                                        {/* Tarjeta de Producto */}
                                        <Card className="card-shadow h-100 bg-dark text-light border-cafe w-100">
                                            {/* Imagen del Producto */}
                                            <div style={{ height: '250px', backgroundColor: '#343a40', overflow: 'hidden' }} className="d-flex align-items-center justify-content-center">
                                                {/* Usamos una etiqueta <img> real con tu ruta */}
                                                <img 
                                                    src={producto.imagen} 
                                                    alt={producto.nombre} 
                                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                />
                                            </div>
                                            
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title className="text-light">{producto.nombre}</Card.Title>
                                                <Card.Text className="muted flex-grow-1">
                                                    {producto.descripcion}
                                                </Card.Text>
                                                <h4 className="text-light mb-3">${producto.precio.toLocaleString('es-CL')}</h4>
                                                
                                                <Link to={`/producto/${producto.id}`} className="mt-auto">
                                                    <Button variant="primary" className="btn-primary-cafe w-100">
                                                        Ver Detalles
                                                    </Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>
                
                <div className="text-center mt-5">
                    <Link to="/productos">
                        <Button variant="outline-primary" className="btn-primary-cafe">
                            Ver Menú Completo
                        </Button>
                    </Link>
                </div>
            </Container>
            
            <hr className="bg-light w-50 mx-auto my-5"/>

            {/* 3. Sección: El Concepto Le Blanc (Sin Cambios) */}
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={10} className="text-center">
                        <h2 className="page-title mb-4">Más que un Café, una Base de Operaciones</h2>
                        <p className="lead text-light">
                            Inspirado en el espíritu de **Le Blanc**, nuestro local no solo ofrece café de especialidad y comida casera, sino un refugio para la comunidad. Un lugar donde puedes mejorar tus "estadísticas sociales" y planificar tu próxima aventura, ya sea en el mundo real o en el metaverso.
                        </p>
                        <p className="text-light">
                            Nuestra carta está diseñada para evocar los sabores de Inaba y Shibuya, con ingredientes frescos y un toque de misterio en cada taza. Únete a nuestra mesa, comparte una partida y siéntete como en casa.
                        </p>
                        <Link to="/contacto">
                            <Button variant="secondary" className="hero-button mt-4">
                                ¿Quieres reservarnos? ¡Contáctanos!
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>

        </main>
    );
}