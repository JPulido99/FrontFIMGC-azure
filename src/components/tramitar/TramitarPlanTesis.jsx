import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Form, Table, InputGroup, Button, Row, Col, Alert, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useGet from '../../hooks/useGet';
import AuthContext from '../../Context/AuthProvider';
import useTooltips from '../../utilitarios/useTooltips';

const TramitarPlanTesis = () => {
  const { user } = useContext(AuthContext);

  const [escuelas, obtenerEscuelas] = useGet("https://fimgc-back.rj.r.appspot.com/api/escuela/list");
  useEffect(() => {
    obtenerEscuelas()
  }, [])

  const [asesorId, setAsesorId] = useState('');
  const [telefono, setTelefono] = useState('');
  const [selectedEscuelaId, setSelectedEscuelaId] = useState('');

  //Para el modal docentes
  const [modalDocentes, setModaldocentes] = useState(false);
  const handleHide = () => setModaldocentes(false);

  //Para buscar docentes
  const [nombre, setNombre] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [nombreAsesor, setNombreAsesor] = useState('');


  const handleNombreChange = (event) => {
    setNombreAsesor(event.target.value);
  };

  const handleBuscarClick = () => {
    axios
      .get(`https://fimgc-back.rj.r.appspot.com/users/buscarDocentes?firstName=${nombreAsesor}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setDocentes(response.data);
          setModaldocentes(true);
          setAsesorId(response.data[0].id);
        } else {
          console.log('La respuesta del servidor está vacía o incompleta.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSeleccionarDocente = (docente) => {
    setNombreAsesor(`${docente.firstName} ${docente.lastName}`);
    setModaldocentes(false);
  };

  //Para los tooltip
  const { renderTooltip } = useTooltips();

  //Para el modal exitoso 
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  //Para el modal en el que se ven los datos ingresados
  const [modalDatosPT, setModalDatosPT] = useState(false);
  const handleOcultarDPT = () => setModalDatosPT(false);

  //Para el alert
  const [showAlertPT, setShowAlertPT] = useState(false);

  //Para los datos a visualizarse en el modal
  const [prevDatosPT, setPrevDatosPT] = useState({});
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState('');


  const [expediente, setExpediente] = useState({
    nroExpediente: '',
    fechaPresentacion: '',
    instancia: '',
    estado: '',
    tituloTesis: '',
  });


  //Función para limpiar luego de Tramitar
  const limpiarFormulario = () => {
    setExpediente({
      nroExpediente: '',
      fechaPresentacion: '',
      instancia: '',
      estado: '',
      tituloTesis: '',
    });
    setSelectedEscuelaId('');
    setNombreAsesor('');
    setTelefono('');
  };

  const handleInputChange2 = async (event) => {
    const { name, value } = event.target;

    if (name === 'escuela') {
      setSelectedEscuelaId(value);
    } else if (name === 'nroExpediente') {
      // Validar que solo se ingresen números
      const regex = /^[0-9.]+$/;
      if (value === '' || regex.test(value)) {
        setExpediente((prevExpediente) => ({
          ...prevExpediente,
          [name]: value,
        }));
      }
    } else if (name === 'telefono') {
      // Validar que solo se ingresen números
      const regex = /^[0-9\b]+$/;
      if (value === '' || regex.test(value)) {
        setTelefono(value);
      }
    } else {
      setExpediente((prevExpediente) => ({
        ...prevExpediente,
        [name]: value
      }));
    }
  };

  const obtenerNombreEscuela = (selectedEscuelaId) => {
    // Realiza una consulta a tu API para obtener el nombre de la escuela por su ID
    return axios
      .get(`https://fimgc-back.rj.r.appspot.com/api/escuela/${selectedEscuelaId}`)
      .then((response) => {
        return response.data.nombre;
      })
      .catch((error) => {
        console.error(error);
        return "Bueh, se hizo el intento.";
      });
  };

  // Estado para controlar si el botón Visualizar ha sido clickeado
  const [visualizarClicked, setVisualizarClicked] = useState(false);

  // Habilitar o deshabilitar el botón Tramitar
  const isTramitarDisabled = !(expediente.tituloTesis !== '' && nombreAsesor !== '' && expediente.nroExpediente !== '' && expediente.fechaPresentacion !== '' && telefono !== '');



  const handleVisualizar = async () => {
    if (
      expediente.tituloTesis === '' ||
      nombreAsesor === '' ||
      expediente.nroExpediente === '' ||
      expediente.fechaPresentacion === '' ||
      telefono === ''
    ) {
      setShowAlertPT(true);
      setVisualizarClicked(false); // Si hay campos vacíos, deshacer el clic del botón Visualizar
    } else {
      setShowAlertPT(false);
      const escuelaSeleccionada = await obtenerNombreEscuela(selectedEscuelaId);
      setPrevDatosPT({
        tesis: expediente.tituloTesis,
        asesor: nombreAsesor,
        numeroexp: expediente.nroExpediente,
        fechapre: expediente.fechaPresentacion,
        escuelaNombre: escuelaSeleccionada,
        telefono: telefono,
      });
      setModalDatosPT(true);
      setVisualizarClicked(true); // Marcar el botón Visualizar como clickeado
    }
  };

  //Wardar en la base de datos
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Obten el nombre de la escuela antes de enviar el formulario
      const escuelaNombre = await obtenerNombreEscuela(selectedEscuelaId);

      const expedienteData = {
        ...expediente
      };

      const response = await axios.post(
        `https://fimgc-back.rj.r.appspot.com/api/expediente/${user.id}/expedienteUserEscuela?asesorId=${asesorId}&escuelaId=${selectedEscuelaId}&telefono=${telefono}`,
        expedienteData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Expediente registrado:', response.data);
      setRegistroExitoso(true);
      setFormularioEnviado(true);
      //Para limpiar el form
      limpiarFormulario();
      // Realiza las acciones adicionales después de registrar el expediente

    } catch (error) {
      console.error('Error al registrar el expediente:', error);
      // Maneja el error de manera adecuada
    }
  };

  return (
    <div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <fieldset className='customize-fielset'>
            <legend className='customize-legend text-uppercase'>Solicitar aprobación de plan de tesis y designación de asesor</legend>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Escuela profesional</Form.Label>
              <Col sm="9">
                <Form.Select aria-label="Escuela profesional" name="escuela" value={selectedEscuelaId} onChange={handleInputChange2}>
                  <option>Seleccione</option>
                  {escuelas.map((escuela) => (
                    <option key={escuela.id} value={escuela.id}>
                      {escuela.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Título del plan de tesis</Form.Label>
              <Col sm="9">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'tituloPlan')}>
                  <Form.Control as="textarea" type="text"
                    id="tituloTesis" name="tituloTesis" value={expediente.tituloTesis} onChange={handleInputChange2} />
                </OverlayTrigger>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Nombre de su asesor</Form.Label>
              <Col sm="9">
                <InputGroup>
                  <Form.Control type="text" id="nombreAsesor" name="nombreAsesor" value={nombreAsesor} onChange={handleNombreChange} />
                  <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarClick}><i className="fi fi-bs-search"></i> Buscar</Button>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Nº de expediente</Form.Label>
              <Col sm="3">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'expediente')}>
                  <Form.Control type="text" id="nroExpediente" name="nroExpediente" value={expediente.nroExpediente} onChange={handleInputChange2} />
                </OverlayTrigger>
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">Fecha de registro de exp.</Form.Label>
              <Col sm="2">
                <Form.Control type="date" id="fechaPresentacion" name="fechaPresentacion" value={expediente.fechaPresentacion} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Nº de teléfono del interesado</Form.Label>
              <Col sm="3">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'celular')}>
                  <Form.Control type="text" id="telefono" name="telefono" value={telefono} onChange={handleInputChange2} />
                </OverlayTrigger>
                <Form.Text muted>
                  En caso sea necesario nos contactaremos a este número.
                </Form.Text>
              </Col>
            </Form.Group>

            {showAlertPT && (
              <Alert key="danger" variant="danger">
                <i className="fi fi-br-exclamation"></i> Debe rellenar todos los campos.
              </Alert>
            )}


            <div className="col-md-3 mx-auto">
              <Button className='customize-btn-1 btn-into-row' onClick={handleVisualizar}>Visualizar <i className="fi fi-bs-eye"></i></Button>{' '}
              <Button variant="success btn-into-row" type="submit" disabled={!visualizarClicked || isTramitarDisabled}>Tramitar <i className="fi fi-bs-disk"></i></Button>
            </div>

          </fieldset>
        </Form>

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
            <Modal.Body>¡El registro se realizó con éxito!</Modal.Body>
            <Modal.Footer>
              <Button className='customize-btn-1 btn-into-row' onClick={() => setRegistroExitoso(false)}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
        )}

        {formularioEnviado && (
          <div>
            {/* Aquí puedes agregar un mensaje para indicar que el formulario ha sido enviado */}
          </div>
        )}


        <Modal aria-labelledby="modal-de-docentes" size="lg" show={modalDocentes}>
          <Modal.Header closeButton onHide={handleHide}>
            <Modal.Title className='title-modal1'>Seleccionar docente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className='table-container'>
              <Table responsive="sm">
                <thead className='thead-text-customize'>
                  <tr>
                    <th>Nombre completo</th>
                    <th>Escuela profesional</th>
                    <th>Correo electrónico</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {docentes.map((docente) => (
                    <tr key={docente.id} >
                      <td>{`${docente.firstName} ${docente.lastName}`}</td>
                      <td>{docente.escuela.nombre}</td>
                      <td>{docente.username}</td>
                      <td><Button size='sm' variant="outline-success btn-into-table" onClick={() => handleSeleccionarDocente(docente)}>Seleccionar <i className="fi fi-br-check"></i></Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Modal.Body>
        </Modal>


        <Modal aria-labelledby="modal-previsulizacion" size="lg" show={modalDatosPT}>
          <Modal.Header closeButton onHide={handleOcultarDPT}>
            <Modal.Title className='title-modal1'>Verificar datos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='p-modal-bold'>¿Los datos que se muestran a continuación son correctos?</p>
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Escuela profesional</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosPT.escuelaNombre} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Título de la borradora de tesis</Form.Label>
                <Col sm="8">
                  <Form.Control as="textarea" plaintext readOnly value={prevDatosPT.tesis} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nombre del asesor</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosPT.asesor} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de expediente</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosPT.numeroexp} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de ingreso de expediente</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosPT.fechapre} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de celular</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosPT.telefono} />
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default TramitarPlanTesis