import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Image, Card, Col, Row, Table, Modal, Alert, Form, Button, InputGroup, NavDropdown } from 'react-bootstrap';
import Header from './shared/Header';
import Footer from './shared/Footer';
import axios from 'axios';
import AuthContext from '../Context/AuthProvider';



const BienvenidoInicio = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const redirectParams = (route) => {
    navigate(route);
  };

  //Para el modal
  const [modalConsulta, setModalConsulta] = useState(false);
  const handleOcultar = () => setModalConsulta(false);
  const handleMostrar = () => setModalConsulta(true);


  //FUNCION VERIFICAR EXPEDIENTE
  const [datosExpedienteEncontrado, setDatosExpedienteEncontrado] = useState({});
  const [nroDoc, setNroDoc] = useState('');
  const [interesadoEmail, setInteresadoEmail] = useState('');

  const [showAlertaExp, setShowAlertaExp] = useState(false);
  const [alertaExp, setAlertaExp] = useState({ message: "", type: "" });

  const mensajesAlert = {
    existe: "Expediente encontrado.",
    noExiste: "Expediente NO encontrado.",
  };

  const verificarExp = async () => {
    const inputNroDoc = document.getElementById('numeroExpInicio').value;
    setNroDoc(inputNroDoc);
    console.log(inputNroDoc);
    try {
      const veriResponse = await axios.get(`https://backfimgc.azurewebsites.net/api/expediente/${inputNroDoc}`);
      console.log(veriResponse.data);
      if (veriResponse.data) {
        setAlertaExp({ message: mensajesAlert.existe, type: 'success' });
        setDatosExpedienteEncontrado(veriResponse.data);

      } else {
        setAlertaExp({ message: mensajesAlert.noExiste, type: 'danger' });
      }
    } catch (error) {
      setAlertaExp({ message: 'Ocurrió un error al realizar la solicitud.', type: 'danger' });
    }
    setShowAlertaExp(true);
  };

  console.log(datosExpedienteEncontrado);

  return (
    <div>
      <Header />
      <Container className='container-bienvenido-titulo'>
        <div className='customize-btn-div justify-content-center'>
          <Image src="/bannerInt.png" />
        </div>
        <Row xs={2} md={3} lg={6} className="g-4 row-cards-customize">
          <Col>
            <Card
              className={`customize-card-2 ${user.role == 1 || user.role == 2 || user.role == 6 ? "active" : "inactive"
                }`}
              onClick={() => {
                if (user.role == 1 || user.role == 2 || user.role == 6) {
                  redirectParams("/tramites");
                }
              }}
            >
              <Card.Img variant="top" src="/r1.png" />
              <Card.Body>
                <p className="card-title-customize">Realizar trámite</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              className={`customize-card-2 ${user.role == 1 ||
                  user.role == 2 ||
                  user.role == 3 ||
                  user.role == 4 ||
                  user.role == 5 ||
                  user.role == 6
                  ? "active"
                  : "inactive"
                }`}
              onClick={handleMostrar}
            >
              <Card.Img variant="top" src="/r2.png" />
              <Card.Body>
                <p className="card-title-customize">Consultar trámite</p>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card
              className={`customize-card-3 ${user.role == 1 ||
                  user.role == 3 ||
                  user.role == 4 ||
                  user.role == 5
                  ? "active"
                  : "inactive"
                }`}
            >
              <Card.Img
                variant="top"
                src="/r6.png"
                alt="Files and folders icons created by Freepik - Flaticon"
              />
              <Card.Body>
                <NavDropdown
                  className="card-title-customize"
                  drop="up-centered"
                  id="nav-dropdown-dark-example"
                  title="Enviar"
                >
                  <NavDropdown.Item
                    className="cardlink"
                    onClick={() => {
                      if (user.role == 4 || user.role == 1) {
                        redirectParams("/enviar-constancia");
                      }
                    }}
                  >
                    Constancia de originalidad
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="cardlink"
                    onClick={() => {
                      if (user.role == 3 || user.role == 1) {
                        redirectParams("/enviar-dictamen");
                      }
                    }}

                  >
                    Dictamen
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="cardlink"
                    onClick={() => {
                      if (user.role == 5 || user.role == 1) {
                        redirectParams("/enviar-expediente");
                      }
                    }}

                  >
                    Expediente
                  </NavDropdown.Item>
                </NavDropdown>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              className={`customize-card-2 ${user.role == 1 ||
                  user.role == 6
                  ? "active"
                  : "inactive"
                }`}
              onClick={() => {
                if (user.role == 6 || user.role == 1) {
                  redirectParams("/documentos");
                }
              }}
            >
              <Card.Img variant="top" src="/r5.png" />
              <Card.Body>
                <p className="card-title-customize">Generar documento</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card

              className={`customize-card-2 ${user.role == 1
                  ? "active"
                  : "inactive"
                }`}
              onClick={() => {
                if (user.role == 6 || user.role == 1) {
                  redirectParams("/params");
                }
              }}
            >
              <Card.Img variant="top" src="/r3.png" />
              <Card.Body>
                <p className="card-title-customize">Parámetros</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              className={`customize-card-2 ${user.role == 1 ||
                  user.role == 6
                  ? "active"
                  : "inactive"
                }`}
              onClick={() => redirectParams("/bandeja")}
            >
              <Card.Img
                variant="top"
                src="/r4.png"
                alt="Bandeja de entrada iconos creados por Freepik - Flaticon"
              />
              <Card.Body>
                <p className="card-title-customize">Bandeja de expedientes</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal aria-labelledby="modal-consultar-tramite" size="lg" show={modalConsulta} centered>
        <Modal.Header closeButton onHide={handleOcultar}>
          <Modal.Title className='title-modal1'>Consultar trámite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <InputGroup>
                <Form.Control type="text" placeholder="Ingrese el número de expediente."
                  aria-label="Ingrese el número de expediente." id="numeroExpInicio"
                />
                <Button variant="outline-dark" onClick={verificarExp}><i className="fi fi-bs-search-alt"></i> Verificar</Button>
              </InputGroup>
              {showAlertaExp && (
                <Alert variant={alertaExp.type} className='customize-alert-input' show={showAlertaExp}>
                  {alertaExp.message}
                </Alert>
              )}
            </Form.Group>
          </Form>
          <Table responsive="sm">
            <thead className='thead-text-customize'>
              <tr>
                <th>Nº de expediente</th>
                <th>Fecha de presentacion</th>
                <th>Estado</th>
                <th>Instancia</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{datosExpedienteEncontrado.nroExpediente}</td>
                <td>{datosExpedienteEncontrado.fechaPresentacion}</td>
                <td>{datosExpedienteEncontrado.estado}</td>
                <td>{datosExpedienteEncontrado.instancia}</td>
                <td><Link to={'/expediente-observado/id'}>Observado</Link></td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      <Footer />

    </div>
  )
}

export default BienvenidoInicio