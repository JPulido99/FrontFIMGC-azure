import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Form, Table, InputGroup, Button, Row, Col, OverlayTrigger, Tooltip, Alert, Modal } from 'react-bootstrap';
import useGet from '../../hooks/useGet';
import AuthContext from '../../Context/AuthProvider';
import useTooltips from '../../utilitarios/useTooltips';

const TramitarBachiller = () => {
  const { user } = useContext(AuthContext);

  const [escuelas, obtenerEscuelas] = useGet("https://backfimgc.azurewebsites.net/api/escuela/list");
  useEffect(() => {
    obtenerEscuelas()
  }, [])

  //Para los tooltip
  const { renderTooltip } = useTooltips();

  const [telefono, setTelefono] = useState('');
  const [selectedEscuelaId, setSelectedEscuelaId] = useState('');
  const [planesDeEstudio, setPlanesDeEstudio] = useState([]);

  //Para el modal exitoso
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [formularioEnviado, setFormularioEnviado] = useState(false);


  //Para el modal en el que se ven los datos ingresados
  const [modalDatosBH, setModalDatosBH] = useState(false);
  const handleOcultarDBH = () => setModalDatosBH(false);

  //Para el alert
  const [showAlertBH, setShowAlertBH] = useState(false);

  //Para los datos a visualizarse en el modal
  const [prevDatosBH, setPrevDatosBH] = useState({});


  const [expediente, setExpediente] = useState({
    nroExpediente: '',
    fechaPresentacion: '',
    instancia: '',
    estado: '',

    concursoAdmision: '',
    nroResolucionIngreso: '',
    fechaPrimMatricula: '',
    fechaEgreso: '',
    nroCertEstudios: '',
    fechaCertEstudios: '',
    codReciboCaja: '',
    fechaReciboCaja: '',
    idPlan: '',
  });


  //Función para limpiar luego de Tramitar
  const limpiarFormulario = () => {
    setExpediente({
      nroExpediente: '',
      fechaPresentacion: '',
      instancia: '',
      estado: '',

      concursoAdmision: '',
      nroResolucionIngreso: '',
      fechaPrimMatricula: '',
      fechaEgreso: '',
      nroCertEstudios: '',
      fechaCertEstudios: '',
      codReciboCaja: '',
      fechaReciboCaja: '',
      idPlan: '',
    });
    setSelectedEscuelaId('');
    setSelectedModalidadId('');
    setTelefono('');
  };



  const handleInputChange2 = async (event) => {
    const { name, value } = event.target;

    if (name === 'escuela') {
      setSelectedEscuelaId(value);
      const escuelaData = await obtenerNombreEscuela(value);
      setPlanesDeEstudio(escuelaData.planesDeEstudio); // Actualiza los planes de estudio asociados a la escuela
    } else if (name === 'modalidadIngreso') {
      setSelectedModalidadId(value);
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
      expediente.concursoAdmision === '' ||
      expediente.codReciboCaja === '' ||
      expediente.fechaEgreso === '' ||
      expediente.fechaPrimMatricula === '' ||
      expediente.fechaReciboCaja === '' ||
      expediente.nroCertEstudios === '' ||
      expediente.fechaCertEstudios === '' ||
      expediente.nroResolucionIngreso === '' ||
      expediente.idPlan === '' ||

      telefono === ''
    ) {
      setShowAlertBH(true);
      setVisualizarClicked(false); // Si hay campos vacíos, deshacer el clic del botón Visualizar
    } else {
      setShowAlertBH(false);
      const escuelaSeleccionada = await obtenerNombreEscuela(selectedEscuelaId);
      const modalidadSeleccionada = await obtenerNombreModalidad(selectedModalidadId);
      setPrevDatosBH({
        numeroexp: expediente.nroExpediente,
        fechapre: expediente.fechaPresentacion,
        concursoAdm: expediente.concursoAdmision,
        codReciboCaj: expediente.codReciboCaja,
        fechaEgr: expediente.fechaEgreso,
        fechaPrimMat: expediente.fechaPrimMatricula,
        fechaReciboCaj: expediente.fechaReciboCaja,
        nroCertEst: expediente.nroCertEstudios,
        fechaCertEst: expediente.fechaCertEstudios,
        nroResolucionIng: expediente.nroResolucionIngreso,
        idPla: expediente.idPlan,

        escuelaNombre: escuelaSeleccionada.nombreEscuela,
        modalidadNombre: modalidadSeleccionada,
        telefono: telefono,
      });
      setModalDatosBH(true);
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
        `https://backfimgc.azurewebsites.net/api/expediente/${user.id}/expedienteUserEscuelaBachiller?escuelaId=${selectedEscuelaId}&modalidadIngresoId=${selectedModalidadId}&telefono=${telefono}`,
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








  //Para guardar el valor del select (se utilizará para desplegar la parte de los créditos y planes)
  const [epSelect, setepSelect] = useState("Seleccione");
  const [escuelaID, setEscuelaID] = useState('');
  const escuelaSeleccionada = (e) => {
    setepSelect(e.target.value); //aquí se le cambia el valor al epSelect de acuerdo a la opción seleccionada en el select.
    setEscuelaID(e.target.value);
  };


  //Para Modalidad, plan y escuela
  const [modalidades, setModalidades] = useState([]);
  const [selectedModalidadId, setSelectedModalidadId] = useState("");
  useEffect(() => {
    axios
      .get("https://backfimgc.azurewebsites.net/api/modalidadIngreso/list")
      .then((response) => {
        setModalidades(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);



  const obtenerNombreEscuela = (selectedEscuelaId) => {
    setSelectedEscuelaId(selectedEscuelaId);

    // Promesa para obtener el nombre de la escuela
    const nombreEscuelaPromise = axios
      .get(`https://backfimgc.azurewebsites.net/api/escuela/${selectedEscuelaId}`)
      .then((response) => response.data.nombre)

      .catch((error) => {
        console.error(error);
        return "Bueh, se hizo el intento.";
      });

    // Promesa para obtener la lista de planes de estudio
    const planesDeEstudioPromise = axios
      .get(`https://backfimgc.azurewebsites.net/api/escuela/${selectedEscuelaId}/planes`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        return []; // En caso de error, se puede devolver una lista vacía o manejar el error según la lógica de tu aplicación.
      });
    // Esperar a que ambas promesas se resuelvan
    return Promise.all([nombreEscuelaPromise, planesDeEstudioPromise]).then(
      ([nombreEscuela, planesDeEstudio]) => {
        return {
          nombreEscuela,
          planesDeEstudio,
        };
      }
    );
  };

  const obtenerNombreModalidad = (selectedModalidadId) => {
    // Realiza una consulta a tu API para obtener el nombre de la escuela por su ID
    return axios
      .get(`https://backfimgc.azurewebsites.net/api/modalidadIngreso/${selectedModalidadId}`)
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
            <legend className='customize-legend text-uppercase'>Solicitar Obtención del grado académico de bachiller</legend>

            <Form.Group as={Row} className="mb-3">
              <Form.Label
                column
                sm="4"
                name="escuela"
                className="fw-bold customize-label"
              >
                Escuela profesional
              </Form.Label>
              <Col sm="8">
                <Form.Select required aria-label="Escuela profesional" name="escuela" value={selectedEscuelaId} onChange={handleInputChange2}>
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
              <Form.Label column sm="4" className="fw-bold customize-label">
                Modalidad de ingreso a la universidad
              </Form.Label>
              <Col sm="3">
                <Form.Select required aria-label="Modalidad de ingreso" name="modalidadIngreso" value={selectedModalidadId} onChange={handleInputChange2} >
                  <option>Seleccione</option>
                  {modalidades.map((modalidad) => (
                    <option key={modalidad.id} value={modalidad.id}>
                      {modalidad.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">
                Concurso de admisión
              </Form.Label>
              <Col sm="2">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'concursoAdmision')}>
                  <Form.Control required type="text" name="concursoAdmision" value={expediente.concursoAdmision} onChange={handleInputChange2} />
                </OverlayTrigger>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">
                Resolución de ingreso
              </Form.Label>
              <Col sm="3">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'resolucionIngreso')}>
                  <Form.Control required as="textarea" name="nroResolucionIngreso" value={expediente.nroResolucionIngreso} onChange={handleInputChange2} />
                </OverlayTrigger>
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">
                Plan de estudios
              </Form.Label>
              <Col sm="2">
                <Form.Select
                  aria-label="Plan de estudios"
                  name="idPlan"
                  value={expediente.idPlan}
                  onChange={handleInputChange2}
                >
                  <option value="">Seleccione</option>
                  {planesDeEstudio.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.nombrePlan}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">
                Fecha de primera matrícula
              </Form.Label>
              <Col sm="3">
                <Form.Control required type="date" value={expediente.fechaPrimMatricula} onChange={handleInputChange2} name="fechaPrimMatricula" />
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">
                Fecha de egreso
              </Form.Label>
              <Col sm="2">
                <Form.Control required type="date" value={expediente.fechaEgreso} onChange={handleInputChange2} name="fechaEgreso" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">
                Nº de Certificado de estudios
              </Form.Label>
              <Col sm="3">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'certificadoEstudios')}>
                  <Form.Control required type="text" name="nroCertEstudios" value={expediente.nroCertEstudios} onChange={handleInputChange2} />
                </OverlayTrigger>
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">
                Fecha del certificado
              </Form.Label>
              <Col sm="2">
                <Form.Control required type="date" name="fechaCertEstudios" value={expediente.fechaCertEstudios} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">
                Nº de expediente
              </Form.Label>
              <Col sm="3">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'expediente')}>
                  <Form.Control required type="text" name="nroExpediente" value={expediente.nroExpediente} onChange={handleInputChange2} />
                </OverlayTrigger>
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">
                Fecha de ingreso del expediente
              </Form.Label>
              <Col sm="2">
                <Form.Control required type="date" name="fechaPresentacion" value={expediente.fechaPresentacion} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">
                Código de boleta de venta
              </Form.Label>
              <Col sm="3">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'boleta')}>
                  <Form.Control required type="text" name="codReciboCaja" value={expediente.codReciboCaja} onChange={handleInputChange2} />
                </OverlayTrigger>
              </Col>

              <Form.Label column sm="3" className="fw-bold customize-label">
                Fecha de boleta
              </Form.Label>
              <Col sm="2">
                <Form.Control required type="date" name="fechaReciboCaja" value={expediente.fechaReciboCaja} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="4" className="fw-bold customize-label">
                Nº de celular del interesado
              </Form.Label>
              <Col sm="3">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'celular')}>
                  <Form.Control required type="text" name="telefono" value={
                    telefono} onChange={handleInputChange2} />
                </OverlayTrigger>
                <Form.Text muted>
                  En caso sea necesario nos contactaremos a este número.
                </Form.Text>
              </Col>
            </Form.Group>
            {showAlertBH && (
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

        <Modal aria-labelledby="modal-de-docentes" size="lg" show={modalDatosBH}>
          <Modal.Header closeButton onHide={handleOcultarDBH}>
            <Modal.Title className='title-modal1'>Verificar datos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='p-modal-bold'>¿Los datos que se muestran a continuación son correctos?</p>
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Escuela profesional</Form.Label>
                <Col sm="8">
                  <Form.Control plaintext readOnly value={prevDatosBH.escuelaNombre} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Modalidad de ingreso</Form.Label>
                <Col sm="3">
                  <Form.Control as="textarea" plaintext readOnly value={prevDatosBH.modalidadNombre} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Concurso de admisión</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBH.concursoAdm} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Resolución de ingreso</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBH.nroResolucionIng} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Plan de estudios</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBH.idPla} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Créditos</Form.Label>
                <Col sm="8">
                  <p>Por probar</p>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Fecha de primera matrícula</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBH.fechaPrimMat} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de egreso</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBH.fechaEgr} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de certificado de estudios</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBH.nroCertEst} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha del certificado</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBH.fechaCertEst} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de expediente (MP)</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBH.numeroexp} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha del exp.</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBH.fechapre} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Código de boleta de venta</Form.Label>
                <Col sm="3">
                  <Form.Control plaintext readOnly value={prevDatosBH.codReciboCaj} />
                </Col>

                <Form.Label column sm="3" className="fw-bold customize-label">Fecha de boleta</Form.Label>
                <Col sm="2">
                  <Form.Control plaintext readOnly value={prevDatosBH.fechaReciboCaj} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4" className="fw-bold customize-label">Nº de celular</Form.Label>
                <Col sm="4">
                  <Form.Control plaintext readOnly value={prevDatosBH.telefono} />
                </Col>
              </Form.Group>

              <Button className='customize-btn-1' type="submit" >Tramitar</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default TramitarBachiller
