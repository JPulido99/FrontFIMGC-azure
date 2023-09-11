import React, { useState } from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { Container, Row, Col, Nav, Tab, Table, Button, Form, Modal } from 'react-bootstrap';

const SolicitanteExpedientesObservados = () => {

    const [modalModificacion, setModalModificacion] = useState(false);
    const handleOcultarModalModificacion = () => setModalModificacion(false);
    const handleMostrarModalModificacion = () => setModalModificacion(true);

    return (
        <div>
            <Tab.Container id="left-tabs-example">
                <Row >
                    <Col sm={2} className='row-nav-customize'>
                        <Nav variant="pills" className="flex-column customice-nav-text row-nav-customize">
                            <Nav.Item>
                                <Nav.Link className='nav-link-inicio' href="#/bienvenido">
                                    <i className="fi fi-br-arrow-small-left"></i> Volver a Inicio</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Header />
                        <Tab.Content>
                            <Container className='table-container'>
                                <legend className='customize-legend-2 text-uppercase'>Expedientes observados</legend>
                                <Table responsive="sm">
                                    <thead className='thead-text-customize'>
                                        <tr>
                                            <th>Nº de expediente</th>
                                            <th>Tipo de trámite</th>
                                            <th>Fecha</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Nº de expediente</td>
                                            <td>Tipo de trámite</td>
                                            <td>Fecha</td>
                                            <td>
                                                <Button size="sm" variant="outline-success btn-into-table">Ver <i className="fi fi-bs-eye"></i></Button>
                                                <Button size="sm" variant="outline-secondary btn-into-table" onClick={handleMostrarModalModificacion}>Modificar <i className="fi fi-bs-file-edit"></i></Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                                <legend className='customize-legend-2 text-uppercase'>Expedientes corregidos</legend>
                                <Table responsive="sm">
                                    <thead className='thead-text-customize'>
                                        <tr>
                                            <th>Nº de expediente</th>
                                            <th>Tipo de trámite</th>
                                            <th>Fecha</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Nº de expediente</td>
                                            <td>Tipo de trámite</td>
                                            <td>Fecha</td>
                                            <td><Button size="sm" variant="outline-success btn-into-table">Enviar al jurado <i className="fi fi-bs-paper-plane"></i></Button></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Container>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            <Footer />

            <Modal aria-labelledby="modal-modificación" size="lg" centered show={modalModificacion}>
                <Modal.Header closeButton onHide={handleOcultarModalModificacion}>
                    <Modal.Title className='title-modal1'>Modificar expediente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label className="fw-bold customize-label">Cargue el expediente corregido</Form.Label>
                        <Col sm="12">
                            <Form.Control type="file" />
                        </Col>
                    </Form.Group>
                    <Button className='customize-btn-1'>Guardar <i className="fi fi-bs-disk"></i></Button>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SolicitanteExpedientesObservados