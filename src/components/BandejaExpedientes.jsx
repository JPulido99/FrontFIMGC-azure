import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Form, FormCheck, Table, InputGroup, Button, Row, Col, Alert, Modal, OverlayTrigger, Tooltip, Tab, Tabs } from 'react-bootstrap';
import { format } from 'date-fns';

const BandejaExpedientes = () => {

  const[tipoDoc, setTipoDoc] = useState('');

  const handleTipoChange = (event) => {
    setTipoDoc(event.target.value);
  };

  //Para buscar por nombre
  //Para el modal docentes
  const [modalMemorandos, setModalmemorandos] = useState(false);
  const handleHide = () => setModalmemorandos(false);

  const [memorandos, setMemorandos] = useState([]);

  const [nombreInteresado, setNombreInteresado] = useState('');

  const handleNombreChange = (event) => {
    setNombreInteresado(event.target.value);
  };

  const handleBuscarClickMMxNombre = () => {
    axios
      .get(`https://fimgc-back.rj.r.appspot.com/api/documento/findMMxNombre?Name=${nombreInteresado}&tipoDoc=${tipoDoc}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          console.log(response.data);
          setMemorandos(response.data);
          setModalmemorandos(true);

        } else {
          console.log('La respuesta del servidor está vacía o incompleta.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

   //Para buscar por numero de exeppdeitne
  //Para el modal docentes

  const [numeroExpediente, setNumeroExpediente] = useState('');

  const handleNumeroChange = (event) => {
    setNumeroExpediente(event.target.value);
  };

  const handleBuscarClickMMxExp = () => {
    axios
      .get(`https://fimgc-back.rj.r.appspot.com/api/documento/findMMxNroExpediente?nroExpediente=${numeroExpediente}&tipoDoc=${tipoDoc}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          console.log(response.data);
          setMemorandos(response.data);
          setModalmemorandos(true);

        } else {
          console.log('La respuesta del servidor está vacía o incompleta.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handleVerClick = (archivopdfSF) => {
    const baseUrl = 'https://fimgc-back.rj.r.appspot.com'; // Cambia esto si es necesario
    const pdfUrl = `${baseUrl}/${archivopdfSF}`;
    window.open(pdfUrl, '_blank');
  };



  return (
    <div>
      <Tabs defaultActiveKey="MM" className="mb-3">
        <Tab tabClassName='horizontal-nav-link' eventKey="MM" title="Memorando Múltiple">

          <Container>
            <legend className='customize-legend-2 text-uppercase'>Buscar por:</legend>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label">
                Tipo de Documento
              </Form.Label>
              <Col sm="10">
                <FormCheck
                  inline
                  label="Memorando Múltiple"
                  name="tipoDocumento"
                  value="1"
                  type="radio"
                  checked={tipoDoc === "1"}
                  onChange={handleTipoChange}
                />
                <FormCheck
                  inline
                  label="Resolución Decanal"
                  name="tipoDocumento"
                  value="3"
                  type="radio"
                  checked={tipoDoc === "3"}
                  onChange={handleTipoChange}
                />
                <FormCheck
                  inline
                  label="Resolución de Consejo de Facultad"
                  name="tipoDocumento"
                  value="5"
                  type="radio"
                  checked={tipoDoc === "5"}
                  onChange={handleTipoChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Nombre del interesado</Form.Label>
              <Col sm="9">
                <InputGroup>
                  <Form.Control type="text" id="nombreInteresado" name="nombreInteresado" value={nombreInteresado} onChange={handleNombreChange} />
                  <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarClickMMxNombre}><i className="fi fi-bs-search"></i> Buscar</Button>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Número de expediente</Form.Label>
              <Col sm="9">
                <InputGroup>
                  <Form.Control type="text" id="numeroExpediente" name="numeroExpediente" value={numeroExpediente} onChange={handleNumeroChange} />
                  <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarClickMMxExp}><i className="fi fi-bs-search"></i> Buscar</Button>
                </InputGroup>
              </Col>
            </Form.Group>
          </Container>

          <Modal aria-labelledby="modal-de-memorandos" size="lg" show={modalMemorandos}>
              <Modal.Header closeButton onHide={handleHide}>
                <Modal.Title className='title-modal1'>Lista de memorandos</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container className='table-container'>
                  <Table responsive="sm">
                    <thead className='thead-text-customize'>
                      <tr>
                      <th>Tramite</th>
                      <th>Número de expediente</th>
                        <th>Numero de memorando</th>
                        <th>Fecha de generación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memorandos.map((memorando) => (
                        <tr key={memorando.id} >
                          <td>{memorando.expediente.tramite.nombre}</td>
                          <td>{memorando.expediente.nroExpediente}</td>
                          <td>{memorando.numeroDocumento}</td>
                          <td>{memorando.fechaGeneracion ? format(new Date(memorando.fechaGeneracion), 'dd/MM/yyyy HH:mm:ss') : 'Fecha vacía'}</td>
                          <td><Button size='sm' variant="outline-success btn-into-table" onClick={() => handleVerClick(memorando.archivopdfSF)} ><i className="fi fi-bs-file-pdf"></i> .pdf</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Container>
              </Modal.Body>
            </Modal>

        </Tab>

        <Tab tabClassName='horizontal-nav-link' eventKey="Exp" title="Expedientes">
          <Container>
            <legend className='customize-legend-2 text-uppercase'>Buscar por:</legend>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Nombre del interesado</Form.Label>
              <Col sm="9">
                <InputGroup>
                  <Form.Control type="text" id="nombreInteresado" name="nombreInteresado" value={nombreInteresado} onChange={handleNombreChange} />
                  <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarClickMMxNombre}><i className="fi fi-bs-search"></i> Buscar</Button>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Número de expediente</Form.Label>
              <Col sm="9">
                <InputGroup>
                  <Form.Control type="text" id="numeroExpediente" name="numeroExpediente" value={numeroExpediente} onChange={handleNumeroChange} />
                  <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarClickMMxExp}><i className="fi fi-bs-search"></i> Buscar</Button>
                </InputGroup>
              </Col>
            </Form.Group>
          </Container>
        </Tab>


          

      </Tabs>
    </div>
  )
}

export default BandejaExpedientes