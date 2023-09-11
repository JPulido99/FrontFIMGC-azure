import React, { useState } from 'react';
import { Col, Nav, Row, Tab, Accordion, Overlay } from 'react-bootstrap';
import Header from '../shared/Header';
import GenerarMemorandum from '../generarDocs/GenerarMemorandum';
import GenerarResolucion from '../generarDocs/GenerarResolucion';

const SidebarDocs = () => {
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
            <Tab.Container id="left-tabs-example" defaultActiveKey="generar_resolucion">
                <Row className='scroll-h-disabled'>
                    <Col sm={2} className='row-nav-customize'>
                        <Nav variant="pills" className="flex-column customice-nav-text row-nav-customize">
                            <Nav.Item>
                                <Nav.Link className='nav-link-inicio' href="/bienvenido">
                                    <i className="fi fi-br-arrow-small-left"></i> Volver a Inicio</Nav.Link>
                            </Nav.Item>
                            <Accordion defaultActiveKey="generar">
                                <Accordion.Item eventKey="generar">
                                    <Accordion.Header onClick={handleOcultarOverlay}>Generar documentos</Accordion.Header>
                                    <Accordion.Body className='accordion-body-customize'>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="generar_resolucion" onClick={(e) => handleNavItemClick(e.target)}>Generar Resolución</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className='nav-link-customize' eventKey="generar_memo" onClick={(e) => handleNavItemClick(e.target)}>Generar Memorándum</Nav.Link>
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
                            <Tab.Pane eventKey="generar_memo">
                                <GenerarMemorandum />
                            </Tab.Pane>
                            <Tab.Pane eventKey="generar_resolucion">
                                <GenerarResolucion />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}

export default SidebarDocs