import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Form, Table, InputGroup, Button, Row, Col, Alert, Modal, OverlayTrigger } from 'react-bootstrap';
import useGet from '../../hooks/useGet';
import AuthContext from '../../Context/AuthProvider';
import useTooltips from '../../utilitarios/useTooltips';

const TramitarBorradoraTesis = () => {
  const { user } = useContext(AuthContext);

  const [escuelas, obtenerEscuelas] = useGet("https://backfimgc.azurewebsites.net/api/escuela/list");
  useEffect(() => {
    obtenerEscuelas()
  }, [])

  //Para los tooltips
  const { renderTooltip } = useTooltips();

  const [asesorId, setAsesorId] = useState('');
  const [miembroId, setMiembroId] = useState('');
  const [presidenteId, setPresidenteId] = useState('');
  const [telefono, setTelefono] = useState('');
  const [selectedEscuelaId, setSelectedEscuelaId] = useState('');

  //Para el modal docentesAsesor
  const [modalDocentesAsesor, setModaldocentesAsesor] = useState(false);
  const handleHideAsesor = () => setModaldocentesAsesor(false);
  //Para el modal docentesMiembro
  const [modalDocentesMiembro, setModaldocentesMiembro] = useState(false);
  const handleHideMiembro = () => setModaldocentesMiembro(false);
  //Para el modal docentesPresidente
  const [modalDocentesPresidente, setModaldocentesPresidente] = useState(false);
  const handleHidePresidente = () => setModaldocentesPresidente(false);


  //Para buscar docentes
  const [nombre, setNombre] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [nombreAsesor, setNombreAsesor] = useState('');
  const [nombreMiembro, setNombreMiembro] = useState('');
  const [nombrePresidente, setNombrePresidente] = useState('');

  const handleAsesorChange = (event) => {
    setNombreAsesor(event.target.value);
  };

  const handleMiembroChange = (event) => {
    setNombreMiembro(event.target.value);
  };

  const handlePresidenteChange = (event) => {
    setNombrePresidente(event.target.value);
  };

  const handleBuscarAsesor = () => {
    axios
      .get(`https://backfimgc.azurewebsites.net/users/buscarDocentes?firstName=${nombreAsesor}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setDocentes(response.data);
          setModaldocentesAsesor(true);
        } else {
          console.log('La respuesta del servidor está vacía o incompleta.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleBuscarMiembro = () => {
    axios
      .get(`https://backfimgc.azurewebsites.net/users/buscarDocentes?firstName=${nombreMiembro}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setDocentes(response.data);
          setModaldocentesMiembro(true);
        } else {
          console.log('La respuesta del servidor está vacía o incompleta.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleBuscarPresidente = () => {
    axios
      .get(`https://backfimgc.azurewebsites.net/users/buscarDocentes?firstName=${nombrePresidente}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setDocentes(response.data);
          setModaldocentesPresidente(true);
        } else {
          console.log('La respuesta del servidor está vacía o incompleta.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSeleccionarDocenteAsesor = (docente) => {
    setNombreAsesor(`${docente.firstName} ${docente.lastName}`);
    setAsesorId(docente.id);
    console.log("asesor", docente.id);
    setModaldocentesAsesor(false);
  };

  const handleSeleccionarDocenteMiembro = (docente) => {
    setNombreMiembro(`${docente.firstName} ${docente.lastName}`);
    setMiembroId(docente.id);
    console.log("miembro", docente.id);
    setModaldocentesMiembro(false);
  };

  const handleSeleccionarDocentePresidente = (docente) => {
    setNombrePresidente(`${docente.firstName} ${docente.lastName}`);
    setPresidenteId(docente.id);
    console.log("presidente", docente.id);

    setModaldocentesPresidente(false);
  };


  //Para el modal exitoso
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  // Para el modal en el que se ven los datos ingresados
  const [modalDatosBT, setModalDatosBT] = useState(false);
  const handleOcultarDBT = () => setModalDatosBT(false);

  //Para el alert
  const [showAlertBT, setShowAlertBT] = useState(false);

  // Para los datos a visualizarse en el modal
  const [prevDatosBT, setPrevDatosBT] = useState({});
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState('');


  const [expediente, setExpediente] = useState({
    nroExpediente: '',
    fechaPresentacion: '',
    instancia: '',
    estado: '',
    tituloTesis: '',
    fechaObtencionGrado: '',
    nroRCU: '',
    libro: '',
    folio: '',
    nroMMAprobacionPlan: '',
    fechaMMAprobacionPlan: '',
    nroRDAprobacionPlan: '',
    fechaRDAprobacionPlan: '',
  });

  //Función para limpiar luego de Tramitar
  const limpiarFormulario = () => {
    setExpediente({
      nroExpediente: '',
      fechaPresentacion: '',
      instancia: '',
      estado: '',
      tituloTesis: '',
      fechaObtencionGrado: '',
      nroRCU: '',
      libro: '',
      folio: '',
      nroMMAprobacionPlan: '',
      fechaMMAprobacionPlan: '',
      nroRDAprobacionPlan: '',
      fechaRDAprobacionPlan: '',
    });
    setSelectedEscuelaId('');
    setNombreAsesor('');
    setNombreMiembro('');
    setNombrePresidente('');
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
      .get(`https://backfimgc.azurewebsites.net/api/escuela/${selectedEscuelaId}`)
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
      setShowAlertBT(true);
      setVisualizarClicked(false); // Si hay campos vacíos, deshacer el clic del botón Visualizar
    } else {
      setShowAlertBT(false);
      const escuelaSeleccionada = await obtenerNombreEscuela(selectedEscuelaId);
      setPrevDatosBT({
        tesis: expediente.tituloTesis,
        asesor: nombreAsesor,
        miembro: nombreMiembro,
        presidente: nombrePresidente,
        numeroexp: expediente.nroExpediente,
        fechapre: expediente.fechaPresentacion,
        escuelaNombre: escuelaSeleccionada,
        telefono: telefono,
        fechaGrado: expediente.fechaObtencionGrado,
        numeroRCU: expediente.nroRCU,
        libro: expediente.libro,
        folio: expediente.folio,
        numeroMM: expediente.nroMMAprobacionPlan,
        fechaMM: expediente.fechaMMAprobacionPlan,
        numeroRD: expediente.nroRDAprobacionPlan,
        fechaRD: expediente.fechaRDAprobacionPlan,
      });
      console.log(prevDatosBT);
      setModalDatosBT(true);
      setVisualizarClicked(true); // Marcar el botón Visualizar como clickeado
    }
  };



  //Wardar en la base de datos

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const expedienteData = {
        ...expediente
      };

      const response = await axios.post(
        `https://backfimgc.azurewebsites.net/api/expediente/${user.id}/expedienteUserEscuelaBorrador?asesorId=${asesorId}&miembroId=${miembroId}&presidenteId=${presidenteId}&escuelaId=${selectedEscuelaId}&telefono=${telefono}`,
        expedienteData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Expediente registrado:', response.data, asesorId, presidenteId, miembroId);
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
            <legend className='customize-legend text-uppercase'>Solicitar aprobación de borrador de tesis y sustentación</legend>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Escuela profesional</Form.Label>
              <Col sm="8">
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
              <Form.Label column sm="4" className="fw-bold customize-label">Nº de expediente</Form.Label>
              <Col sm="3">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'expediente')}>
                  <Form.Control type="text" id="nroExpediente" name="nroExpediente" value={expediente.nroExpediente} onChange={handleInputChange2} />
                </OverlayTrigger>
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">Fecha de ingreso del expediente</Form.Label>
              <Col sm="2">
                <Form.Control type="date" id="fechaPresentacion" name="fechaPresentacion" value={expediente.fechaPresentacion} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Nº de resolucion de consejo universitario</Form.Label>
              <Col sm="3">
                <Form.Control type="text" id="nroRCU" name="nroRCU" value={expediente.nroRCU} onChange={handleInputChange2} />
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">Fecha de obtención de grado</Form.Label>
              <Col sm="2">
                <Form.Control type="date" id="fechaObtencionGrado" name="fechaObtencionGrado" value={expediente.fechaObtencionGrado} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Libro</Form.Label>
              <Col sm="3">
                <Form.Control type="text" id="libro" name="libro" placeholder="Ejemplo: I, II, III, ..." value={expediente.libro} onChange={handleInputChange2} />
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">Folio</Form.Label>
              <Col sm="2">
                <Form.Control type="text" id="folio" name="folio" placeholder="Ejemplo: 4, 15, 468, ..." value={expediente.folio} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Título del borrador de tesis</Form.Label>
              <Col sm="8">
                <Form.Control as="textarea" type="text"
                  id="tituloTesis" name="tituloTesis" value={expediente.tituloTesis} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Asesor</Form.Label>
              <Col sm="8">
                <InputGroup>
                  <Form.Control type="text" id="nombreAsesor" name="nombreAsesor" value={nombreAsesor} onChange={handleAsesorChange} />
                  <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarAsesor}><i className="fi fi-bs-search"></i> Buscar</Button>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Miembro</Form.Label>
              <Col sm="8">
                <InputGroup>
                  <Form.Control type="text" id="nombreMiembro" name="nombreMiembro" value={nombreMiembro} onChange={handleMiembroChange} />
                  <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarMiembro}><i className="fi fi-bs-search"></i> Buscar</Button>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Presidente</Form.Label>
              <Col sm="8">
                <InputGroup>
                  <Form.Control type="text" id="nombrePresidente" name="nombrePresidente" value={nombrePresidente} onChange={handlePresidenteChange} />
                  <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarPresidente}><i className="fi fi-bs-search"></i> Buscar</Button>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Número de memorando múltiple</Form.Label>
              <Col sm="3">
                <Form.Control type="text" id="nroMMAprobacionPlan" name="nroMMAprobacionPlan" aria-label="Ingrese el número de expediente." value={expediente.nroMMAprobacionPlan}
                  aria-describedby="basic-addon1" onChange={handleInputChange2}
                />
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">Fecha de memorando múltiple</Form.Label>
              <Col sm="2">
                <Form.Control type="date" id="fechaMMAprobacionPlan" name="fechaMMAprobacionPlan" value={expediente.fechaMMAprobacionPlan} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Número de resolución decanal</Form.Label>
              <Col sm="3">
                <Form.Control type="text" id="nroRDAprobacionPlan" name="nroRDAprobacionPlan" aria-label="Ingrese el número de expediente." value={expediente.nroRDAprobacionPlan}
                  aria-describedby="basic-addon1" onChange={handleInputChange2}
                />
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">Fecha de resolución decanal</Form.Label>
              <Col sm="2">
                <Form.Control type="date" id="fechaRDAprobacionPlan" name="fechaRDAprobacionPlan" value={expediente.fechaRDAprobacionPlan} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Nº de teléfono del interesado</Form.Label>
              <Col sm="3">
                <Form.Control type="text" id="telefono" name="telefono" value={telefono} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            {showAlertBT && (
              <Alert key="danger" variant="danger">
                <i className="fi fi-br-exclamation"></i> Debe rellenar todos los
                campos.
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


        <Modal aria-labelledby="modal-de-docentes" size="lg" show={modalDocentesAsesor}>
          <Modal.Header closeButton onHide={handleHideAsesor}>
            <Modal.Title className='title-modal1'>Seleccionar Asesor</Modal.Title>
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
                      <td>{docente.email}</td>
                      <td><Button size='sm' variant="outline-success btn-into-table" onClick={() => handleSeleccionarDocenteAsesor(docente)}>Seleccionar <i className="fi fi-br-check"></i></Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Modal.Body>
        </Modal>

        <Modal aria-labelledby="modal-de-docentes" size="lg" show={modalDocentesMiembro}>
          <Modal.Header closeButton onHide={handleHideMiembro}>
            <Modal.Title className='title-modal1'>Seleccionar Miembro</Modal.Title>
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
                      <td>{docente.email}</td>
                      <td><Button size='sm' variant="outline-success btn-into-table" onClick={() => handleSeleccionarDocenteMiembro(docente)}>Seleccionar <i className="fi fi-br-check"></i></Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Modal.Body>
        </Modal>

        <Modal aria-labelledby="modal-de-docentes" size="lg" show={modalDocentesPresidente}>
          <Modal.Header closeButton onHide={handleHidePresidente}>
            <Modal.Title className='title-modal1'>Seleccionar Presidente</Modal.Title>
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
                      <td>{docente.email}</td>
                      <td><Button size='sm' variant="outline-success btn-into-table" onClick={() => handleSeleccionarDocentePresidente(docente)}>Seleccionar <i className="fi fi-br-check"></i></Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Modal.Body>
        </Modal>


        <Modal aria-labelledby="modal-previsulizacion" size="lg" show={modalDatosBT}>
          <Modal.Header closeButton onHide={handleOcultarDBT}>
            <Modal.Title className='title-modal1'>Verificar datos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='p-modal-bold'>¿Los datos que se muestran a continuación son correctos?</p>
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Escuela profesional</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosBT.escuelaNombre} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de expediente</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBT.numeroexp} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de ingreso de expediente</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBT.fechapre} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de celular</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBT.telefono} />
                </Col>
              </Form.Group>


              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de RCU</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBT.numeroRCU} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de obtención de grado</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBT.fechaGrado} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Libro</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBT.libro} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Folio</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBT.folio} />
                </Col>
              </Form.Group>


              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Título de la borradora de tesis</Form.Label>
                <Col sm="8">
                  <Form.Control as="textarea" plaintext readOnly value={prevDatosBT.tesis} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nombre asesor</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosBT.asesor} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nombre miembro</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosBT.miembro} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nombre presidente</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosBT.presidente} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de MM</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBT.numeroMM} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de MM</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBT.fechaMM} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de RD</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBT.numeroRD} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de RD</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBT.fechaRD} />
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

export default TramitarBorradoraTesis;
