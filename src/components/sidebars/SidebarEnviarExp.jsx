import React from 'react';
import { Col, Nav, Row, Tab} from 'react-bootstrap';
import Header from '../shared/Header';
import Expediente from '../Expediente';

const SidebarEnviarExp = () => {
    return (
        <div>
            <Tab.Container id="left-tabs-example" defaultActiveKey="enviar-expediente">
                <Row className='scroll-h-disabled'>
                    <Col sm={2} className='row-nav-customize'>
                        <Nav variant="pills" className="flex-column customice-nav-text row-nav-customize">
                            <Nav.Item>
                                <Nav.Link className='nav-link-inicio' href="/bienvenido">
                                    <i className="fi fi-br-arrow-small-left"></i> Volver a Inicio</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='nav-link-customize-2' eventKey="enviar-expediente" >Enviar expediente</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={10}>
                        <Tab.Content className='customice-tab'>
                            <Header />
                            <Tab.Pane eventKey="enviar-expediente">
                                <Expediente />
                            </Tab.Pane>

                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}

export default SidebarEnviarExp