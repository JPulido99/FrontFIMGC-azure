import React, { useState } from 'react';
import { Col, Nav, Row, Tab, Accordion, Overlay } from 'react-bootstrap';
import Header from '../shared/Header';
import TramitarBachiller from '../tramitar/TramitarBachiller';
import TramitarPlanTesis from '../tramitar/TramitarPlanTesis';
import TramitarBorradoraTesis from '../tramitar/TramitarBorradoraTesis';
import TramitarTitulacion from '../tramitar/TramitarTitulacion';

const SidebarSolicitante = () => {

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
            <Tab.Container id="left-tabs-example" defaultActiveKey="bachiller">
                <Row className='scroll-h-disabled'>
                    <Col sm={2} className='row-nav-customize'>
                        <Nav variant="pills" className="flex-column customice-nav-text row-nav-customize">
                            <Nav.Item>
                                <Nav.Link className='nav-link-inicio' href="/bienvenido">
                                    <i className="fi fi-br-arrow-small-left"></i> Volver a Inicio</Nav.Link>
                            </Nav.Item>
                            <Accordion defaultActiveKey="realizar-tramite">
                                <Accordion.Item eventKey="realizar-tramite">
                                    <Accordion.Header onClick={handleOcultarOverlay}>Realizar trámite</Accordion.Header>
                                    <Accordion.Body className='accordion-body-customize'>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="bachiller" onClick={(e) => handleNavItemClick(e.target)}>Grado académico de Bachiller</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="plan_tesis" onClick={(e) => handleNavItemClick(e.target)}>Plan de tesis y designación de asesor</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="borradora_tesis" onClick={(e) => handleNavItemClick(e.target)}>Borradora de tesis y sustentación</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="titulacion" onClick={(e) => handleNavItemClick(e.target)}>Título profesional (Modalidad Tesis)</Nav.Link>
                                        </Nav.Item>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Nav.Item>
                            </Nav.Item>

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
                        <Header />
                        <Tab.Content className='customice-tab'>
                            <Tab.Pane eventKey="bachiller">
                                <TramitarBachiller />
                            </Tab.Pane>
                            <Tab.Pane eventKey="plan_tesis">
                                <TramitarPlanTesis />
                            </Tab.Pane>
                            <Tab.Pane eventKey="borradora_tesis">
                                <TramitarBorradoraTesis />
                            </Tab.Pane>
                            <Tab.Pane eventKey="titulacion">
                                <TramitarTitulacion />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}

export default SidebarSolicitante