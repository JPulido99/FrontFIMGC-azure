import React from 'react';
import { Col, Row, Container, Card, Alert } from "react-bootstrap";

const TokenExpirado = () => {
  return (
    <div className='login'>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={9} lg={8} xs={12}>
            <Card className="shadow">
              <Card.Header>
                <img
                  alt=""
                  src="/bannerdoc.jpg"
                  height="45"
                  className="d-inline-block align-top"
                />
              </Card.Header>
              <Card.Body>
                <Alert variant="danger" >
                  <Alert.Heading>Token expirado</Alert.Heading>
                  <p>
                    Hola, nombre de usuario, tu token de verificación ha expirado. Vuelve a {' '}
                    <Alert.Link href="/">registrarte</Alert.Link> para verificar tu correo e ingresar a la plataforma.
                  </p>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default TokenExpirado