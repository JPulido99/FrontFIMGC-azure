import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthProvider";
import {
  Alert,
  Button,
  Modal,
  Form,
  Col,
  Row,
  Container,
  Card,
  Image,
  Spinner,
} from "react-bootstrap";

const Login_Reg = () => {
  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const handleCloseModalPassword = () => setShowModalPassword(false);
  const handleShowModalPassword = () => setShowModalPassword(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);

  const [errorReg, setErrorReg] = useState("");
  const [errorLog, setErrorLog] = useState("");

  const [token, setToken] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");

  useEffect(() => {
    axios
      .get("https://fimgc-back.rj.r.appspot.com/api/rol/roles")
      .then((response) => {
        const roles = response.data;
        setRoles(roles);
      })
      .catch((error) => {});
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };

    axios
      .post("https://fimgc-back.rj.r.appspot.com/login", user)
      .then((response) => {
        const { token, nombre, rol } = response.data;
        console.log(user);
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
          setUser(response.data);
          navigate("/bienvenido");
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          setErrorLog(error.response.data); // Cambio aquí, asignamos el mensaje directamente
        } else if (error.request) {
          console.log(error.request);
          setErrorLog("No se pudo conectar con el servidor");
        } else {
          console.log(error.message);
          setErrorLog("Ocurrió un error en la solicitud");
        }
        setTimeout(() => {
          setErrorLog("");
        }, 2500);
      });
  };

  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !password || !selectedRole) {
      setErrorReg("Por favor, complete todos los campos.");
      return;
    }

    setEnviandoCorreo(true);

    const user = {
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      username: username,
      password: password,
      role: selectedRole,
    };

    axios
      .post("https://fimgc-back.rj.r.appspot.com/register", user)
      .then((response) => {
        handleClose();
        setFirstName("");
        setLastName("");
        setUsername("");
        setPassword("");
        setSelectedRole("");
        setErrorReg("El usuario se ha registrado correctamente.");
        setRegistroExitoso(true); // Esta línea debe estar dentro del .then
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrorReg("El usuario ya está registrado");
        } else {
          setErrorReg("Error al registrar el usuario");
        }
        console.log("errorReg:", errorReg); // Agrega este console.log
      })
      .finally(() => setEnviandoCorreo(false));
  };

  const handleFieldClick = () => {
    setErrorReg("");
  };

  
  //PÁRA ENVIAR FORMULARIO
  const [isRegistrationValid, setIsRegistrationValid] = useState(false);
  useEffect(() => {
    setIsRegistrationValid(isValidUsername(username, selectedRole));
  }, [username, selectedRole, firstName, lastName, password]);
  const isValidUsername = (username, role) => {
    if (role === "Interesado") {
      const usernameRegex = /^[a-zA-Z]+\.[a-zA-Z]+\.\d+@unsch\.edu\.pe$/;
      return (
        usernameRegex.test(username) &&
        //username &&
        firstName &&
        lastName &&
        password &&
        selectedRole
      );
    } else {
      const usernameRegex = /^[a-zA-Z]+\.[a-zA-Z]+@unsch\.edu\.pe$/;
      return (
        usernameRegex.test(username) &&
        //username &&
        firstName &&
        lastName &&
        password &&
        selectedRole
      );
    }
  };
  const [resetEmail, setResetEmail] = useState("");
  const handleEnviarCorreoRestablecer = async () => {
    try {
      const response = await axios.post("https://fimgc-back.rj.r.appspot.com/enviar-correo", {
        destinatario: resetEmail,
      });

      // Manejar la respuesta del backend según tus necesidades
      console.log(response.data); // Por ejemplo, mostrar un mensaje de éxito

      handleCloseModalPassword();
    } catch (error) {
      // Manejar el error de envío de correo
      console.error(error);
    }
  };
  return (
    <div className="login">
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={9} lg={6} xs={12}>
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
                <div className="mb-3 mt-md-4">
                  <h3 className="fw-bold title-login text-uppercase">
                    Iniciar sesión
                  </h3>
                  <div className="mb-3">
                    <Form onSubmit={handleLogin}>
                      <fieldset>
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formBasicUsername"
                        >
                          <Form.Label
                            column
                            sm="3"
                            className="fw-bold customize-flabel"
                          >
                            Correo institucional
                          </Form.Label>
                          <Col sm="9">
                            <Form.Control
                              type="username"
                              placeholder="Ingrese su correo institucional."
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              onClick={handleFieldClick}
                            />
                          </Col>
                          {errorLog && (
                            <Col sm={{ span: 9, offset: 3 }}>
                              <Alert variant="danger" className="mt-2">
                                {errorLog.message}{" "}
                                {/* Renderiza solo el mensaje */}
                              </Alert>
                            </Col>
                          )}
                        </Form.Group>

                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label
                            column
                            sm="3"
                            className="fw-bold customize-flabel"
                          >
                            Contraseña
                          </Form.Label>
                          <Col sm="9">
                            <Form.Control
                              type="password"
                              placeholder="Ingrese su contraseña"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onClick={handleFieldClick}
                            />
                          </Col>
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicCheckbox"
                          >
                            <Button
                              variant="link"
                              className="fw-bold text-secondary small"
                              onClick={handleShowModalPassword}
                            >
                              ¿Olvidó su contraseña?
                            </Button>
                          </Form.Group>
                        </div>

                        <div className="col-md-2 mx-auto">
                          <Button className="customize-btn-1" type="submit">
                            Ingresar
                          </Button>
                        </div>
                      </fieldset>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        ¿No tiene una cuenta?{" "}
                        <a
                          className="text-secondary fw-bold text-cursor-pointer"
                          onClick={handleShow}
                        >
                          Regístrese
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal centered size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="title-modal1">Registre sus datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Nombres
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Ejemplo: Junior Eliezer"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onClick={handleFieldClick}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Apellidos
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Ejemplo: Vargas Tudela"
                  autoFocus
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onClick={handleFieldClick}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Cargo
              </Form.Label>
              <Col sm="9">
                <Form.Select
                  aria-label="Seleccione rol"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  onClick={handleFieldClick}
                >
                  <option>Seleccione una opción</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.nombre}>
                      {role.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicUsername">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Correo institucional
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="username"
                  placeholder="Ingrese su correo institucional."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onClick={handleFieldClick}
                  isInvalid={
                    username && !isValidUsername(username, selectedRole)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {selectedRole === "Interesado"
                    ? "Formato incorrecto. Utilice el formato primerNombre.primerApellido.numero@unsch.edu.pe"
                    : "Formato incorrecto. Utilice el formato primerNombre.primerApellido@unsch.edu.pe"}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {errorReg && (
              <Alert variant="danger" className="mt-2">
                {errorReg}
              </Alert>
            )}

            <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Contraseña
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de la contraseña
                  onClick={handleFieldClick}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="customize-btn-1"
            type="submit"
            onClick={handleSubmit}
            disabled={!isRegistrationValid || enviandoCorreo}
          >
            {enviandoCorreo ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
                <span> Registrando...</span>
              </>
            ) : (
              <>Registrar</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      {registroExitoso && (
        <Modal
          show={registroExitoso}
          onHide={() => setRegistroExitoso(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Registro exitoso</Modal.Title>
          </Modal.Header>
          <Modal.Body>Se te ha enviado un correo de confirmacion!</Modal.Body>
          <Modal.Footer>
            <Button
              className="customize-btn-1 btn-into-row"
              onClick={() => setRegistroExitoso(false)}
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

<Modal
        centered
        show={showModalPassword}
        onHide={handleCloseModalPassword}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="title-modal1">Cambiar contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-flabel">
                Correo institucional
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="email"
                  placeholder="Ingrese su correo"
                  autoFocus
                  value={resetEmail} // Asigna el valor del correo a resetEmail
                  onChange={(e) => setResetEmail(e.target.value)} // Actualiza resetEmail cuando cambia el valor
                />
                <Form.Text muted>
                  A este correo se le enviará la información respecto a cómo
                  restablecer su contraseña.
                </Form.Text>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>  
          <Button
            className="customize-btn-1"
            onClick={handleEnviarCorreoRestablecer} // Llama a la función para enviar el correo
          >
            Restablecer <i className="fi fi-br-key"></i>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login_Reg;
