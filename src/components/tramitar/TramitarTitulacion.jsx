import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Form, Table, InputGroup, Button, Row, Col, OverlayTrigger, Tooltip, Alert, Modal } from 'react-bootstrap';
import useGet from '../../hooks/useGet';
import AuthContext from '../../Context/AuthProvider';


const TramitarTitulacion = () => {
  const {user} = useContext(AuthContext);
  
  const [escuelas, obtenerEscuelas] = useGet("https://fimgc-back.rj.r.appspot.com/api/escuela/list");
  useEffect(() => {
    
    obtenerEscuelas()
  }, [])

  //Para los tooltip
  const tooltipsMensajes = {
    concursoAdmision: "Ejemplo: 2017-II",
    resolucionIngreso: "Ejemplo: Resolución de Consejo Universitario Nº0215-2015-UNSCH-CU",
    expediente: "Ejemplo: 2312286.001",
    planEstudios: "Ejemplo: 2005-R",
    similitud: "Si su índice de similitud es 12%, coloque: 12",
  };

  const renderTooltip = (props, field) => (
    <Tooltip {...props}>{tooltipsMensajes[field]}</Tooltip>
  );

  const [telefono, setTelefono] = useState('');
  const [selectedEscuelaId, setSelectedEscuelaId] = useState('');

  //Para el modal exitoso
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  //Para el modal en el que se ven los datos ingresados
  const [modalDatosTI, setModalDatosTI] = useState(false);
  const handleOcultarDTI = () => setModalDatosTI(false);

  //Para el alert
  const [showAlertTI, setShowAlertTI] = useState(false);

  //Para los datos a visualizarse en el modal
  const [prevDatosTI, setPrevDatosTI] = useState({});


  const [expediente, setExpediente] = useState({
    nroExpediente: '',
    fechaPresentacion: '',

    nroRCU: '',
    fechaObtencionGrado: '',
    tituloTesis: '',
    nroActa: '',
    fechaSustentacion: '',
    similitud: '',
    calificacion: '',
  });


  //Función para limpiar luego de Tramitar
  const limpiarFormulario = () => {
    setExpediente({
      nroExpediente: '',
      fechaPresentacion: '',
      instancia: '',
      estado: '',

      nroRCU: '',
      fechaObtencionGrado: '',
      tituloTesis: '',
      nroActa: '',
      fechaSustentacion: '',
      similitud: '',
      calificacion: '',
    });
    setSelectedEscuelaId('');
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


  // Estado para controlar si el botón Visualizar ha sido clickeado
  const [visualizarClicked, setVisualizarClicked] = useState(false);

  // Habilitar o deshabilitar el botón Tramitar
  const isTramitarDisabled = !(expediente.nroExpediente !== '' && expediente.fechaPresentacion !== '' && telefono !== '');



  const handleVisualizar = async () => {
    if (
      expediente.nroExpediente === '' ||
      expediente.fechaPresentacion === '' ||


      telefono === ''
    ) {
      setShowAlertTI(true);
      setVisualizarClicked(false); // Si hay campos vacíos, deshacer el clic del botón Visualizar
    } else {
      setShowAlertTI(false);
      const escuelaSeleccionada = await obtenerNombreEscuela(selectedEscuelaId);
      setPrevDatosTI({
        nroExp: expediente.nroExpediente,
        fechaPre: expediente.fechaPresentacion,
        tituloTes: expediente.tituloTesis,
        numeroRCU: expediente.nroRCU,
        fechaObtencionGra: expediente.fechaObtencionGrado,
        nroAct: expediente.nroActa,
        fechaSus: expediente.fechaSustentacion,
        sim: expediente.similitud,
        cal: expediente.calificacion,

        escuelaNombre: escuelaSeleccionada,
        telefono: telefono,
      });
      setModalDatosTI(true);
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
        `https://fimgc-back.rj.r.appspot.com/api/expediente/${user.id}/expedienteUserEscuelaTitulo?escuelaId=${selectedEscuelaId}&telefono=${telefono}`,
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



  return (
    <div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <fieldset className='customize-fielset'>
            <legend className='customize-legend text-uppercase'>Solicitar Obtención del título profesional </legend>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Escuela profesional </Form.Label>
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
              <Form.Label column sm="4" className="fw-bold customize-label">Nº de resolucion de consejo universitario</Form.Label>
              <Col sm="3">
                <Form.Control type="text" id="nroRCU" name="nroRCU" placeholder="Ejemplo: Resolución de Consejo Universitario Nº 279-2021-UNSCH-CU (27-07-2021)" value={expediente.nroRCU} onChange={handleInputChange2} />
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">Fecha de obtención de grado</Form.Label>
              <Col sm="2">
                <Form.Control type="date" id="fechaObtencionGrado" name="fechaObtencionGrado" value={expediente.fechaObtencionGrado} onChange={handleInputChange2} />
              </Col>
            </Form.Group>



            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Título de tesis</Form.Label>
              <Col sm="8">
                <Form.Control as="textarea" type="text"
                  id="tituloTesis" name="tituloTesis" placeholder="Ingrese el título de su trabajo de investigación." value={expediente.tituloTesis} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Nº de acta de sustentación</Form.Label>
              <Col sm="3">
                <Form.Control type="text" id="nroActa" name="nroActa" placeholder="Ejemplo: Acta de sustentacion Nº 279-2021-UNSCH-CU" value={expediente.nroActa} onChange={handleInputChange2} />
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">Fecha de sustentación</Form.Label>
              <Col sm="2">
                <Form.Control type="date" id="fechaSustentacion" name="fechaSustentacion" value={expediente.fechaSustentacion} onChange={handleInputChange2} />
              </Col>
            </Form.Group>



            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Índice de similitud</Form.Label>
              <Col sm="3">
                <InputGroup className="mb-3">
                  <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'similitud')}>
                    <Form.Control name="similitud" type="number" min='0' max='30' value={expediente.similitud} onChange={handleInputChange2} />
                  </OverlayTrigger>
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Col>

              <Form.Label column sm="2" className="fw-bold customize-label">Calificación</Form.Label>
              <Col sm="3">
                <Form.Control name="calificacion" type="number" min='0' max='20' value={expediente.calificacion} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">Nº de expediente generado en MP</Form.Label>
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
              <Form.Label column sm="4" className="fw-bold customize-label">Nº de teléfono del interesado</Form.Label>
              <Col sm="3">
                <Form.Control type="text" id="telefono" name="telefono" value={telefono} onChange={handleInputChange2} placeholder="Ingrese su número de celular." />
              </Col>
            </Form.Group>

            {showAlertTI && (
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




        <Modal aria-labelledby="modal-previsulizacion" size="lg" show={modalDatosTI}>
          <Modal.Header closeButton onHide={handleOcultarDTI}>
            <Modal.Title className='title-modal1'>Verificar datos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='p-modal-bold'>¿Los datos que se muestran a continuación son correctos?</p>
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Escuela profesional</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosTI.escuelaNombre} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de RCU</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosTI.numeroRCU} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de obtención de grado</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosTI.fechaObtencionGra} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Título de  tesis</Form.Label>
                <Col sm="8">
                  <Form.Control as="textarea" plaintext readOnly value={prevDatosTI.tituloTes} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de Acta</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosTI.nroAct} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Fecha de sustentación</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosTI.fechaSus} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Porcentaje de similitud</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosTI.sim} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Calificacion</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosTI.cal} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de expediente</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosTI.nroExp} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de ingreso de expediente</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosTI.fechaPre} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de teléfono del interesado</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosTI.telefono} />
                </Col>
              </Form.Group>

            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div >
  )
}

export default TramitarTitulacion