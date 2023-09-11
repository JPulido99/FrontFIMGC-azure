import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, Container, Form, ListGroup, InputGroup, Button, Row, Col, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const GenerarResolucion = () => {
  //Para captar el tramite del expediente ingresado
  const [tramiteExpediente, setTramiteExpediente] = useState('');

  //FUNCION VERIFICAR EXPEDIENTE
  const [nroDoc, setNroDoc] = useState('');

  const [showAlertaExp, setShowAlertaExp] = useState(false);
  const [alertaExp, setAlertaExp] = useState({ message: "", type: "" });

  const mensajesAlerta = {
    existe: "Expediente encontrado.",
    noExiste: "Expediente NO encontrado.",
  };

  const verificarExp = async () => {
    const inputNroDoc = document.getElementById('numeroExpRDP').value;
    setNroDoc(inputNroDoc);
    console.log(inputNroDoc);
    try {
      const veriResponse = await axios.get(`https://fimgc-back.rj.r.appspot.com/api/expediente/${inputNroDoc}`);
      console.log(veriResponse.data);
      setTramiteExpediente(veriResponse.data.tramite.nombre);
      console.log(veriResponse.data.tramite.nombre);

      const emailiResponse = await axios.get(`https://fimgc-back.rj.r.appspot.com/api/expediente/todoi/${inputNroDoc}`);
      console.log(emailiResponse.data);

      //destinatarios.push({id: '2', firstName: 'Usuario', LastName: 'Interesado', username: 'emailiResponse.data'});

      destinatarios.push(emailiResponse.data);

      if (veriResponse.data.tramite.nombre === 'Plan de Tesis' || veriResponse.data.tramite.nombre === 'Borrador de Tesis') {
        setAlertaExp({ message: mensajesAlerta.existe, type: 'success' });

        // Mover esta línea de código debajo de setTramiteExpediente
        destinatarios.push(veriResponse.data.presidente, veriResponse.data.miembro, veriResponse.data.asesor);
        //SOLUCIONAR LA CUESTION DEL CORREO DEL INTERESADO
        console.log(destinatarios);


      } else if (veriResponse.data.tramite.nombre === 'Obtención de Bachiller' || veriResponse.data.tramite.nombre === 'Obtención de Título Profesional') {
        setAlertaExp({ message: mensajesAlerta.existe, type: 'success' });

        // Mover esta línea de código debajo de setTramiteExpediente
        destinatarios.push(veriResponse.data.presidente, veriResponse.data.miembro);
        //SOLUCIONAR LA CUESTION DEL CORREO DEL INTERESADO
        console.log(destinatarios);


      } else {
        setAlertaExp({ message: mensajesAlerta.noExiste, type: 'danger' });
      }
    } catch (error) {
      setAlertaExp({ message: 'Ocurrió un error al realizar la solicitud.', type: 'danger' });
      console.error('Error al realizar la solicitud:', error);
    }
    setShowAlertaExp(true);
  };



  //PARA LO DE BORRADOR
  const [documento, setDocumento] = useState({
    lugarSustentacion: '',
    horaSustentacion: '',
    fechaSustentacion: '',
  });



  //PARA LO DE TITULO
  const [fechaSesionCF, setFechaSesionCF] = useState('')

  const handleFechaSesionCFChange = (event) => {
    setFechaSesionCF(event.target.value)
  }

  //Función para limpiar luego de Tramitar
  const limpiarFormulario = () => {
    setDocumento({
      lugarSustentacion: '',
      horaSustentacion: '',
      fechaSustentacion: '',
    });
    setNombreSecredocente('');
  };

  //Para el modal docentes
  const [modalDocentes, setModaldocentes] = useState(false);
  const handleHide = () => setModaldocentes(false);

  //Para buscar docentes
  const [nombre, setNombre] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [nombreSecredocente, setNombreSecredocente] = useState('');
  const [secredocenteId, setSecredocenteId] = useState('');


  const handleNombreChange = (event) => {
    setNombreSecredocente(event.target.value);
  };

  const handleBuscarClick = () => {
    axios
      .get(`https://fimgc-back.rj.r.appspot.com/users/buscarDocentes?firstName=${nombreSecredocente}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setDocentes(response.data);
          setModaldocentes(true);
          setSecredocenteId(response.data[0].id);
        } else {
          console.log('La respuesta del servidor está vacía o incompleta.');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSeleccionarDocente = (docente) => {
    setNombreSecredocente(`${docente.firstName} ${docente.lastName}`);
    setModaldocentes(false);
  };


  //Para el change
  const handleInputChangeBo = async (event) => {
    const { name, value } = event.target;

    // Validar que solo se ingresen números para campos específicos
    const validations = {
      fechaSustentacion: /^.*$/,
      horaSustentacion: /^[0-9.:]+$/, // Puedes ajustar la expresión regular según lo necesario
      lugarSustentacion: /^.*$/, // Permitir cualquier valor en lugarSustentacion
    };

    if (validations[name] && (value === '' || validations[name].test(value))) {
      setDocumento((prevDocumento) => ({
        ...prevDocumento,
        [name]: value,
      }));
    }
  };




  //FUNCION PARA GENERAR LA RESOLUCION- INCLUYE ACTUALIZACION DE FECHA_GENERACION
  //Para mandar el form a la base de datos
  const handleGenerar = () => {

    if (tramiteExpediente === 'Borrador de Tesis') {
      // Enviar la información al backend
      axios
        .post(`https://fimgc-back.rj.r.appspot.com/api/documento/${nroDoc}/actualizarSustentacion?secredocenteId=${secredocenteId}`, documento)
        .then((response) => {
          // Procesar la respuesta del backend si es necesario
          console.log('Expediente creado exitosamente:', response.data);

          //Endpoint de generaacion
          const url = `https://fimgc-back.rj.r.appspot.com/reporte/RDBorrador/download?NroExp=${nroDoc}&tipo=PDF`;
          window.open(url, '_blank');
        })
        .catch((error) => {
          // Manejar errores si los hay
          console.error('Error al crear el expediente:', error);
        });

    } else if (tramiteExpediente === 'Obtención de Bachiller') {
      // Enviar la información al backend
      const fechaSesionCFDate = new Date(fechaSesionCF); // Convert fechaSesionCF string to Date
      axios
        .post(`https://fimgc-back.rj.r.appspot.com/api/documento/${nroDoc}/actualizarSesionCF?fechaSesionCF=${fechaSesionCFDate}`)
        .then((response) => {
          // Procesar la respuesta del backend si es necesario
          console.log('Expediente creado exitosamente:', response.data);

          //Endpoint de generaacion
          const url = `https://fimgc-back.rj.r.appspot.com/reporte/RCFBachiller/download?NroExp=${nroDoc}&tipo=PDF`;
          window.open(url, '_blank');
        })
        .catch((error) => {
          // Manejar errores si los hay
          console.error('Error al crear el expediente:', error);
        });

    } else if (tramiteExpediente === 'Obtención de Título Profesional') {
      // Enviar la información al backend
      const fechaSesionCFDate = new Date(fechaSesionCF); // Convert fechaSesionCF string to Date
      axios
        .post(`https://fimgc-back.rj.r.appspot.com/api/documento/${nroDoc}/actualizarSesionCF?fechaSesionCF=${fechaSesionCFDate}`)
        .then((response) => {
          // Procesar la respuesta del backend si es necesario
          console.log('Expediente creado exitosamente:', response.data);

          //Endpoint de generaacion
          const url = `https://fimgc-back.rj.r.appspot.com/reporte/RCFTitulo/download?NroExp=${nroDoc}&tipo=PDF`;
          window.open(url, '_blank');
        })
        .catch((error) => {
          // Manejar errores si los hay
          console.error('Error al crear el expediente:', error);
        });

    } else {
      const url = `https://fimgc-back.rj.r.appspot.com/reporte/RDPlan/download?NroExp=${nroDoc}&tipo=PDF`;
      window.open(url, '_blank');
    }

  };


  //PAL MODAL DE VISUALIZAR
  //Para el modal en el que se ven los datos ingresados
  const [modalDestinatarios, setModalDestinatarios] = useState(false);
  const handleOcultarRD = () => setModalDestinatarios(false);
  const handleMostrarRD = () => setModalDestinatarios(true);

  const [destinatarios, setDestinatarios] = useState([]);



  //PARA SUBIR ARCHIVOS
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const handleArchivoChange = (event) => {
    const file = event.target.files[0];
    setArchivoSeleccionado(file);
  };



  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [envioExitoso, setEnvioExitoso] = useState(false);

  const [shouldReload, setShouldReload] = useState(false);

  //FUNCION PARA ENVIAR CORREO
  const enviarCorreo = async () => {
    setEnviandoCorreo(true);
    // Primero, realizamos la carga del archivo al backend
    try {
      const formData = new FormData();
      formData.append('file', archivoSeleccionado); // Añade el archivo seleccionado al FormData
      formData.append('nroExpediente', nroDoc);

      // Envía el archivo al backend para guardarlo
      const uploadResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/api/expediente/upload', formData);
      const rutaArchivo = uploadResponse.data;

      if (uploadResponse.data && tramiteExpediente === 'Obtención de Bachiller') {
        // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
        //docentesSeleccionados.push(objAsesor);
        const correos = destinatarios.map((destinatario) => destinatario.username);
        // Creamos el objeto con los datos para el correo electrónico
        const dataToSend = {
          "to": correos,
          "subject": "Aprobacion de Grado Académico de Bachiller (RCF+Dict+MM+Exp)",
          "body": "Estimados docentes, se remite el RCF de obtencion del grado Bachiller.",
          "pdfFilePath": rutaArchivo
        };
        const sendResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/sendEmail', dataToSend);
        console.log('Correo enviado:', sendResponse.data);
        setEnvioExitoso(true);
        setShouldReload(true);

      } else if (uploadResponse.data && tramiteExpediente === 'Plan de Tesis') {
        // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
        const correos = destinatarios.map((destinatario) => destinatario.username);
        // Creamos el objeto con los datos para el correo electrónico
        const dataToSend = {
          "to": correos,
          "subject": "Aprobacion de Plan de Tesis (RD+Dic+MM+Exp)",
          "body": "Estimados docentes, se remite la Resolucion de aprobacion del Plan de Tesis del Bach.",
          "pdfFilePath": rutaArchivo
        };
        const sendResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/sendEmail', dataToSend);
        console.log('Correo enviado:', sendResponse.data);
        setEnvioExitoso(true);
        setShouldReload(true);

      } else if (uploadResponse.data && tramiteExpediente === 'Borrador de Tesis') {
        // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
        const correos = destinatarios.map((destinatario) => destinatario.username);
        // Creamos el objeto con los datos para el correo electrónico
        const dataToSend = {
          "to": correos,
          "subject": "Aprobacion de Borrador de Tesis (RD+CO+Dic+MM+Exp)",
          "body": "Estimados docentes, se remite la Resolucion de aprobacion del borrador de Tesis del Bach.",
          "pdfFilePath": rutaArchivo
        };
        const sendResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/sendEmail', dataToSend);
        console.log('Correo enviado:', sendResponse.data);
        setEnvioExitoso(true);
        setShouldReload(true);

      } else if (uploadResponse.data && tramiteExpediente === 'Obtención de Título Profesional') {
        // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
        //docentesSeleccionados.push(objAsesor);
        const correos = destinatarios.map((destinatario) => destinatario.username);
        // Creamos el objeto con los datos para el correo electrónico
        const dataToSend = {
          "to": correos,
          "subject": "Aprobacion de Título Profesional (RCF+Dict+MM+Exp)",
          "body": "Estimados docentes, se remite el RCF de obtencion del titulo profesional del Bach.",
          "pdfFilePath": rutaArchivo
        };
        const sendResponse = await axios.post('https://fimgc-back.rj.r.appspot.com/sendEmail', dataToSend);
        console.log('Correo enviado:', sendResponse.data);
        setEnvioExitoso(true);
        setShouldReload(true);

      } else {
        console.log('Error al cargar el archivo PDF.');
      }
    } catch (error) {
      console.error('Error al realizar la carga del archivo o enviar el correo electrónico:', error);
    } finally {
      setEnviandoCorreo(false);
  }
  };


  return (
    <div>
      <Container>
        <Form>
          <fieldset className='customize-fielset'>
            <legend className='customize-legend-2 text-uppercase'>Generar resolución | ,,,</legend>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label">Nº de expediente</Form.Label>
              <Col sm="9">
                <InputGroup>
                  <Form.Control type="text" placeholder="Ingrese el número de expediente." id="numeroExpRDP"
                    aria-label="Ingrese el número de expediente."
                    aria-describedby="basic-addon1"
                  />
                  <Button variant="outline-dark" onClick={verificarExp}><i className="fi fi-bs-search-alt"></i> Verificar</Button>
                </InputGroup>
                {showAlertaExp && (
                  <Alert variant={alertaExp.type} className='customize-alert-input' show={showAlertaExp}>
                    {alertaExp.message}
                  </Alert>
                )}
              </Col>
            </Form.Group>

            {tramiteExpediente == "Borrador de Tesis" && (
              <>
                <legend className='customize-legend-5 text-uppercase'>Programar sustentación</legend>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3" className="fw-bold customize-label">Fecha de sustentación</Form.Label>
                  <Col sm="2">
                    <Form.Control type="date" id="fechaSustentacion" name="fechaSustentacion" value={documento.fechaSustentacion} onChange={handleInputChangeBo} />
                  </Col>
                  <Form.Label column sm="4" className="fw-bold customize-label">Hora de sustentación</Form.Label>
                  <Col sm="3">
                    <Form.Control type="text" id="horaSustentacion" name="horaSustentacion" placeholder="Ejemplo:232543.001" value={documento.horaSustentacion} onChange={handleInputChangeBo} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4" className="fw-bold customize-label">Lugar de sustentación</Form.Label>
                  <Col sm="3">
                    <Form.Control type="text" id="lugarSustentacion" name="lugarSustentacion" placeholder="Ejemplo:232543.001" value={documento.lugarSustentacion} onChange={handleInputChangeBo} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="4" className="fw-bold customize-label">Nombre de su asesor</Form.Label>
                  <Col sm="8">
                    <InputGroup>
                      <Form.Control type="text" id="nombreSecredocente" name="nombreSecredocente" placeholder="Ingrese el nombre del secretario docente." value={nombreSecredocente} onChange={handleNombreChange} />
                      <Button variant="outline-dark" id="button-addon2" onClick={handleBuscarClick}><i className="fi fi-bs-search"></i> Buscar</Button>
                    </InputGroup>
                  </Col>
                </Form.Group>
              </>
            )}

            {(tramiteExpediente == "Obtención de Título Profesional" || tramiteExpediente == "Obtención de Bachiller") && (
              <>
                <legend className='customize-legend-5 text-uppercase'>Consejo de Facultad</legend>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="3" className="fw-bold customize-label">Fecha de la sesión</Form.Label>
                  <Col sm="5">
                    <Form.Control type="date" id="fechaSesionCF" name="fechaSesionCF" value={fechaSesionCF} onChange={handleFechaSesionCFChange} />
                  </Col>
                </Form.Group>
              </>
            )}

            <div className="col-md-2 mx-auto">
              <Button variant="success btn-into-row" onClick={handleGenerar}>Generar <i className="fi fi-bs-document"></i></Button>
            </div>


            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="3" className="fw-bold customize-label"><i className="fi fi-bs-file-upload"></i> Subir nuevo expediente</Form.Label>
              <Col sm="9">
                <InputGroup>
                  <Form.Control name="pdf" type="file" onChange={handleArchivoChange} />
                  <Button variant="outline-dark" onClick={handleMostrarRD}>Enviar  <i className="fi fi-bs-paper-plane"></i></Button>
                </InputGroup>
              </Col>
            </Form.Group>



          </fieldset>
        </Form>



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






        <Modal aria-labelledby="modal-de-destinatarios" size="lg" centered show={modalDestinatarios}>

          {envioExitoso ? (
            <>
              <Modal.Header closeButton onHide={() => {
                handleOcultarRD();
                if (shouldReload) {
                  window.location.reload(); // Reload the page
                }
              }}>
                <Modal.Title className='title-modal1'>Envío exitoso</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Párrafo de prueba: Ëxito al enviar</p>
              </Modal.Body>
            </>
          ) : (
            <>

              <Modal.Header closeButton onHide={handleOcultarRD}>
                <Modal.Title className='title-modal1'>Destinatarios</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container className='table-container'>
                  <Table responsive="sm">
                    <thead className='thead-text-customize'>
                      <tr>
                        <th>Nombre completo</th>
                        <th>Correo electrónico</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinatarios.map((docente) => (
                        <tr key={docente.id}>
                          <td>{`${docente.firstName} ${docente.lastName}`}</td>
                          <td>{docente.username}</td>
                        </tr>
                      ))}

                    </tbody>
                  </Table>
                </Container>

                <div className='customize-btn-div justify-content-end'>
                  <Button className='customize-btn-1' onClick={enviarCorreo} disabled={enviandoCorreo}>
                    {enviandoCorreo ? (
                      <>
                        <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                        <span> Enviando...</span>
                      </>
                    ) : (
                      <>Enviar</>
                    )}
                  </Button>
                </div>
              </Modal.Body>
            </>
          )}
        </Modal>
      </Container>


    </div>
  )
}

export default GenerarResolucion