import React from 'react';
import { Col, Row, Container, Card, Alert } from "react-bootstrap";


const VerificadoExitoso = () => {
    
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
                <Alert variant="success" >
                  <Alert.Heading>Correo verificado</Alert.Heading>
                  <p>
                    Verificacion Exitosa!{' '}
                    <Alert.Link href="/login">Iniciar sesión</Alert.Link> en la plataforma.
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

export default VerificadoExitoso