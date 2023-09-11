import React from 'react';
import {Container,Row, Navbar} from 'react-bootstrap';

const Footer = () => {
  return (
    <div>
      <Navbar sticky="bottom" className='footer' >
        <Container className='justify-content-center'>
            Todos los derechos reservados © 2023.
        </Container>
      </Navbar>
    </div>
  )
}

export default Footer