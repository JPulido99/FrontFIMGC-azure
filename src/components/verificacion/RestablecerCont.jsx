import React, { useState } from "react";
import {
  Col,
  Row,
  Container,
  Card,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
  Modal
} from "react-bootstrap";
import axios from "axios";

const RestablecerCont = () => {
    const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

  const tooltipsMensajes = {
    password: "Ingrese nueva contraseña.",
    repetirPassword: "Repita la nueva contraseña.",
  };

  const renderTooltip = (props, field) => (
    <Tooltip {...props}>{tooltipsMensajes[field]}</Tooltip>
  );

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordsMatch(event.target.value === repeatedPassword);
  };

  const handleRepeatedPasswordChange = (event) => {
    setRepeatedPassword(event.target.value);
    setPasswordsMatch(password === event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordsMatch) {
      try {
        const response = await axios.put(`https://fimgc-back.rj.r.appspot.com/users/${email}/update-password`, {
          newPassword: password
        });

        // Mostrar el modal de éxito
        setShowModal(true);

      } catch (error) {
        // Manejar el error de actualización
        console.error(error);
      }
    } else {
      // Manejar la situación en la que las contraseñas no coinciden
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
    // Redirige a la página de inicio de sesión
    window.location.href = "/login";
  };

  return (
    <div className="login">
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={11} lg={8} xs={12}>
            <Card className="shadow">
              <Card.Header>{/* ... */}</Card.Header>
              <Card.Body>
                <h4 className="fw-bold title-login text-uppercase">
                  Restablecer contraseña
                </h4>
                <Form onSubmit={handleSubmit}>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label
                      column
                      sm="4"
                      className="fw-bold customize-flabel"
                    >
                      Correo electrónico
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        autoFocus
                      />
                    </Col>
                  </Form.Group>
                  {/* ... */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label
                      column
                      sm="4"
                      className="fw-bold customize-flabel"
                    >
                      Nueva contraseña
                    </Form.Label>
                    <Col sm="8">
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 170, hide: 430 }}
                        overlay={(props) => renderTooltip(props, "password")}
                      >
                        <Form.Control
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          autoFocus
                        />
                      </OverlayTrigger>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label
                      column
                      sm="4"
                      className="fw-bold customize-flabel"
                    >
                      Repetir nueva contraseña
                    </Form.Label>
                    <Col sm="8">
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 170, hide: 430 }}
                        overlay={(props) =>
                          renderTooltip(props, "repetirPassword")
                        }
                      >
                        <Form.Control
                          type="password"
                          value={repeatedPassword}
                          onChange={handleRepeatedPasswordChange}
                          autoFocus
                        />
                      </OverlayTrigger>
                    </Col>
                  </Form.Group>

                  <div className="customize-btn-div justify-content-end">
                    <Button
                      className="customize-btn-1"
                      type="submit"
                      disabled={!passwordsMatch}
                    >
                      Restablecer <i className="fi fi-br-key"></i>
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal
        centered
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Restablecimiento exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>Contraseña restablecida!</Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1 btn-into-row"
            onClick={handleCloseModal}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestablecerCont;
