import React, { useState } from 'react';
import { Col, Nav, Row, Tab, Accordion, Overlay } from 'react-bootstrap';
import Header from '../shared/Header';
import EP from '../parametros/EP';
import PlanEstudios from '../parametros/PlanEstudios';
import PruebaPlan from '../parametros/PruebaPlan';
import Rol from '../parametros/Rol';
import TipoDocumento from '../parametros/TipoDocumento';
import Tramite from '../parametros/Tramite';
import Modalidad from '../parametros/Modalidad';

const SidebarParams = () => {
    //Para el overlay
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayTarget, setOverlayTarget] = useState(null);
    const handleOcultarOverlay = () => setShowOverlay(false);

    const handleNavItemClick = (eventTarget) => {
        setShowOverlay(true);
        setOverlayTarget(eventTarget);
    };
    return (
        <div>
            <Tab.Container id="left-tabs-example" defaultActiveKey="eps">
                <Row className='scroll-h-disabled'>
                    <Col sm={2} className='row-nav-customize'>
                        <Nav variant="pills" className="flex-column customice-nav-text row-nav-customize">
                            <Nav.Item>
                                <Nav.Link className='nav-link-inicio' href="/bienvenido">
                                    <i className="fi fi-br-arrow-small-left"></i> Volver a Inicio</Nav.Link>
                            </Nav.Item>
                            <Accordion defaultActiveKey="parametros">
                                <Accordion.Item eventKey="parametros">
                                    <Accordion.Header onClick={handleOcultarOverlay}>Parámetros</Accordion.Header>
                                    <Accordion.Body className='accordion-body-customize'>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="eps" onClick={(e) => handleNavItemClick(e.target)}>Escuelas profesionales</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="modalidades" onClick={(e) => handleNavItemClick(e.target)}>Modalidades</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="planes" onClick={(e) => handleNavItemClick(e.target)}>Planes de estudios</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="roles" onClick={(e) => handleNavItemClick(e.target)}>Roles</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="tipos-documentos" onClick={(e) => handleNavItemClick(e.target)}>Tipos de documentos</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="tramites" onClick={(e) => handleNavItemClick(e.target)}>Trámites</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="pruebaPlan" onClick={(e) => handleNavItemClick(e.target)}>PruebaPlan</Nav.Link>
                                        </Nav.Item>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Overlay target={overlayTarget} show={showOverlay} placement="right">
                                {({
                                    arrowProps: _arrowProps,
                                    show: _show,
                                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                                    ...props
                                }) => (
                                    <div {...props} className="overlay-container">.</div>
                                )}
                            </Overlay>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content className='customice-tab'>
                            <Header />
                            <Tab.Pane eventKey="eps">
                                <EP />
                            </Tab.Pane>
                            <Tab.Pane eventKey="modalidades">
                                <Modalidad />
                            </Tab.Pane>
                            <Tab.Pane eventKey="planes">
                                <PlanEstudios />
                            </Tab.Pane>
                            <Tab.Pane eventKey="roles">
                                <Rol />
                            </Tab.Pane>
                            <Tab.Pane eventKey="tipos-documentos">
                                <TipoDocumento />
                            </Tab.Pane>
                            <Tab.Pane eventKey="tramites">
                                <Tramite />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}

export default SidebarParams