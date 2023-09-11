import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, Container, Form, FormCheck, ListGroup, InputGroup, Button, Row, Col, Table, Modal, Alert, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { unstable_batchedUpdates } from 'react-dom';
import AuthContext from '../Context/AuthProvider';

const ConstTurnitin = () => {

  const { user } = useContext(AuthContext);

  //Para los tooltip
  const tooltipsMensajes = {
    tituloDictamen: "Ejemplo: ..."
  };

  const renderTooltip = (props, field) => (
    <Tooltip {...props}>{tooltipsMensajes[field]}</Tooltip>
  );


  //FUNCION VERIFICAR EXPEDIENTE
  const [nroDoc, setNroDoc] = useState('');
  const [interesadoEmail, setInteresadoEmail] = useState('');

  const [showAlertaExp, setShowAlertaExp] = useState(false);
  const [alertaExp, setAlertaExp] = useState({ message: "", type: "" });

  const mensajesAlert = {
    existe: "Expediente encontrado.",
    noExiste: "Expediente NO encontrado.",
  };

  const verificarExp = async () => {
    const inputNroDoc = document.getElementById('numeroExpCT').value;
    setNroDoc(inputNroDoc);
    console.log(inputNroDoc);
    try {
      const veriResponse = await axios.get(`https://backfimgc.azurewebsites.net/api/expediente/${inputNroDoc}`);
      console.log(veriResponse.data)

      if (veriResponse.data) {
        setAlertaExp({ message: mensajesAlert.existe, type: 'success' });

        const emailiResponse = await axios.get(`https://backfimgc.azurewebsites.net/api/expediente/emaili/${inputNroDoc}`);
        console.log(emailiResponse.data);
        setInteresadoEmail(emailiResponse.data);

      } else {
        setAlertaExp({ message: mensajesAlert.noExiste, type: 'danger' });
      }
    } catch (error) {
      setAlertaExp({ message: 'Ocurrió un error al realizar la solicitud.', type: 'danger' });
    }
    setShowAlertaExp(true);
  };

  //PAL MODAL DE VISUALIZAR
  //Para el modal en el que se ven los datos ingresados
  const [modalDatosCt, setmodalDatosCt] = useState(false);
  const handleOcultarCt = () => setmodalDatosCt(false);

  const [prevDocumento, setprevDocumento] = useState({});

  //PARA SETEAR LOS INPUTS EN EL OBJETO DOCUMENTO

  const [documentoConstancia, setDocumentoConstancia] = useState({
    numeroConstancia: '',
    fechaGeneracion: '',
    indiceSimilitud: '',
    resultado: '',
  });

  const handleInputChange2 = (event) => {
    const { name, value } = event.target;

    setDocumentoConstancia((prevDocumento) => ({
      ...prevDocumento,
      [name]: value,
    }));
  };

  //PARA EL GUARDADO DE DATOS, SUBIDA DE ARCHIVO Y ENVIO DE GMAIL
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const handleArchivoChange = (event) => {
    const file = event.target.files[0];
    setArchivoSeleccionado(file);
  };

  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [envioExitoso, setEnvioExitoso] = useState(false);
  
  const [shouldReload, setShouldReload] = useState(false);

  const enviarCorreo = async () => {
    setEnviandoCorreo(true);
    // Primero, realizamos la carga del archivo al backend
    try {
      // Envía el datos de documento al backend para guardarlo
      const dataToSendDoc = {
        "numeroDocumento": documentoConstancia.numeroConstancia,
        "fechaGeneracion": documentoConstancia.fechaGeneracion,
        "indiceSimilitud": documentoConstancia.indiceSimilitud,
        "resultado": documentoConstancia.resultado,
      };
      console.log(dataToSendDoc);
      const documentoResponse = await axios.post(`https://backfimgc.azurewebsites.net/api/documento/${nroDoc}/actualizarConstancia`, dataToSendDoc);
      //const rutaArchivo = uploadResponse.data;
      console.log(documentoResponse);

      if (documentoResponse.data) {
        const formData = new FormData();
        formData.append('file', archivoSeleccionado); // Añade el archivo seleccionado al FormData
        formData.append('nroExpediente', nroDoc);
        // Envía el archivo al backend para guardarlo
        const uploadResponse = await axios.post('https://backfimgc.azurewebsites.net/api/expediente/upload', formData);
        const rutaArchivo = uploadResponse.data;

        if (uploadResponse.data) {
          // Si la carga del archivo fue exitosa, continuamos con el envío del correo electrónico
          const recipientEmail = documentoConstancia.resultado === "Apto"
            ? "junior.pulido.27@unsch.edu.pe" // Replace this with the appropriate email address for Apto resultado
            : interesadoEmail; // Replace this with the appropriate email address for No Apto resultado

          // Creamos el objeto con los datos para el correo electrónico
          const dataToSendEmail = {
            "to": [recipientEmail],
            "subject": "Constancia de originalidad Borrador de Tesis (Const+Dict+MM+Exp)",
            "body": "Holiwi :3",
            "pdfFilePath": rutaArchivo
          };
          const sendResponse = await axios.post('https://backfimgc.azurewebsites.net/sendEmail', dataToSendEmail);
          console.log('Correo enviado:', sendResponse.data);
          setEnvioExitoso(true);          
          setShouldReload(true);
        } else {
          console.log('Error al cargar el archivo PDF.');
        }
      } else
        console.log('Error al actualiar los campos de documento.');
    } catch (error) {
      console.error('Error al realizar la carga del archivo o enviar el correo electrónico:', error);
    } finally {
      setEnviandoCorreo(false);
    }
  };

  //ACCION DE CLICK EN BOTON
  const VerificarGuardarEnviar = () => {
    setprevDocumento({

      numeroDoc: documentoConstancia.numeroConstancia,
      fechaGen: documentoConstancia.fechaGeneracion,
      indiceSim: documentoConstancia.indiceSimilitud,
      res: documentoConstancia.resultado,

    });
    console.log(prevDocumento);
    setmodalDatosCt(true);

  }

  return (
    <div>
      <Container>
        <Form>
          <fieldset className='customize-fielset'>
            <legend className='customize-legend text-uppercase'>Enviar constancia de originalidad</legend>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label">Nº de expediente</Form.Label>
              <Col sm="10">
                <InputGroup>
                  <Form.Control type="text" placeholder="Ingrese el número de expediente."
                    aria-label="Ingrese el número de expediente."
                    aria-describedby="basic-addon1" id="numeroExpCT"
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

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label">Título de constancia</Form.Label>
              <Col sm="5">
                <OverlayTrigger placement="top" delay={{ show: 170, hide: 430 }} overlay={(props) => renderTooltip(props, 'tituloDictamen')}>
                  <Form.Control type="text"
                    aria-label="Ingrese el título de constancia" id="numeroConstancia" name="numeroConstancia" placeholder="Ejemplo: dictamen segun criterio escuelas"
                    value={documentoConstancia.numeroConstancia}
                    aria-describedby="basic-addon1" onChange={handleInputChange2}
                  />
                </OverlayTrigger>
              </Col>

              <Form.Label column sm="2" className="fw-bold customize-label">Fecha de constancia</Form.Label>
              <Col sm="3">
                <Form.Control type="date" id="fechaGeneracion" name="fechaGeneracion" value={documentoConstancia.fechaGeneracion} onChange={handleInputChange2} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label">Índice de similitud</Form.Label>
              <Col sm="4">
                <Form.Control id="indiceSimilitud" name="indiceSimilitud" type="number" value={documentoConstancia.indiceSimilitud} onChange={handleInputChange2} />
              </Col>

              <Form.Label column sm="2" className="fw-bold customize-label">
                Resultado
              </Form.Label>
              <Col sm="4">
                <FormCheck
                  inline
                  label="Apto"
                  name="resultado"
                  value="Apto"
                  type="radio"
                  checked={documentoConstancia.resultado === "Apto"}
                  onChange={handleInputChange2}
                />
                <FormCheck
                  inline
                  label="No apto"
                  name="resultado"
                  value="No apto"
                  type="radio"
                  checked={documentoConstancia.resultado === "No apto"}
                  onChange={handleInputChange2}
                />
              </Col>

            </Form.Group>


            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="2" className="fw-bold customize-label"><i className="fi fi-bs-file-upload"></i> Subir constancia</Form.Label>
              <Col sm="10">
                <InputGroup>
                  <Form.Control name="pdf" type="file" onChange={handleArchivoChange} />
                  <Button variant="outline-dark" onClick={VerificarGuardarEnviar} >Enviar  <i className="fi fi-bs-paper-plane"></i></Button>
                </InputGroup>
              </Col>
            </Form.Group>
          </fieldset>
        </Form>

        <Modal aria-labelledby="modal-previsulizacion" size="lg" show={modalDatosCt}>

          {envioExitoso ? (
            <>
              <Modal.Header closeButton onHide={() => {
                handleOcultarCt();
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

              <Modal.Header closeButton onHide={handleOcultarCt}>
                <Modal.Title className='title-modal1'>Verificar datos</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className='p-modal-bold'>¿Los datos que se muestran a continuación son correctos?</p>
                <Form>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4" className="fw-bold customize-label">Número de Constancia</Form.Label>
                    <Col sm="8">
                      <Form.Control plaintext readOnly value={prevDocumento.numeroDoc} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-4">
                    <Form.Label column sm="3" className="fw-bold customize-label">Fecha de Constancia</Form.Label>
                    <Col sm="2">
                      <Form.Control plaintext readOnly value={prevDocumento.fechaGen} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-4">
                    <Form.Label column sm="3" className="fw-bold customize-label">Índice de similitud</Form.Label>
                    <Col sm="2">
                      <Form.Control plaintext readOnly value={prevDocumento.indiceSim} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-4">
                    <Form.Label column sm="3" className="fw-bold customize-label">Resultado</Form.Label>
                    <Col sm="2">
                      <Form.Control plaintext readOnly value={prevDocumento.res} />
                    </Col>
                  </Form.Group>
                </Form>
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

export default ConstTurnitin